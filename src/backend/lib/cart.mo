import Types "../types/cart";
import List "mo:core/List";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  public type Cart = Types.Cart;
  public type CartPublic = Types.CartPublic;
  public type CartItem = Types.CartItem;

  public func toPublic(c : Cart) : CartPublic {
    { userId = c.userId; items = c.items; updatedAt = c.updatedAt };
  };

  public func getCart(carts : List.List<Cart>, userId : Principal) : Cart {
    switch (carts.find<Cart>(func(c) = Principal.equal(c.userId, userId))) {
      case (?c) c;
      case null {
        let now = Time.now();
        let newCart : Cart = {
          userId;
          var items = [];
          var updatedAt = now;
        };
        carts.add(newCart);
        newCart;
      };
    };
  };

  public func addToCart(carts : List.List<Cart>, userId : Principal, productId : Nat, quantity : Nat) : CartPublic {
    let cart = getCart(carts, userId);
    let now = Time.now();
    let existing = cart.items.find(func(item) = item.productId == productId);
    let newItems : [CartItem] = switch (existing) {
      case (?_) {
        cart.items.map<CartItem, CartItem>(func(item) {
          if (item.productId == productId) {
            { item with quantity = item.quantity + quantity };
          } else { item };
        });
      };
      case null {
        cart.items.concat<CartItem>([{ productId; quantity; addedAt = now }]);
      };
    };
    cart.items := newItems;
    cart.updatedAt := now;
    toPublic(cart);
  };

  public func updateCartItem(carts : List.List<Cart>, userId : Principal, productId : Nat, quantity : Nat) : CartPublic {
    let cart = getCart(carts, userId);
    let now = Time.now();
    let newItems : [CartItem] = if (quantity == 0) {
      cart.items.filter<CartItem>(func(item) = item.productId != productId);
    } else {
      cart.items.map<CartItem, CartItem>(func(item) {
        if (item.productId == productId) { { item with quantity } } else { item };
      });
    };
    cart.items := newItems;
    cart.updatedAt := now;
    toPublic(cart);
  };

  public func removeFromCart(carts : List.List<Cart>, userId : Principal, productId : Nat) : CartPublic {
    let cart = getCart(carts, userId);
    let now = Time.now();
    cart.items := cart.items.filter<CartItem>(func(item) = item.productId != productId);
    cart.updatedAt := now;
    toPublic(cart);
  };

  public func clearCart(carts : List.List<Cart>, userId : Principal) {
    switch (carts.find<Cart>(func(c) = Principal.equal(c.userId, userId))) {
      case (?c) {
        c.items := [];
        c.updatedAt := Time.now();
      };
      case null {};
    };
  };
};
