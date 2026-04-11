import OrderLib "../lib/orders";
import ProductLib "../lib/products-catalog";
import UserLib "../lib/users";
import CartLib "../lib/cart";
import List "mo:core/List";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

mixin (
  orders : List.List<OrderLib.Order>,
  products : List.List<ProductLib.Product>,
  users : List.List<UserLib.UserProfile>,
  carts : List.List<CartLib.Cart>,
) {

  stable var nextOrderId : Nat = 1;

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

    // Resolve items and compute total
    let resolvedItems = input.items.map(resolveOrderItem);
    var totalAmount : Nat = 0;
    for (item in resolvedItems.values()) {
      totalAmount += item.price * item.quantity;
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

    let order = OrderLib.createOrder(orders, nextOrderId, caller, input, resolvedItems, totalAmount);
    nextOrderId += 1;

    CartLib.clearCart(carts, caller);

    OrderLib.toPublic(order);
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
