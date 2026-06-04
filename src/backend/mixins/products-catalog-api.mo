import Types "../types/products-catalog";
import ProductLib "../lib/products-catalog";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";

mixin (
  products : List.List<ProductLib.Product>,
  categories : List.List<ProductLib.Category>,
  adminSessionState : { var token : ?Text; var expiry : Int },
) {

  func _adminAuthPC(token : Text) : Bool {
    switch (adminSessionState.token) {
      case (?t) Text.equal(t, token) and Time.now() < adminSessionState.expiry;
      case null false;
    };
  };

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

  public query func listBestSellers(limit : Nat) : async [ProductLib.Product] {
    let n = if (limit == 0) 6 else limit;
    ProductLib.listBestSellers(products, n);
  };

  public query func listNewArrivals(limit : Nat) : async [ProductLib.Product] {
    let n = if (limit == 0) 6 else limit;
    ProductLib.listNewArrivals(products, n);
  };

  // ---- Admin Product API ----

  public shared func adminAddProduct(adminToken : Text, input : ProductLib.ProductInput) : async ProductLib.Product {
    if (not _adminAuthPC(adminToken)) Runtime.trap("Unauthorized");
    let product = ProductLib.addProduct(products, nextProductId, input);
    nextProductId += 1;
    product;
  };

  public shared func adminUpdateProduct(adminToken : Text, id : ProductLib.ProductId, input : ProductLib.ProductInput) : async ?ProductLib.Product {
    if (not _adminAuthPC(adminToken)) Runtime.trap("Unauthorized");
    ProductLib.updateProduct(products, id, input);
  };

  public shared func adminSetDiscount(adminToken : Text, id : ProductLib.ProductId, discountPercent : Nat) : async ?ProductLib.Product {
    if (not _adminAuthPC(adminToken)) Runtime.trap("Unauthorized");
    if (discountPercent > 100) Runtime.trap("Discount must be 0-100");
    ProductLib.setDiscount(products, id, discountPercent);
  };

  public shared func adminDeleteProduct(adminToken : Text, id : ProductLib.ProductId) : async Bool {
    if (not _adminAuthPC(adminToken)) Runtime.trap("Unauthorized");
    ProductLib.softDeleteProduct(products, id);
  };

  public shared func adminUpdateStock(adminToken : Text, id : ProductLib.ProductId, newStock : Nat) : async ?ProductLib.Product {
    if (not _adminAuthPC(adminToken)) Runtime.trap("Unauthorized");
    ProductLib.updateStock(products, id, newStock);
  };

  // ---- Admin Category API ----

  public query func adminGetCategories(adminToken : Text) : async [ProductLib.Category] {
    if (not _adminAuthPC(adminToken)) Runtime.trap("Unauthorized");
    ProductLib.listCategories(categories);
  };

  public shared func adminAddCategory(
    adminToken : Text,
    name : Text,
    slug : Text,
    description : Text,
    imageUrl : Text,
  ) : async { #ok : ProductLib.Category; #err : Text } {
    if (not _adminAuthPC(adminToken)) return #err("Not authorized");
    let cat = ProductLib.addCategory(categories, nextCategoryId, name, slug, description, imageUrl);
    nextCategoryId += 1;
    #ok(cat);
  };

  public shared func adminUpdateCategory(
    adminToken : Text,
    id : ProductLib.CategoryId,
    name : Text,
    slug : Text,
    description : Text,
    imageUrl : Text,
  ) : async { #ok : ProductLib.Category; #err : Text } {
    if (not _adminAuthPC(adminToken)) return #err("Not authorized");
    switch (ProductLib.updateCategory(categories, id, name, slug, description, imageUrl)) {
      case (?cat) { #ok(cat) };
      case null { #err("Category not found") };
    };
  };

  public shared func adminDeleteCategory(
    adminToken : Text,
    id : ProductLib.CategoryId,
  ) : async { #ok : Bool; #err : Text } {
    if (not _adminAuthPC(adminToken)) return #err("Not authorized");
    let deleted = ProductLib.deleteCategory(categories, id);
    if (deleted) { #ok(true) } else { #err("Category not found") };
  };

  // ---- Admin SubCategory API ----

  public shared func adminAddSubCategory(
    adminToken : Text,
    categoryId : ProductLib.CategoryId,
    name : Text,
    imageUrl : Text,
  ) : async { #ok : ProductLib.Category; #err : Text } {
    if (not _adminAuthPC(adminToken)) return #err("Not authorized");
    switch (ProductLib.addSubCategory(categories, categoryId, nextSubCategoryId, name, imageUrl)) {
      case (?cat) { nextSubCategoryId += 1; #ok(cat) };
      case null { #err("Category not found") };
    };
  };

  public shared func adminUpdateSubCategory(
    adminToken : Text,
    categoryId : ProductLib.CategoryId,
    subCategoryId : ProductLib.SubCategoryId,
    name : Text,
    imageUrl : Text,
  ) : async { #ok : ProductLib.Category; #err : Text } {
    if (not _adminAuthPC(adminToken)) return #err("Not authorized");
    switch (ProductLib.updateSubCategory(categories, categoryId, subCategoryId, name, imageUrl)) {
      case (?cat) { #ok(cat) };
      case null { #err("Category or subcategory not found") };
    };
  };

  public shared func adminDeleteSubCategory(
    adminToken : Text,
    categoryId : ProductLib.CategoryId,
    subCategoryId : ProductLib.SubCategoryId,
  ) : async { #ok : ProductLib.Category; #err : Text } {
    if (not _adminAuthPC(adminToken)) return #err("Not authorized");
    switch (ProductLib.deleteSubCategory(categories, categoryId, subCategoryId)) {
      case (?cat) { #ok(cat) };
      case null { #err("Category or subcategory not found") };
    };
  };

};
