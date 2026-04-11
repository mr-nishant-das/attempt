import CartLib "../lib/cart";
import List "mo:core/List";
import Runtime "mo:core/Runtime";

mixin (
  carts : List.List<CartLib.Cart>,
) {

  public shared ({ caller }) func getMyCart() : async CartLib.CartPublic {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    let cart = CartLib.getCart(carts, caller);
    CartLib.toPublic(cart);
  };

  public shared ({ caller }) func addToCart(productId : Nat, quantity : Nat) : async CartLib.CartPublic {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    if (quantity == 0) Runtime.trap("Quantity must be at least 1");
    CartLib.addToCart(carts, caller, productId, quantity);
  };

  public shared ({ caller }) func updateCartItem(productId : Nat, quantity : Nat) : async CartLib.CartPublic {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    CartLib.updateCartItem(carts, caller, productId, quantity);
  };

  public shared ({ caller }) func removeFromCart(productId : Nat) : async CartLib.CartPublic {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    CartLib.removeFromCart(carts, caller, productId);
  };

  public shared ({ caller }) func clearMyCart() : async () {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    CartLib.clearCart(carts, caller);
  };

};
