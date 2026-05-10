import Types "../types/products-catalog";
import ProductLib "../lib/products-catalog";
import UserLib "../lib/users";
import List "mo:core/List";
import Runtime "mo:core/Runtime";

mixin (
  products : List.List<ProductLib.Product>,
  categories : List.List<ProductLib.Category>,
  users : List.List<UserLib.UserProfile>,
) {

  stable var nextProductId : Nat = 1;
  stable var nextCategoryId : Nat = 1;
  stable var nextSubCategoryId : Nat = 1;

  // ---- Category API ----

  public query func listCategories() : async [ProductLib.Category] {
    ProductLib.listCategories(categories);
  };

  public query func getCategory(id : ProductLib.CategoryId) : async ?ProductLib.Category {
    ProductLib.getCategory(categories, id);
  };

  public query func getCategoryBySlug(slug : Text) : async ?ProductLib.Category {
    ProductLib.getCategoryBySlug(categories, slug);
  };

  // ---- Product API (public/read) ----

  public query func getProduct(id : ProductLib.ProductId) : async ?ProductLib.Product {
    ProductLib.getProduct(products, id);
  };

  public query func listProducts(filter : ProductLib.ProductFilter) : async ProductLib.ProductListResult {
    ProductLib.listProducts(products, filter);
  };

  public query func listProductsByCategory(categoryId : ProductLib.CategoryId, limit : Nat, offset : Nat) : async ProductLib.ProductListResult {
    let filter : ProductLib.ProductFilter = {
      categoryId = ?categoryId;
      searchTerm = null;
      minPrice = null;
      maxPrice = null;
      inStockOnly = false;
      limit;
      offset;
    };
    ProductLib.listProducts(products, filter);
  };

  public query func searchProducts(term : Text, limit : Nat, offset : Nat) : async ProductLib.ProductListResult {
    let filter : ProductLib.ProductFilter = {
      categoryId = null;
      searchTerm = ?term;
      minPrice = null;
      maxPrice = null;
      inStockOnly = false;
      limit;
      offset;
    };
    ProductLib.listProducts(products, filter);
  };

  // ---- Admin Product API ----

  public shared ({ caller }) func adminAddProduct(input : ProductLib.ProductInput) : async ProductLib.Product {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    let product = ProductLib.addProduct(products, nextProductId, input);
    nextProductId += 1;
    product;
  };

  public shared ({ caller }) func adminUpdateProduct(id : ProductLib.ProductId, input : ProductLib.ProductInput) : async ?ProductLib.Product {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    ProductLib.updateProduct(products, id, input);
  };

  public shared ({ caller }) func adminSetDiscount(id : ProductLib.ProductId, discountPercent : Nat) : async ?ProductLib.Product {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    if (discountPercent > 100) Runtime.trap("Discount must be 0-100");
    ProductLib.setDiscount(products, id, discountPercent);
  };

  public shared ({ caller }) func adminDeleteProduct(id : ProductLib.ProductId) : async Bool {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    ProductLib.softDeleteProduct(products, id);
  };

  public shared ({ caller }) func adminUpdateStock(id : ProductLib.ProductId, newStock : Nat) : async ?ProductLib.Product {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    ProductLib.updateStock(products, id, newStock);
  };

  // ---- Admin Category API ----

  public shared query ({ caller }) func adminGetCategories() : async [ProductLib.Category] {
    if (not UserLib.isAdmin(users, caller)) Runtime.trap("Unauthorized");
    ProductLib.listCategories(categories);
  };

  public shared ({ caller }) func adminAddCategory(
    name : Text,
    slug : Text,
    description : Text,
    imageUrl : Text,
  ) : async { #ok : ProductLib.Category; #err : Text } {
    if (not UserLib.isAdmin(users, caller)) return #err("Not authorized");
    let cat = ProductLib.addCategory(categories, nextCategoryId, name, slug, description, imageUrl);
    nextCategoryId += 1;
    #ok(cat);
  };

  public shared ({ caller }) func adminUpdateCategory(
    id : ProductLib.CategoryId,
    name : Text,
    slug : Text,
    description : Text,
    imageUrl : Text,
  ) : async { #ok : ProductLib.Category; #err : Text } {
    if (not UserLib.isAdmin(users, caller)) return #err("Not authorized");
    switch (ProductLib.updateCategory(categories, id, name, slug, description, imageUrl)) {
      case (?cat) { #ok(cat) };
      case null { #err("Category not found") };
    };
  };

  public shared ({ caller }) func adminDeleteCategory(
    id : ProductLib.CategoryId,
  ) : async { #ok : Bool; #err : Text } {
    if (not UserLib.isAdmin(users, caller)) return #err("Not authorized");
    let deleted = ProductLib.deleteCategory(categories, id);
    if (deleted) { #ok(true) } else { #err("Category not found") };
  };

  // ---- Admin SubCategory API ----

  public shared ({ caller }) func adminAddSubCategory(
    categoryId : ProductLib.CategoryId,
    name : Text,
    imageUrl : Text,
  ) : async { #ok : ProductLib.Category; #err : Text } {
    if (not UserLib.isAdmin(users, caller)) return #err("Not authorized");
    switch (ProductLib.addSubCategory(categories, categoryId, nextSubCategoryId, name, imageUrl)) {
      case (?cat) { nextSubCategoryId += 1; #ok(cat) };
      case null { #err("Category not found") };
    };
  };

  public shared ({ caller }) func adminUpdateSubCategory(
    categoryId : ProductLib.CategoryId,
    subCategoryId : ProductLib.SubCategoryId,
    name : Text,
    imageUrl : Text,
  ) : async { #ok : ProductLib.Category; #err : Text } {
    if (not UserLib.isAdmin(users, caller)) return #err("Not authorized");
    switch (ProductLib.updateSubCategory(categories, categoryId, subCategoryId, name, imageUrl)) {
      case (?cat) { #ok(cat) };
      case null { #err("Category or subcategory not found") };
    };
  };

  public shared ({ caller }) func adminDeleteSubCategory(
    categoryId : ProductLib.CategoryId,
    subCategoryId : ProductLib.SubCategoryId,
  ) : async { #ok : ProductLib.Category; #err : Text } {
    if (not UserLib.isAdmin(users, caller)) return #err("Not authorized");
    switch (ProductLib.deleteSubCategory(categories, categoryId, subCategoryId)) {
      case (?cat) { #ok(cat) };
      case null { #err("Category or subcategory not found") };
    };
  };

};
