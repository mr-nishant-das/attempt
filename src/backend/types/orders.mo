module {
  public type OrderId = Nat;

  public type DeliveryType = {
    #Express;
    #Standard;
  };

  public type OrderStatus = {
    #Processing;
    #Confirmed;
    #Shipped;
    #OutForDelivery;
    #Delivered;
    #Cancelled;
  };

  public type OrderItem = {
    productId : Nat;
    title : Text;
    price : Nat;
    discountPercent : Nat;
    quantity : Nat;
    imageUrl : Text;
  };

  public type DeliveryAddress = {
    name : Text;
    phone : Text;
    houseNo : Text;
    street : Text;
    locality : Text;
    landmark : Text;
    city : Text;
    district : Text;
    state : Text;
    pincode : Text;
  };

  public type ShipmentUpdate = {
    status : OrderStatus;
    message : Text;
    timestamp : Int;
  };

  public type Order = {
    id : OrderId;
    userId : Principal;
    items : [OrderItem];
    deliveryAddress : DeliveryAddress;
    paymentMethod : Text;
    deliveryType : DeliveryType;
    deliveryCost : Nat;
    var status : OrderStatus;
    var shipmentUpdates : [ShipmentUpdate];
    totalAmount : Nat;
    var estimatedDelivery : ?Int;
    createdAt : Int;
    var updatedAt : Int;
  };

  public type OrderPublic = {
    id : OrderId;
    userId : Principal;
    items : [OrderItem];
    deliveryAddress : DeliveryAddress;
    paymentMethod : Text;
    deliveryType : DeliveryType;
    deliveryCost : Nat;
    status : OrderStatus;
    shipmentUpdates : [ShipmentUpdate];
    totalAmount : Nat;
    estimatedDelivery : ?Int;
    createdAt : Int;
    updatedAt : Int;
  };

  public type CreateOrderInput = {
    items : [{ productId : Nat; quantity : Nat }];
    deliveryAddress : DeliveryAddress;
    paymentMethod : Text;
    deliveryType : DeliveryType;
    deliveryCost : Nat;
  };
};
