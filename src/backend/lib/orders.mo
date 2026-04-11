import Types "../types/orders";
import List "mo:core/List";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  public type Order = Types.Order;
  public type OrderPublic = Types.OrderPublic;
  public type OrderId = Types.OrderId;
  public type OrderStatus = Types.OrderStatus;
  public type OrderItem = Types.OrderItem;
  public type DeliveryAddress = Types.DeliveryAddress;
  public type ShipmentUpdate = Types.ShipmentUpdate;
  public type CreateOrderInput = Types.CreateOrderInput;

  public func toPublic(o : Order) : OrderPublic {
    {
      id = o.id;
      userId = o.userId;
      items = o.items;
      deliveryAddress = o.deliveryAddress;
      status = o.status;
      shipmentUpdates = o.shipmentUpdates;
      totalAmount = o.totalAmount;
      estimatedDelivery = o.estimatedDelivery;
      createdAt = o.createdAt;
      updatedAt = o.updatedAt;
    };
  };

  public func statusToText(status : OrderStatus) : Text {
    switch (status) {
      case (#Processing) "Processing";
      case (#Confirmed) "Confirmed";
      case (#Shipped) "Shipped";
      case (#OutForDelivery) "Out for Delivery";
      case (#Delivered) "Delivered";
      case (#Cancelled) "Cancelled";
    };
  };

  public func createOrder(
    orders : List.List<Order>,
    nextId : Nat,
    userId : Principal,
    input : CreateOrderInput,
    resolvedItems : [OrderItem],
    totalAmount : Nat,
  ) : Order {
    let now = Time.now();
    let fiveDays : Int = 5 * 24 * 60 * 60 * 1_000_000_000;
    let order : Order = {
      id = nextId;
      userId;
      items = resolvedItems;
      deliveryAddress = input.deliveryAddress;
      var status = #Processing;
      var shipmentUpdates = [{
        status = #Processing;
        message = "Your order has been placed and is being processed.";
        timestamp = now;
      }];
      totalAmount;
      var estimatedDelivery = ?(now + fiveDays);
      createdAt = now;
      var updatedAt = now;
    };
    orders.add(order);
    order;
  };

  public func getOrder(orders : List.List<Order>, orderId : OrderId) : ?Order {
    orders.find<Order>(func(o) = o.id == orderId);
  };

  public func getUserOrders(orders : List.List<Order>, userId : Principal) : [OrderPublic] {
    let userOrders = orders.filter(func(o) = Principal.equal(o.userId, userId));
    userOrders.toArray().map<Order, OrderPublic>(toPublic);
  };

  public func updateOrderStatus(
    orders : List.List<Order>,
    orderId : OrderId,
    newStatus : OrderStatus,
    message : Text,
  ) : ?OrderPublic {
    var updated : ?OrderPublic = null;
    let now = Time.now();
    orders.forEach<Order>(func(o) {
      if (o.id == orderId) {
        o.status := newStatus;
        let update : ShipmentUpdate = { status = newStatus; message; timestamp = now };
        o.shipmentUpdates := o.shipmentUpdates.concat<ShipmentUpdate>([update]);
        o.updatedAt := now;
        updated := ?toPublic(o);
      };
    });
    updated;
  };

  public func getAllOrders(orders : List.List<Order>, limit : Nat, offset : Nat) : [OrderPublic] {
    let arr = orders.toArray();
    let sliced = arr.sliceToArray(offset.toInt(), (offset + limit).toInt());
    sliced.map<Order, OrderPublic>(toPublic);
  };
};
