import List "mo:core/List";
import ProductLib "lib/products-catalog";
import UserLib "lib/users";
import CartLib "lib/cart";
import OrderLib "lib/orders";
import ServicesLib "lib/services";
import ProductsMixin "mixins/products-catalog-api";
import UsersMixin "mixins/users-api";
import CartMixin "mixins/cart-api";
import OrdersMixin "mixins/orders-api";
import ServicesMixin "mixins/services-api";
import Migration "migration";

(with migration = Migration.run)
actor {
  // --- Shared state ---
  let categories = List.empty<ProductLib.Category>();
  let products = List.empty<ProductLib.Product>();
  let users = List.empty<UserLib.UserProfile>();
  let carts = List.empty<CartLib.Cart>();
  let orders = List.empty<OrderLib.Order>();
  let serviceRequests = List.empty<ServicesLib.ServiceRequest>();

  // --- Seed data on first run ---
  do {
    if (categories.isEmpty()) {
      ignore ProductLib.seedCategories(categories, 1);
      ignore ProductLib.seedProducts(products, categories, 1);
    };
  };

  // --- Include mixins ---
  include ProductsMixin(products, categories, users);
  include UsersMixin(users);
  include CartMixin(carts);
  include OrdersMixin(orders, products, users, carts);
  include ServicesMixin(serviceRequests, users);
};
