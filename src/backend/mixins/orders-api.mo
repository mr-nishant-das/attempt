import OrderLib "../lib/orders";
import ProductLib "../lib/products-catalog";
import UserLib "../lib/users";
import CartLib "../lib/cart";
import List "mo:core/List";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import EmailClient "mo:caffeineai-email/emailClient";

mixin (
  orders : List.List<OrderLib.Order>,
  products : List.List<ProductLib.Product>,
  users : List.List<UserLib.UserProfile>,
  carts : List.List<CartLib.Cart>,
) {

  // Derive nextOrderId from max existing order ID so it survives fresh deploys
  var nextOrderId : Nat = orders.foldLeft<Nat, OrderLib.Order>(0, func(mx, o) = if (o.id > mx) o.id else mx) + 1;

  func resolveOrderItem(lineItem : { productId : Nat; quantity : Nat }) : OrderLib.OrderItem {
    switch (ProductLib.getProduct(products, lineItem.productId)) {
      case (?p) {
        let effectivePrice = if (p.discountPercent > 0) {
          p.price - (p.price * p.discountPercent / 100);
        } else { p.price };
        {
          productId = p.id;
          title = p.title;
          price = effectivePrice;
          discountPercent = p.discountPercent;
          quantity = lineItem.quantity;
          imageUrl = if (p.imageUrls.size() > 0) { p.imageUrls[0] } else { "" };
        };
      };
      case null Runtime.trap("Product not found");
    };
  };

  func buildReceiptEmail(order : OrderLib.OrderPublic, customerName : Text, customerPhone : Text) : Text {
    let addr = order.deliveryAddress;

    // Format estimated delivery date
    let estDelivery = switch (order.estimatedDelivery) {
      case (?ts) {
        // ts is in nanoseconds; convert to a rough date string
        let days = (ts - Time.now()) / 1_000_000_000 / 86400;
        "Approximately " # days.toText() # " day(s) from now";
      };
      case null { "To be confirmed" };
    };

    // Build items rows
    var itemRows = "";
    for (item in order.items.values()) {
      let lineTotal = item.price * item.quantity;
      itemRows #= "<tr>"
        # "<td style='padding:8px;border-bottom:1px solid #eee'>" # item.title # "</td>"
        # "<td style='padding:8px;border-bottom:1px solid #eee;text-align:center'>" # item.quantity.toText() # "</td>"
        # "<td style='padding:8px;border-bottom:1px solid #eee;text-align:right'>₹" # (item.price / 100).toText() # "." # (item.price % 100).toText() # "</td>"
        # "<td style='padding:8px;border-bottom:1px solid #eee;text-align:right'>₹" # (lineTotal / 100).toText() # "." # (lineTotal % 100).toText() # "</td>"
        # "</tr>";
    };

    let subtotal = order.totalAmount;
    let deliveryCost = order.deliveryCost;
    let grandTotal = subtotal + deliveryCost;
    let deliveryTypeText = OrderLib.deliveryTypeToText(order.deliveryType);

    let landmarkRow = if (addr.landmark == "") "" else
      "<tr><td style='color:#666;padding:2px 0'>Landmark:</td><td style='padding:2px 0'>" # addr.landmark # "</td></tr>";

    "<html><body style='font-family:Arial,sans-serif;color:#333;max-width:700px;margin:0 auto'>"
    # "<div style='background:#1a5276;color:white;padding:20px;text-align:center'>"
    # "<h1 style='margin:0'>AssamRoots</h1>"
    # "<p style='margin:4px 0'>New Order Receipt</p>"
    # "</div>"
    # "<div style='padding:24px'>"
    # "<h2 style='color:#1a5276'>Order #" # order.id.toText() # "</h2>"
    # "<table style='width:100%;margin-bottom:16px'><tbody>"
    # "<tr><td style='color:#666;padding:2px 0;width:150px'>Customer:</td><td style='padding:2px 0'>" # customerName # "</td></tr>"
    # "<tr><td style='color:#666;padding:2px 0'>Phone:</td><td style='padding:2px 0'>" # customerPhone # "</td></tr>"
    # "<tr><td style='color:#666;padding:2px 0'>Payment:</td><td style='padding:2px 0'>" # order.paymentMethod # "</td></tr>"
    # "<tr><td style='color:#666;padding:2px 0'>Delivery:</td><td style='padding:2px 0'>" # deliveryTypeText # "</td></tr>"
    # "<tr><td style='color:#666;padding:2px 0'>Est. Delivery:</td><td style='padding:2px 0'>" # estDelivery # "</td></tr>"
    # "</tbody></table>"
    # "<h3 style='color:#1a5276;border-bottom:2px solid #1a5276;padding-bottom:8px'>Delivery Address</h3>"
    # "<table style='margin-bottom:16px'><tbody>"
    # "<tr><td style='color:#666;padding:2px 0;width:150px'>Name:</td><td style='padding:2px 0'>" # addr.name # "</td></tr>"
    # "<tr><td style='color:#666;padding:2px 0'>Phone:</td><td style='padding:2px 0'>" # addr.phone # "</td></tr>"
    # "<tr><td style='color:#666;padding:2px 0'>House/Flat:</td><td style='padding:2px 0'>" # addr.houseNo # "</td></tr>"
    # "<tr><td style='color:#666;padding:2px 0'>Street:</td><td style='padding:2px 0'>" # addr.street # "</td></tr>"
    # "<tr><td style='color:#666;padding:2px 0'>Locality:</td><td style='padding:2px 0'>" # addr.locality # "</td></tr>"
    # landmarkRow
    # "<tr><td style='color:#666;padding:2px 0'>City:</td><td style='padding:2px 0'>" # addr.city # "</td></tr>"
    # "<tr><td style='color:#666;padding:2px 0'>District:</td><td style='padding:2px 0'>" # addr.district # "</td></tr>"
    # "<tr><td style='color:#666;padding:2px 0'>State:</td><td style='padding:2px 0'>" # addr.state # "</td></tr>"
    # "<tr><td style='color:#666;padding:2px 0'>Pincode:</td><td style='padding:2px 0'>" # addr.pincode # "</td></tr>"
    # "</tbody></table>"
    # "<h3 style='color:#1a5276;border-bottom:2px solid #1a5276;padding-bottom:8px'>Order Items</h3>"
    # "<table style='width:100%;border-collapse:collapse'>"
    # "<thead><tr style='background:#f2f2f2'>"
    # "<th style='padding:8px;text-align:left'>Product</th>"
    # "<th style='padding:8px;text-align:center'>Qty</th>"
    # "<th style='padding:8px;text-align:right'>Unit Price</th>"
    # "<th style='padding:8px;text-align:right'>Total</th>"
    # "</tr></thead><tbody>"
    # itemRows
    # "</tbody></table>"
    # "<table style='width:100%;margin-top:16px'><tbody>"
    # "<tr><td style='text-align:right;padding:4px 0'>Subtotal:</td><td style='text-align:right;padding:4px 0;width:120px'>₹" # (subtotal / 100).toText() # "." # (subtotal % 100).toText() # "</td></tr>"
    # "<tr><td style='text-align:right;padding:4px 0'>" # deliveryTypeText # " Cost:</td><td style='text-align:right;padding:4px 0'>₹" # (deliveryCost / 100).toText() # "." # (deliveryCost % 100).toText() # "</td></tr>"
    # "<tr style='font-weight:bold;font-size:16px'><td style='text-align:right;padding:8px 0;border-top:2px solid #1a5276'>Grand Total:</td><td style='text-align:right;padding:8px 0;border-top:2px solid #1a5276'>₹" # (grandTotal / 100).toText() # "." # (grandTotal % 100).toText() # "</td></tr>"
    # "</tbody></table>"
    # "</div>"
    # "<div style='background:#f8f8f8;padding:16px;text-align:center;color:#666;font-size:13px'>"
    # "<p>AssamRoots — Connecting you with authentic Assamese products</p>"
    # "</div>"
    # "</body></html>";
  };

  public shared ({ caller }) func createOrder(input : OrderLib.CreateOrderInput) : async OrderLib.OrderPublic {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    if (input.items.size() == 0) Runtime.trap("Order must have at least one item");

    // Validate stock
    for (lineItem in input.items.values()) {
      switch (ProductLib.getProduct(products, lineItem.productId)) {
        case (?p) {
          if (p.stock < lineItem.quantity) Runtime.trap("Insufficient stock for: " # p.title);
        };
        case null Runtime.trap("Product not found: " # lineItem.productId.toText());
      };
    };

    // Resolve items and compute subtotal
    let resolvedItems = input.items.map(resolveOrderItem);
    var subtotal : Nat = 0;
    for (item in resolvedItems.values()) {
      subtotal += item.price * item.quantity;
    };

    // Deduct stock
    for (lineItem in input.items.values()) {
      switch (ProductLib.getProduct(products, lineItem.productId)) {
        case (?p) {
          ignore ProductLib.updateStock(products, p.id, p.stock - lineItem.quantity);
        };
        case null {};
      };
    };

    let order = OrderLib.createOrder(orders, nextOrderId, caller, input, resolvedItems, subtotal);
    nextOrderId += 1;

    CartLib.clearCart(carts, caller);

    let orderPublic = OrderLib.toPublic(order);

    // Send receipt email to admin — fire and forget
    let profile = UserLib.getProfile(users, caller);
    let customerName = switch (profile) { case (?p) p.name; case null "Customer" };
    let customerPhone = switch (profile) { case (?p) p.phone; case null "" };
    let htmlBody = buildReceiptEmail(orderPublic, customerName, customerPhone);
    ignore EmailClient.sendServiceEmail(
      "orders",
      ["assamshop@assamroots.shop"],
      "New Order #" # orderPublic.id.toText() # " — AssamRoots",
      htmlBody,
    );

    orderPublic;
  };

  public query ({ caller }) func getMyOrders() : async [OrderLib.OrderPublic] {
    if (caller.isAnonymous()) return [];
    OrderLib.getUserOrders(orders, caller);
  };

  public query ({ caller }) func getOrder(orderId : OrderLib.OrderId) : async ?OrderLib.OrderPublic {
    switch (OrderLib.getOrder(orders, orderId)) {
      case (?o) {
        if (Principal.equal(o.userId, caller) or UserLib.isAdmin(users, caller)) {
          ?OrderLib.toPublic(o);
        } else { null };
      };
      case null null;
    };
  };

  public shared ({ caller }) func adminUpdateOrderStatus(
    orderId : OrderLib.OrderId,
    newStatus : OrderLib.OrderStatus,
    message : Text,
  ) : async ?OrderLib.OrderPublic {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    OrderLib.updateOrderStatus(orders, orderId, newStatus, message);
  };

  public query ({ caller }) func adminGetAllOrders(limit : Nat, offset : Nat) : async [OrderLib.OrderPublic] {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    OrderLib.getAllOrders(orders, limit, offset);
  };

};
