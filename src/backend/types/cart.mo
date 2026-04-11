module {
  public type CartItemId = Nat;

  public type CartItem = {
    productId : Nat;
    quantity : Nat;
    addedAt : Int;
  };

  public type Cart = {
    userId : Principal;
    var items : [CartItem];
    var updatedAt : Int;
  };

  public type CartPublic = {
    userId : Principal;
    items : [CartItem];
    updatedAt : Int;
  };
};
