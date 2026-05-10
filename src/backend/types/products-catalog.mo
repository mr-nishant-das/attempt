module {
  public type ProductId = Nat;
  public type CategoryId = Nat;
  public type SubCategoryId = Nat;

  public type SubCategory = {
    id : SubCategoryId;
    name : Text;
    imageUrl : Text;
  };

  public type Category = {
    id : CategoryId;
    name : Text;
    slug : Text;
    description : Text;
    imageUrl : Text;
    subCategories : [SubCategory];
  };

  public type Product = {
    id : ProductId;
    title : Text;
    description : Text;
    price : Nat; // price in paise (smallest unit)
    discountPercent : Nat; // 0-100
    imageUrls : [Text];
    category : CategoryId;
    subCategory : Text;
    rating : Nat; // 0-50 (represents 0.0–5.0 with 1 decimal, e.g. 45 = 4.5)
    reviewCount : Nat;
    stock : Nat;
    brand : Text;
    tags : [Text];
    isActive : Bool;
    createdAt : Int;
    updatedAt : Int;
  };

  public type ProductInput = {
    title : Text;
    description : Text;
    price : Nat;
    discountPercent : Nat;
    imageUrls : [Text];
    category : CategoryId;
    subCategory : Text;
    rating : Nat;
    reviewCount : Nat;
    stock : Nat;
    brand : Text;
    tags : [Text];
  };

  public type ProductFilter = {
    categoryId : ?CategoryId;
    searchTerm : ?Text;
    minPrice : ?Nat;
    maxPrice : ?Nat;
    inStockOnly : Bool;
    limit : Nat;
    offset : Nat;
  };

  public type ProductListResult = {
    products : [Product];
    total : Nat;
  };

  public type ProductError = {
    #NotFound;
    #AlreadyExists;
    #InvalidInput : Text;
    #OutOfStock;
    #Unauthorized;
  };
};
