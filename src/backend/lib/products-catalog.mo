import Types "../types/products-catalog";
import List "mo:core/List";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";

module {
  public type Product = Types.Product;
  public type Category = Types.Category;
  public type SubCategory = Types.SubCategory;
  public type ProductId = Types.ProductId;
  public type CategoryId = Types.CategoryId;
  public type SubCategoryId = Types.SubCategoryId;
  public type ProductInput = Types.ProductInput;
  public type ProductFilter = Types.ProductFilter;
  public type ProductListResult = Types.ProductListResult;
  public type ProductError = Types.ProductError;

  // --- Category Operations ---

  public func listCategories(categories : List.List<Category>) : [Category] {
    categories.toArray();
  };

  public func getCategory(categories : List.List<Category>, id : CategoryId) : ?Category {
    categories.find<Category>(func(c) = c.id == id);
  };

  public func getCategoryBySlug(categories : List.List<Category>, slug : Text) : ?Category {
    categories.find<Category>(func(c) = c.slug == slug);
  };

  public func addCategory(
    categories : List.List<Category>,
    nextId : Nat,
    name : Text,
    slug : Text,
    description : Text,
    imageUrl : Text,
  ) : Category {
    let cat : Category = { id = nextId; name; slug; description; imageUrl; subCategories = [] };
    categories.add(cat);
    cat;
  };

  public func updateCategory(
    categories : List.List<Category>,
    id : CategoryId,
    name : Text,
    slug : Text,
    description : Text,
    imageUrl : Text,
  ) : ?Category {
    var updated : ?Category = null;
    categories.mapInPlace<Category>(func(c : Category) : Category {
      if (c.id == id) {
        let u : Category = { c with name; slug; description; imageUrl };
        updated := ?u;
        u;
      } else { c };
    });
    updated;
  };

  public func deleteCategory(
    categories : List.List<Category>,
    id : CategoryId,
  ) : Bool {
    let before = categories.size();
    categories.retain(func(c : Category) : Bool { c.id != id });
    categories.size() < before;
  };

  public func addSubCategory(
    categories : List.List<Category>,
    categoryId : CategoryId,
    nextSubId : Nat,
    name : Text,
    imageUrl : Text,
  ) : ?Category {
    var result : ?Category = null;
    categories.mapInPlace<Category>(func(c : Category) : Category {
      if (c.id == categoryId) {
        let newSub : SubCategory = { id = nextSubId; name; imageUrl };
        let updated : Category = { c with subCategories = c.subCategories.concat([newSub]) };
        result := ?updated;
        updated;
      } else { c };
    });
    result;
  };

  public func updateSubCategory(
    categories : List.List<Category>,
    categoryId : CategoryId,
    subCategoryId : SubCategoryId,
    name : Text,
    imageUrl : Text,
  ) : ?Category {
    var result : ?Category = null;
    categories.mapInPlace<Category>(func(c : Category) : Category {
      if (c.id == categoryId) {
        let newSubs = c.subCategories.map(
          func(sc : SubCategory) : SubCategory {
            if (sc.id == subCategoryId) { { sc with name; imageUrl } } else { sc };
          },
        );
        let updated : Category = { c with subCategories = newSubs };
        result := ?updated;
        updated;
      } else { c };
    });
    result;
  };

  public func deleteSubCategory(
    categories : List.List<Category>,
    categoryId : CategoryId,
    subCategoryId : SubCategoryId,
  ) : ?Category {
    var result : ?Category = null;
    categories.mapInPlace<Category>(func(c : Category) : Category {
      if (c.id == categoryId) {
        let newSubs = c.subCategories.filter(
          func(sc : SubCategory) : Bool { sc.id != subCategoryId },
        );
        let updated : Category = { c with subCategories = newSubs };
        result := ?updated;
        updated;
      } else { c };
    });
    result;
  };

  // --- Product Operations ---

  public func getProduct(products : List.List<Product>, id : ProductId) : ?Product {
    products.find<Product>(func(p) = p.id == id and p.isActive);
  };
  public func listBestSellers(products : List.List<Product>, limit : Nat) : [Product] {
    let active = products.filter(func(p : Product) : Bool { p.isActive });
    let arr = active.toArray();
    // Sort descending by rating (Nat 0-50)
    let sorted = arr.sort(func(a, b) {
      if (a.rating > b.rating) { #less }
      else if (a.rating < b.rating) { #greater }
      else { #equal }
    });
    sorted.sliceToArray(0, limit.toInt());
  };

  public func listNewArrivals(products : List.List<Product>, limit : Nat) : [Product] {
    let active = products.filter(func(p : Product) : Bool { p.isActive });
    let arr = active.toArray();
    // Sort descending by createdAt (Int, nanoseconds)
    let sorted = arr.sort(func(a, b) {
      if (a.createdAt > b.createdAt) { #less }
      else if (a.createdAt < b.createdAt) { #greater }
      else { #equal }
    });
    sorted.sliceToArray(0, limit.toInt());
  };


  public func listProducts(products : List.List<Product>, filter : ProductFilter) : ProductListResult {
    let filtered = products.filter(func(p : Product) : Bool {
      if (not p.isActive) return false;
      switch (filter.categoryId) {
        case (?catId) { if (p.category != catId) return false };
        case null {};
      };
      switch (filter.searchTerm) {
        case (?term) {
          let lowerTerm = term.toLower();
          let titleMatch = p.title.toLower().contains(#text lowerTerm);
          let descMatch = p.description.toLower().contains(#text lowerTerm);
          let brandMatch = p.brand.toLower().contains(#text lowerTerm);
          let subCatMatch = p.subCategory.toLower().contains(#text lowerTerm);
          let tagsMatch = p.tags.find(func(tag : Text) : Bool {
            tag.toLower().contains(#text lowerTerm)
          }) != null;
          if (not titleMatch and not descMatch and not brandMatch and not subCatMatch and not tagsMatch) return false;
        };
        case null {};
      };
      switch (filter.minPrice) {
        case (?minP) { if (p.price < minP) return false };
        case null {};
      };
      switch (filter.maxPrice) {
        case (?maxP) { if (p.price > maxP) return false };
        case null {};
      };
      if (filter.inStockOnly and p.stock == 0) return false;
      true;
    });
    let total = filtered.size();
    let sliced = filtered.sliceToArray(filter.offset.toInt(), (filter.offset + filter.limit).toInt());
    { products = sliced; total };
  };

  public func addProduct(
    products : List.List<Product>,
    nextId : Nat,
    input : ProductInput,
  ) : Product {
    let now = Time.now();
    let product : Product = {
      id = nextId;
      title = input.title;
      description = input.description;
      price = input.price;
      discountPercent = input.discountPercent;
      imageUrls = input.imageUrls;
      category = input.category;
      subCategory = input.subCategory;
      rating = input.rating;
      reviewCount = input.reviewCount;
      stock = input.stock;
      brand = input.brand;
      tags = input.tags;
      isActive = true;
      createdAt = now;
      updatedAt = now;
    };
    products.add(product);
    product;
  };

  public func updateProduct(
    products : List.List<Product>,
    id : ProductId,
    input : ProductInput,
  ) : ?Product {
    var updated : ?Product = null;
    let now = Time.now();
    products.mapInPlace<Product>(func(p : Product) : Product {
      if (p.id == id and p.isActive) {
        let u : Product = {
          p with
          title = input.title;
          description = input.description;
          price = input.price;
          discountPercent = input.discountPercent;
          imageUrls = input.imageUrls;
          category = input.category;
          subCategory = input.subCategory;
          rating = input.rating;
          reviewCount = input.reviewCount;
          stock = input.stock;
          brand = input.brand;
          tags = input.tags;
          updatedAt = now;
        };
        updated := ?u;
        u;
      } else { p };
    });
    updated;
  };

  public func setDiscount(
    products : List.List<Product>,
    id : ProductId,
    discountPercent : Nat,
  ) : ?Product {
    var updated : ?Product = null;
    let now = Time.now();
    products.mapInPlace<Product>(func(p : Product) : Product {
      if (p.id == id and p.isActive) {
        let u : Product = { p with discountPercent; updatedAt = now };
        updated := ?u;
        u;
      } else { p };
    });
    updated;
  };

  public func softDeleteProduct(products : List.List<Product>, id : ProductId) : Bool {
    var found = false;
    let now = Time.now();
    products.mapInPlace<Product>(func(p : Product) : Product {
      if (p.id == id and p.isActive) {
        found := true;
        { p with isActive = false; updatedAt = now };
      } else { p };
    });
    found;
  };

  public func updateStock(
    products : List.List<Product>,
    id : ProductId,
    newStock : Nat,
  ) : ?Product {
    var updated : ?Product = null;
    let now = Time.now();
    products.mapInPlace<Product>(func(p : Product) : Product {
      if (p.id == id and p.isActive) {
        let u : Product = { p with stock = newStock; updatedAt = now };
        updated := ?u;
        u;
      } else { p };
    });
    updated;
  };

  // --- Seeding ---

  public func seedCategories(categories : List.List<Category>, nextId : Nat) : Nat {
    let makeSubCats = func(names : [Text]) : [SubCategory] {
      var subId : Nat = 1;
      let result = Array.tabulate(
        names.size(),
        func(i) {
          let sc : SubCategory = { id = subId + i; name = names[i]; imageUrl = "" };
          sc;
        },
      );
      result;
    };
    let seedData : [(Text, Text, Text, Text, [Text])] = [
      (
        "Assam Tea",
        "assam-tea",
        "Premium teas from the lush Assam valley — CTC, Orthodox, Green, White and more",
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
        ["CTC Tea", "Orthodox Tea", "Green Tea", "White Tea", "Flavoured Tea", "Premium Single Estate"],
      ),
      (
        "Assamese Food",
        "assamese-food",
        "Traditional Assamese food products, delicacies and pantry staples",
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80",
        ["Rice & Dal", "Pickles & Chutneys", "Snacks & Namkeen", "Sweets & Mithai", "Ready-to-Cook", "Oils & Ghee"],
      ),
      (
        "Spices & Herbs",
        "spices-herbs",
        "Aromatic Assamese spices, herbs and condiments",
        "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80",
        ["Whole Spices", "Ground Spices", "Spice Blends", "Dried Herbs", "Medicinal Spices"],
      ),
      (
        "Medicine & Herbs",
        "medicine-herbs",
        "Ayurvedic herbs, traditional remedies and herbal wellness products",
        "https://images.unsplash.com/photo-1611241443322-78b6f6a12b9b?w=400&q=80",
        ["Ayurvedic Herbs", "Traditional Remedies", "Herbal Teas", "Immunity Boosters", "Digestive Aids"],
      ),
      (
        "Assamese Attire",
        "assamese-attire",
        "Traditional and contemporary Assamese clothing for all occasions",
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80",
        ["Mekhela Chador", "Gamosa", "Men's Dhoti & Kurta", "Children's Attire", "Festival Wear"],
      ),
      (
        "Handloom & Textiles",
        "handloom-textiles",
        "Authentic Assamese handloom weaves and textiles — Muga, Pat, Eri, Cotton",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
        ["Muga Silk", "Pat Silk", "Eri Silk", "Cotton Handloom", "Woolen Items"],
      ),
      (
        "Handicrafts",
        "handicrafts",
        "Traditional Assamese handicrafts and artisan works",
        "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&q=80",
        ["Bamboo Craft", "Cane Craft", "Bell Metal", "Clay Pottery", "Mask Making"],
      ),
      (
        "Art & Paintings",
        "art-paintings",
        "Assamese paintings, folk art, sculptures and prints",
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80",
        ["Assamese Oil Paintings", "Watercolors", "Folk Art", "Sculptures", "Prints"],
      ),
      (
        "Books & Literature",
        "books-literature",
        "Assamese novels, poetry, history, culture and academic books",
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
        ["Assamese Novels", "Poetry", "History & Culture", "Children's Books", "Academic"],
      ),
      (
        "Chronicles & Magazines",
        "chronicles-magazines",
        "Assamese magazines, research journals and cultural publications",
        "https://images.unsplash.com/photo-1585241936939-be4099591252?w=400&q=80",
        ["Monthly Magazines", "Annual Editions", "Research Journals", "Cultural Publications"],
      ),
      (
        "Musical Instruments",
        "musical-instruments",
        "Traditional Assamese musical instruments — Dhol, Pepa, Gogona and more",
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80",
        ["Dhol", "Pepa", "Gogona", "Dotara", "Toka", "Xutuli"],
      ),
      (
        "Religious & Puja Items",
        "religious-puja",
        "Idols, puja thalis, incense, diyas and holy items for worship",
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80",
        ["Idols & Figurines", "Puja Thalis", "Incense & Diyas", "Holy Books", "Prayer Beads"],
      ),
      (
        "Decorative Items",
        "decorative-items",
        "Wall decor, table decor, handmade vases and Assamese motif decorations",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
        ["Wall Decor", "Table Decor", "Handmade Vases", "Assamese Motif Items"],
      ),
      (
        "Kitchen & Cookware",
        "kitchen-cookware",
        "Traditional Assamese kitchen items — bell metal, clay, bamboo cookware",
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
        ["Baan (Bell Metal)", "Clay Cookware", "Bamboo Kitchenware", "Assamese Serving Sets"],
      ),
      (
        "Living Room Decor",
        "living-room-decor",
        "Assamese rugs, cushion covers, wall hangings and decorative lamps",
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
        ["Assamese Rugs", "Cushion Covers", "Wall Hangings", "Decorative Lamps"],
      ),
    ];
    var id = nextId;
    for ((name, slug, description, imageUrl, subCatNames) in seedData.values()) {
      categories.add({
        id;
        name;
        slug;
        description;
        imageUrl;
        subCategories = makeSubCats(subCatNames);
      });
      id += 1;
    };
    id;
  };

  public func seedProducts(
    products : List.List<Product>,
    categories : List.List<Category>,
    nextProductId : Nat,
  ) : Nat {
    let findCatId = func(slug : Text) : Nat {
      switch (categories.find<Category>(func(c) = c.slug == slug)) {
        case (?c) c.id;
        case null 1;
      };
    };

    let teaCatId = findCatId("assam-tea");
    let foodCatId = findCatId("assamese-food");
    let spicesCatId = findCatId("spices-herbs");
    let medicineCatId = findCatId("medicine-herbs");
    let attireCatId = findCatId("assamese-attire");
    let handloomCatId = findCatId("handloom-textiles");
    let handicraftCatId = findCatId("handicrafts");
    let artCatId = findCatId("art-paintings");
    let booksCatId = findCatId("books-literature");
    let chroniclesCatId = findCatId("chronicles-magazines");
    let musicCatId = findCatId("musical-instruments");
    let pujaCatId = findCatId("religious-puja");
    let decorCatId = findCatId("decorative-items");
    let kitchenCatId = findCatId("kitchen-cookware");
    let livingCatId = findCatId("living-room-decor");

    let now = Time.now();

    // (catId, title, description, price, discount, imageUrl, rating, subCategory, reviewCount, stock, brand, tags)
    let seedProductData : [(Nat, Text, Text, Nat, Nat, Text, Nat, Text, Nat, Nat, Text, [Text])] = [

      // ===== ASSAM TEA =====
      // CTC Tea (6)
      (teaCatId, "Assam Gold CTC Tea 500g", "Bold, malty CTC tea from Upper Assam estates. Perfect for a strong morning brew.", 29900, 10, "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80", 45, "CTC Tea", 1240, 150, "Assam Gold", ["tea", "ctc", "assam tea", "black tea", "morning tea", "assam", "chai"]),
      (teaCatId, "Dibrugarh Estate CTC Premium 1kg", "Economy pack of premium CTC tea from Dibrugarh estates. Great value for daily use.", 54900, 20, "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80", 42, "CTC Tea", 2100, 250, "Dibrugarh Tea Co.", ["tea", "ctc", "assam tea", "bulk", "economy", "assam", "black tea"]),
      (teaCatId, "Brahmaputra Breakfast CTC 250g", "Robust breakfast tea blend, brews a strong cup with milk. Classic Assam style.", 16900, 5, "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80", 43, "CTC Tea", 980, 300, "Brahmaputra Tea", ["tea", "ctc", "breakfast tea", "assam", "morning", "chai", "milk tea"]),
      (teaCatId, "Jorhat Garden CTC Tea 250g", "Bright, coppery liquor from Jorhat gardens. Ideal for masala chai.", 19900, 0, "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80", 44, "CTC Tea", 760, 180, "Jorhat Gardens", ["tea", "ctc", "jorhat", "assam tea", "masala chai", "assam"]),
      (teaCatId, "Tezpur CTC Gold Dust 500g", "Fine gold dust CTC grade, brews an amber cup with brisk flavour.", 27900, 8, "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80", 43, "CTC Tea", 860, 200, "Tezpur Tea Estate", ["tea", "ctc", "tezpur", "assam", "gold dust", "black tea"]),
      (teaCatId, "Silchar Bagan CTC Fannings 500g", "Fine fannings grade CTC from Silchar tea gardens, strong and aromatic.", 21900, 0, "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80", 41, "CTC Tea", 540, 220, "Silchar Bagan", ["tea", "ctc", "silchar", "assam", "fannings", "black tea", "assam tea"]),

      // Orthodox Tea (5)
      (teaCatId, "Halmari Orthodox Whole Leaf Tea 250g", "Award-winning single estate orthodox tea, delicate floral notes.", 74900, 0, "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80", 49, "Orthodox Tea", 890, 80, "Halmari Estate", ["tea", "orthodox", "premium", "single estate", "whole leaf", "assam tea", "assam"]),
      (teaCatId, "Manohari Gold TGFOP Orthodox 100g", "Tippy Golden Flowery Orange Pekoe, first flush orthodox. Collector's grade.", 99900, 0, "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80", 48, "Orthodox Tea", 420, 50, "Manohari Estate", ["tea", "orthodox", "tgfop", "first flush", "premium", "assam", "assam tea"]),
      (teaCatId, "Margherita Second Flush Orthodox 100g", "Rich, full-bodied second flush orthodox from Margherita estates.", 84900, 5, "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80", 47, "Orthodox Tea", 310, 60, "Margherita Tea Co.", ["tea", "orthodox", "second flush", "full bodied", "assam tea", "assam"]),
      (teaCatId, "Assam FTGFOP1 Special Grade 50g", "Finest Tippy Golden Flowery Orange Pekoe, museum-quality Assam orthodox.", 149900, 0, "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80", 50, "Orthodox Tea", 180, 30, "Upper Assam Estates", ["tea", "orthodox", "ftgfop1", "rare", "premium", "assam", "assam tea", "luxury"]),
      (teaCatId, "Biswanath Chariali Orthodox Loose Leaf 200g", "Balanced, malty orthodox from Biswanath Chariali gardens.", 54900, 10, "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80", 46, "Orthodox Tea", 640, 90, "Biswanath Estate", ["tea", "orthodox", "loose leaf", "malty", "assam tea", "assam"]),

      // Green Tea (5)
      (teaCatId, "Kaziranga Green Tea 100g", "Fresh, light green tea from the foothills near Kaziranga. Rich in antioxidants.", 39900, 15, "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80", 44, "Green Tea", 560, 200, "Kaziranga Naturals", ["tea", "green tea", "assam", "antioxidant", "healthy", "weight loss", "assam tea"]),
      (teaCatId, "Assam Gunpowder Green Tea 100g", "Rolled pellet green tea, brews a strong, grassy cup.", 34900, 0, "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80", 43, "Green Tea", 380, 150, "Green Valley Tea", ["tea", "green tea", "gunpowder", "assam", "healthy", "assam tea"]),
      (teaCatId, "Harmutty Green Tea Spring Flush 50g", "Delicate spring flush green tea from Harmutty estate, vegetal notes.", 54900, 0, "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80", 46, "Green Tea", 220, 80, "Harmutty Estate", ["tea", "green tea", "spring flush", "assam", "premium", "assam tea"]),
      (teaCatId, "Himalayan Assam Green Tea Bags 25 bags", "Convenient green tea bags, each cup fresh and aromatic.", 24900, 10, "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80", 42, "Green Tea", 890, 350, "Assam Naturals", ["tea", "green tea", "tea bags", "assam", "convenient", "healthy"]),
      (teaCatId, "Matcha-Style Assam Ground Green Tea 50g", "Stone-ground Assam green tea leaves, ceremonial quality.", 69900, 0, "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80", 45, "Green Tea", 310, 60, "Assam Green Co.", ["tea", "green tea", "matcha", "assam", "ceremonial", "healthy", "antioxidant"]),

      // White Tea (5)
      (teaCatId, "Assam White Tea First Flush 50g", "Rare white tea harvested during first flush. Delicate, sweet flavor profile.", 89900, 0, "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80", 47, "White Tea", 320, 50, "Upper Assam Estates", ["tea", "white tea", "first flush", "rare", "assam", "assam tea", "premium"]),
      (teaCatId, "Silver Needle White Tea Assam 30g", "Premium silver needle white tea, handpicked at dawn from Assam hills.", 129900, 0, "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80", 49, "White Tea", 180, 30, "Assam White Estate", ["tea", "white tea", "silver needle", "assam", "luxury", "rare", "assam tea"]),
      (teaCatId, "White Peony Assam 50g", "Delicate white peony (Bai Mudan) style, naturally sweet and floral.", 79900, 5, "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80", 46, "White Tea", 240, 60, "Assam White Estate", ["tea", "white tea", "peony", "floral", "assam", "premium", "assam tea"]),

      // Flavoured Tea (5)
      (teaCatId, "Brahmaputra Masala Chai Blend 200g", "Traditional Assamese masala chai with local spices. Aromatic and warming.", 24900, 5, "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80", 43, "Flavoured Tea", 780, 300, "Brahmaputra Blends", ["tea", "masala chai", "spiced tea", "chai", "assam", "flavoured tea", "assam tea"]),
      (teaCatId, "Lemon Ginger Assam Tea 100g", "Refreshing CTC tea infused with dried lemon and ginger.", 29900, 0, "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80", 44, "Flavoured Tea", 560, 220, "Assam Blends", ["tea", "lemon tea", "ginger tea", "flavoured", "assam", "assam tea", "refreshing"]),
      (teaCatId, "Tulsi Cardamom Assam Tea 100g", "Aromatic blend of Assam CTC with tulsi and cardamom.", 32900, 10, "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80", 45, "Flavoured Tea", 480, 180, "Brahmaputra Blends", ["tea", "tulsi", "cardamom", "flavoured tea", "assam", "assam tea", "herbal"]),
      (teaCatId, "Rose Petal Assam CTC 100g", "Delicate rose petals blended with malty Assam CTC.", 34900, 0, "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80", 44, "Flavoured Tea", 390, 140, "Floral Teas India", ["tea", "rose tea", "flavoured", "assam", "assam tea", "floral", "gift"]),
      (teaCatId, "Mint Infused Assam Tea 100g", "Cool, refreshing Assam tea with dried spearmint leaves.", 27900, 5, "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80", 43, "Flavoured Tea", 340, 160, "Assam Blends", ["tea", "mint tea", "flavoured", "assam", "refreshing", "assam tea"]),

      // Premium Single Estate (5)
      (teaCatId, "Mokalbari Premium Single Estate 100g", "Iconic Mokalbari estate first flush, prized by connoisseurs worldwide.", 149900, 0, "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80", 50, "Premium Single Estate", 290, 40, "Mokalbari Estate", ["tea", "single estate", "premium", "mokalbari", "assam", "assam tea", "luxury", "first flush"]),
      (teaCatId, "Dikom Estate Vintage Reserve 100g", "Aged vintage reserve from Dikom estate, complex and layered.", 179900, 0, "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80", 49, "Premium Single Estate", 190, 25, "Dikom Estate", ["tea", "single estate", "vintage", "assam", "assam tea", "luxury", "premium"]),
      (teaCatId, "Gingia Estate Limited Harvest 50g", "Limited annual harvest from historic Gingia estate.", 99900, 0, "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80", 48, "Premium Single Estate", 210, 35, "Gingia Estate", ["tea", "single estate", "limited", "assam", "assam tea", "premium", "rare"]),

      // ===== ASSAMESE FOOD =====
      // Rice & Dal (6)
      (foodCatId, "Joha Saul (Joha Rice) 2kg", "Aromatic indigenous Joha rice variety, naturally fragrant. GI tagged product.", 32900, 0, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80", 48, "Rice & Dal", 1560, 100, "Assam Organic Farms", ["rice", "joha", "joha rice", "assam", "aromatic rice", "GI tagged", "assamese food"]),
      (foodCatId, "Bora Saul (Glutinous Rice) 1kg", "Sticky glutinous rice used for Assamese pithas and traditional dishes.", 28900, 8, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80", 44, "Rice & Dal", 730, 130, "Assam Organic Farms", ["rice", "bora saul", "sticky rice", "glutinous", "assam", "pitha", "assamese food"]),
      (foodCatId, "Sali Rice (Traditional Assam) 5kg", "Traditional Sali variety rice from Assam, medium grain and fragrant.", 44900, 5, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80", 43, "Rice & Dal", 890, 80, "Brahmaputra Farms", ["rice", "sali rice", "assam", "assamese food", "staple"]),
      (foodCatId, "Black Masoor Dal (Assamese) 1kg", "Earthy, flavourful local masoor dal from Assam's organic farms.", 14900, 0, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80", 42, "Rice & Dal", 670, 200, "Brahmaputra Organics", ["dal", "masoor dal", "lentil", "assam", "assamese food", "protein"]),
      (foodCatId, "Muga Masur Dal (Red Lentil) 500g", "Red lentils from Assamese farms, quick-cooking and nutritious.", 11900, 0, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80", 43, "Rice & Dal", 540, 250, "Local Harvest", ["dal", "red lentil", "masur", "assam", "assamese food", "quick cook"]),
      (foodCatId, "Matimah (Assamese Black Lentil) 500g", "Nutritious black lentil popular in Assamese homes, slow-cooked richness.", 13900, 0, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80", 44, "Rice & Dal", 460, 180, "Assam Pure Foods", ["dal", "matimah", "black lentil", "assam", "assamese food", "nutritious"]),

      // Pickles & Chutneys (6)
      (foodCatId, "Assamese Khorisa (Bamboo Shoot Pickle) 300g", "Traditional fermented bamboo shoot pickle, tangy and flavorful.", 18900, 0, "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=400&q=80", 44, "Pickles & Chutneys", 890, 180, "Maa's Kitchen", ["pickle", "khorisa", "bamboo shoot", "assam", "assamese food", "fermented", "achar"]),
      (foodCatId, "Assamese Lemon Pickle (Guti Nemu Achar) 300g", "Whole baby lemon pickle in traditional Assamese spices.", 17900, 12, "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=400&q=80", 45, "Pickles & Chutneys", 880, 150, "Home Harvest", ["pickle", "lemon pickle", "guti nemu", "achar", "assam", "assamese food", "tangy"]),
      (foodCatId, "Assam Egg Pickle (Dim Achar) 250g", "Unique spiced egg pickle in mustard oil, a traditional Assamese delicacy.", 24900, 0, "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=400&q=80", 43, "Pickles & Chutneys", 420, 70, "Maa's Kitchen", ["pickle", "egg pickle", "dim achar", "assam", "assamese food", "spiced"]),
      (foodCatId, "Bhut Jolokia Pickle (Ghost Pepper) 200g", "Fiery ghost pepper pickle in mustard oil, an Assamese condiment for the brave.", 28900, 0, "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=400&q=80", 48, "Pickles & Chutneys", 730, 100, "Maa's Kitchen", ["pickle", "ghost pepper", "bhut jolokia", "spicy", "assam", "assamese food", "achar"]),
      (foodCatId, "Mango Pickle Assamese Style (Aam Achar) 400g", "Traditional Assamese raw mango pickle with mustard and fenugreek.", 16900, 5, "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=400&q=80", 46, "Pickles & Chutneys", 1100, 200, "Ghar ko Achar", ["pickle", "mango pickle", "aam achar", "assam", "assamese food", "tangy", "condiment"]),
      (foodCatId, "Garlic Chutney Assamese 200g", "Pungent garlic chutney with local spices, perfect with rice.", 14900, 0, "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=400&q=80", 44, "Pickles & Chutneys", 560, 150, "Home Harvest", ["chutney", "garlic", "assam", "assamese food", "condiment", "achar"]),

      // Snacks & Namkeen (5)
      (foodCatId, "Til Pitha Mix 500g", "Ready mix for Assam's beloved sesame rice cake made during Bihu.", 22900, 10, "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80", 46, "Snacks & Namkeen", 1200, 120, "Bihu Delights", ["pitha", "til pitha", "sesame", "bihu", "assam", "assamese food", "snacks", "traditional"]),
      (foodCatId, "Assamese Bhoja Muri (Puffed Rice) 500g", "Crispy puffed rice, used in Assamese snacks and as a light meal.", 12900, 0, "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80", 43, "Snacks & Namkeen", 780, 300, "Local Harvest", ["puffed rice", "muri", "bhoja muri", "assam", "assamese food", "snacks", "light meal"]),
      (foodCatId, "Doi Mura (Flattened Rice) 500g", "Traditional flattened rice (poha), ideal for Assamese snacks.", 14900, 0, "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80", 44, "Snacks & Namkeen", 640, 250, "Brahmaputra Farms", ["poha", "flattened rice", "mura", "assam", "assamese food", "snacks"]),
      (foodCatId, "Assam Lai Xaak Chips (Dried Greens) 100g", "Dried sun-cured Assamese mustard greens, crunchy and nutritious.", 18900, 0, "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80", 45, "Snacks & Namkeen", 340, 120, "Assam Greens Co.", ["chips", "dried greens", "lai xaak", "assam", "assamese food", "snacks", "healthy"]),
      (foodCatId, "Rice Papad (Assamese Bori) 200g", "Sun-dried rice lentil crackers, pan-fried to perfection.", 19900, 5, "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80", 46, "Snacks & Namkeen", 580, 160, "Maa's Kitchen", ["papad", "bori", "rice cracker", "assam", "assamese food", "snacks"]),

      // Sweets & Mithai (5)
      (foodCatId, "Narikolor Ladoo (Coconut Sweet) 12pcs", "Handcrafted Assamese coconut sweets, perfect for festivals and gifts.", 29900, 0, "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80", 47, "Sweets & Mithai", 540, 60, "Guwahati Sweets", ["sweets", "ladoo", "coconut", "narikolor", "assam", "assamese food", "festival", "mithai", "gift"]),
      (foodCatId, "Assam Sandesh (Chhana Sweet) 250g", "Delicate cottage cheese sweets lightly flavoured with cardamom.", 34900, 0, "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80", 46, "Sweets & Mithai", 360, 40, "Guwahati Sweets", ["sweets", "sandesh", "chhana", "assam", "assamese food", "mithai", "gift"]),
      (foodCatId, "Pitha Box Assorted (Bihu Special) 6pcs", "Assorted traditional Assamese pithas — Til Pitha, Ghila Pitha, Sunga Pitha.", 39900, 10, "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80", 48, "Sweets & Mithai", 480, 30, "Bihu Delights", ["pitha", "sweets", "bihu", "assam", "assamese food", "traditional", "gift", "festival"]),
      (foodCatId, "Kordoi (Star Fruit) Candy 200g", "Tangy-sweet star fruit candy from Assam's gardens.", 16900, 0, "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80", 44, "Sweets & Mithai", 290, 120, "Assam Confections", ["candy", "kordoi", "star fruit", "assam", "assamese food", "sweets"]),
      (foodCatId, "Assam Black Rice Kheer Mix 300g", "Instant kheer mix made with Assam's prized black rice.", 24900, 5, "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=80", 45, "Sweets & Mithai", 340, 80, "Bihu Delights", ["kheer", "black rice", "assam", "assamese food", "sweets", "dessert"]),

      // Oils & Ghee (5)
      (foodCatId, "Cold-Pressed Mustard Oil (Teel) 1L", "Traditional cold-pressed mustard oil, pungent and aromatic as used in Assamese cooking.", 38900, 5, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80", 45, "Oils & Ghee", 980, 90, "Assam Pure Foods", ["mustard oil", "oil", "teel", "assam", "assamese food", "cold pressed", "cooking oil"]),
      (foodCatId, "Assam Desi Ghee (Goru Ghee) 500ml", "Pure cow ghee from Assam's pasture-fed desi cows, golden and aromatic.", 49900, 0, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80", 48, "Oils & Ghee", 860, 60, "Dairy Assam", ["ghee", "desi ghee", "cow ghee", "assam", "assamese food", "pure", "cooking"]),
      (foodCatId, "Sesame Oil (Til Tel) 500ml", "Cold-pressed sesame oil, light and nutty, traditional Assamese kitchen staple.", 34900, 0, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80", 44, "Oils & Ghee", 520, 100, "Assam Pure Foods", ["sesame oil", "til tel", "oil", "assam", "assamese food", "cold pressed"]),
      (foodCatId, "Coconut Oil Assam Pressed 500ml", "Traditional wooden press coconut oil, ideal for cooking and hair care.", 29900, 8, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80", 43, "Oils & Ghee", 390, 120, "Pure Oils Assam", ["coconut oil", "oil", "assam", "assamese food", "hair care", "cooking"]),

      // ===== SPICES & HERBS =====
      // Whole Spices (5)
      (spicesCatId, "Assamese Bay Leaves (Tej Patta) 50g", "Fragrant bay leaves from Assam's forests, aromatic and flavourful.", 12900, 10, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80", 44, "Whole Spices", 560, 300, "Forest Harvest", ["spices", "bay leaves", "tej patta", "assam", "whole spices", "aromatic"]),
      (spicesCatId, "Mustard Seeds (Black) Assam Organic 250g", "Organically grown black mustard seeds from Assam's fertile plains.", 14900, 0, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80", 45, "Whole Spices", 670, 220, "Organic Assam", ["spices", "mustard seeds", "black mustard", "organic", "assam", "whole spices"]),
      (spicesCatId, "Assam Black Cardamom (Bori Elachi) 50g", "Large black cardamom from Assam's foothills, smoky and aromatic.", 34900, 0, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80", 46, "Whole Spices", 430, 150, "Spice Farm Assam", ["spices", "black cardamom", "elachi", "assam", "whole spices", "aromatic", "smoky"]),
      (spicesCatId, "Assam Coriander Seeds Organic 200g", "Whole coriander seeds from certified organic Assam farms.", 15900, 5, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80", 43, "Whole Spices", 380, 200, "Organic Assam", ["spices", "coriander", "seeds", "assam", "organic", "whole spices"]),
      (spicesCatId, "Fenugreek Seeds (Methi) Assam 200g", "Bitter, aromatic methi seeds from Assam, key in pickling and dals.", 11900, 0, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80", 43, "Whole Spices", 340, 250, "Local Harvest", ["spices", "fenugreek", "methi", "assam", "whole spices", "dal"]),

      // Ground Spices (5)
      (spicesCatId, "Wild Turmeric (Joha Haldi) Powder 200g", "Aromatic wild turmeric unique to Assam, stronger than regular turmeric.", 24900, 5, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80", 48, "Ground Spices", 820, 140, "Brahmaputra Spices", ["spices", "turmeric", "haldi", "wild turmeric", "assam", "ground spices", "aromatic", "ayurvedic"]),
      (spicesCatId, "Assam Red Chilli Powder (Jolokia Powder) 100g", "Fiery ground red chilli from Assam farms, authentic heat.", 19900, 0, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80", 46, "Ground Spices", 760, 180, "Spice Farm Assam", ["spices", "chilli powder", "red chilli", "jolokia", "assam", "ground spices", "hot"]),
      (spicesCatId, "Coriander Powder (Dhania) Assam 200g", "Fresh ground coriander from Assam farms, vibrant yellow-green.", 14900, 0, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80", 43, "Ground Spices", 520, 200, "Brahmaputra Spices", ["spices", "coriander powder", "dhania", "assam", "ground spices"]),
      (spicesCatId, "Assam Cumin Powder (Jira) 100g", "Freshly ground cumin from Assam, warm and earthy flavour.", 16900, 5, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80", 44, "Ground Spices", 410, 180, "Spice Route India", ["spices", "cumin", "jira", "cumin powder", "assam", "ground spices"]),
      (spicesCatId, "Assam Garam Masala Blend 100g", "Authentic Assamese garam masala with local spice proportions.", 22900, 8, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80", 46, "Ground Spices", 680, 160, "Spice Farm Assam", ["spices", "garam masala", "spice blend", "assam", "ground spices", "cooking"]),

      // Spice Blends (5)
      (spicesCatId, "Assamese Panch Phoron Spice Blend 100g", "Traditional five-spice blend used in Assamese and Bengali cooking.", 19900, 0, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80", 46, "Spice Blends", 1100, 180, "Spice Route India", ["spices", "panch phoron", "five spice", "spice blend", "assam", "cooking"]),
      (spicesCatId, "Assam Tenga Masor Masala 100g", "Special masala blend for Assamese sour fish curry (tenga).", 24900, 0, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80", 47, "Spice Blends", 560, 120, "Assam Spice House", ["spices", "tenga", "fish masala", "assam", "spice blend", "assamese cooking"]),
      (spicesCatId, "Khar Spice Mix Assamese 50g", "Dried banana peel khar mix for traditional khar dishes.", 18900, 0, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80", 45, "Spice Blends", 380, 100, "Assam Spice House", ["spices", "khar", "banana peel", "assam", "spice blend", "traditional"]),
      (spicesCatId, "Biryani Masala Assamese Style 100g", "Aromatic biryani masala with Assam-specific spice proportions.", 24900, 5, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80", 44, "Spice Blends", 430, 160, "Spice Route India", ["spices", "biryani masala", "spice blend", "assam", "cooking"]),
      (spicesCatId, "Bhut Jolokia Powder 50g (Ghost Pepper)", "World-famous ghost pepper powder from Assam. Extreme heat!", 34900, 0, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80", 47, "Spice Blends", 1890, 200, "Spice Farm Assam", ["spices", "bhut jolokia", "ghost pepper", "hot", "assam", "chilli", "extreme heat"]),

      // ===== MEDICINE & HERBS =====
      // Ayurvedic Herbs (5)
      (medicineCatId, "Brahmi (Bacopa) Dried Herb 100g", "Dried Brahmi leaves from Assam, powerful memory and brain tonic.", 24900, 0, "https://images.unsplash.com/photo-1611241443322-78b6f6a12b9b?w=400&q=80", 46, "Ayurvedic Herbs", 540, 100, "Assam Ayurveda", ["herbs", "brahmi", "ayurvedic", "assam", "brain tonic", "memory", "medicine", "ayurveda"]),
      (medicineCatId, "Ashwagandha Root Powder 100g", "Premium Ashwagandha from Assam hills, stress-relief and immunity booster.", 29900, 5, "https://images.unsplash.com/photo-1611241443322-78b6f6a12b9b?w=400&q=80", 47, "Ayurvedic Herbs", 780, 120, "Assam Ayurveda", ["herbs", "ashwagandha", "ayurvedic", "assam", "stress relief", "immunity", "medicine", "ayurveda"]),
      (medicineCatId, "Giloy (Guduchi) Stem Powder 100g", "Dried Giloy stem from Assam forest, immunity and anti-inflammatory.", 22900, 0, "https://images.unsplash.com/photo-1611241443322-78b6f6a12b9b?w=400&q=80", 45, "Ayurvedic Herbs", 620, 100, "Forest Herbs Assam", ["herbs", "giloy", "guduchi", "ayurvedic", "assam", "immunity", "medicine"]),
      (medicineCatId, "Triphala Churna (Assam Herbs) 200g", "Traditional three-fruit formula powder, digestive and cleansing.", 27900, 0, "https://images.unsplash.com/photo-1611241443322-78b6f6a12b9b?w=400&q=80", 46, "Ayurvedic Herbs", 490, 90, "Assam Ayurveda", ["herbs", "triphala", "churna", "ayurvedic", "assam", "digestive", "medicine"]),
      (medicineCatId, "Shatavari Root Powder 100g", "Women's wellness herb from Assam, hormonal balance and vitality.", 34900, 5, "https://images.unsplash.com/photo-1611241443322-78b6f6a12b9b?w=400&q=80", 45, "Ayurvedic Herbs", 380, 80, "Assam Ayurveda", ["herbs", "shatavari", "ayurvedic", "assam", "womens health", "medicine"]),

      // Traditional Remedies (5)
      (medicineCatId, "Assam Wild Honey 500g", "Raw, unfiltered wild honey from Assam's forests, medicinal quality.", 54900, 0, "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&q=80", 49, "Traditional Remedies", 1200, 60, "Wild Forest Assam", ["honey", "wild honey", "assam", "natural", "medicine", "remedy", "antibacterial"]),
      (medicineCatId, "Assamese Neem Leaf Powder 100g", "Dried neem leaves from Assam, antiseptic and skin purifying.", 18900, 0, "https://images.unsplash.com/photo-1611241443322-78b6f6a12b9b?w=400&q=80", 44, "Traditional Remedies", 430, 150, "Forest Herbs Assam", ["herbs", "neem", "assam", "antiseptic", "skin care", "medicine", "remedy"]),
      (medicineCatId, "Karela (Bitter Gourd) Powder 100g", "Sun-dried bitter gourd powder for blood sugar management.", 22900, 5, "https://images.unsplash.com/photo-1611241443322-78b6f6a12b9b?w=400&q=80", 45, "Traditional Remedies", 340, 100, "Assam Ayurveda", ["herbs", "karela", "bitter gourd", "assam", "diabetes", "blood sugar", "medicine"]),
      (medicineCatId, "Moringa (Drumstick) Leaf Powder 200g", "Nutrient-dense moringa from Assam, the 'miracle tree' superfood.", 29900, 0, "https://images.unsplash.com/photo-1611241443322-78b6f6a12b9b?w=400&q=80", 46, "Traditional Remedies", 560, 120, "Assam Superfoods", ["moringa", "drumstick", "superfood", "assam", "nutritious", "medicine", "remedy"]),
      (medicineCatId, "Black Seed (Kalonji) Oil 100ml", "Cold-pressed black seed oil, potent immune booster and anti-inflammatory.", 39900, 0, "https://images.unsplash.com/photo-1611241443322-78b6f6a12b9b?w=400&q=80", 47, "Traditional Remedies", 480, 80, "Assam Ayurveda", ["black seed", "kalonji", "oil", "assam", "immune booster", "medicine", "remedy"]),

      // Herbal Teas (5)
      (medicineCatId, "Tulsi Ginger Immunity Tea 100g", "Soothing blend of tulsi and ginger for colds and immunity.", 24900, 10, "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80", 46, "Herbal Teas", 780, 150, "Assam Herbal Co.", ["herbal tea", "tulsi", "ginger", "assam", "immunity", "cold relief", "medicine", "tea"]),
      (medicineCatId, "Lemongrass Tulsi Herbal Tea 100g", "Refreshing lemongrass with tulsi, calming and digestive.", 22900, 0, "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80", 45, "Herbal Teas", 590, 130, "Assam Herbal Co.", ["herbal tea", "lemongrass", "tulsi", "assam", "digestive", "calming", "tea"]),
      (medicineCatId, "Chamomile Dried Flower Tea 50g", "Dried chamomile flowers from Assam's hills, promotes sleep.", 29900, 0, "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80", 46, "Herbal Teas", 420, 80, "Hill Flora Assam", ["herbal tea", "chamomile", "assam", "sleep", "calming", "tea"]),
      (medicineCatId, "Peppermint Herbal Tea 50g", "Pure peppermint tea, cooling and digestive aid.", 19900, 5, "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80", 44, "Herbal Teas", 380, 120, "Assam Herbal Co.", ["herbal tea", "peppermint", "mint tea", "assam", "digestive", "cooling", "tea"]),
      (medicineCatId, "Moringa Herbal Tea 100g", "Nutrient-rich moringa leaf tea, earthy and energising.", 27900, 0, "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80", 45, "Herbal Teas", 340, 100, "Assam Superfoods", ["herbal tea", "moringa", "assam", "nutritious", "energy", "tea"]),

      // ===== ASSAMESE ATTIRE =====
      // Mekhela Chador (6)
      (attireCatId, "Muga Silk Mekhela Chador Set (Bridal)", "Exquisite bridal Mekhela Chador in Muga silk. GI tagged. Handwoven for weddings.", 899900, 0, "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80", 49, "Mekhela Chador", 210, 20, "Royal Assam Silks", ["mekhela chador", "muga silk", "bridal", "wedding", "assam", "assamese attire", "traditional", "GI tagged"]),
      (attireCatId, "Assamese Cotton Mekhela Chador (Daily Wear)", "Comfortable cotton Mekhela Chador for everyday use.", 179900, 10, "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80", 44, "Mekhela Chador", 560, 80, "Weavers Guild", ["mekhela chador", "cotton", "daily wear", "assam", "assamese attire", "traditional"]),
      (attireCatId, "Bihu Festival Mekhela Chador (Cotton)", "Vibrant cotton Mekhela Chador ideal for Bihu celebrations.", 219900, 8, "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80", 47, "Mekhela Chador", 870, 45, "Festival Fashions", ["mekhela chador", "bihu", "festival", "cotton", "assam", "assamese attire", "traditional"]),
      (attireCatId, "Ready-to-Wear Stitched Mekhela Chador", "Pre-stitched Mekhela Chador in cotton-silk blend. Easy to wear, modern fit.", 249900, 12, "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80", 45, "Mekhela Chador", 720, 40, "Assam Ready Wear", ["mekhela chador", "ready to wear", "modern", "assam", "assamese attire"]),
      (attireCatId, "Pat Silk Mekhela Chador (Traditional)", "Handwoven Pat silk Mekhela Chador with traditional motifs.", 349900, 0, "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80", 48, "Mekhela Chador", 340, 25, "Sualkuchi Weavers", ["mekhela chador", "pat silk", "traditional", "assam", "assamese attire", "handwoven"]),
      (attireCatId, "Girls' Mekhela Chador (Kids, 4-12 yrs)", "Adorable handloom Mekhela Chador for girls, perfect for Bihu and puja.", 99900, 0, "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80", 48, "Mekhela Chador", 560, 70, "Little Assam", ["mekhela chador", "kids", "girls", "handloom", "assam", "assamese attire", "bihu"]),

      // Gamosa (5)
      (attireCatId, "Traditional White Gamosa", "Hand-woven cotton Gamosa with red border motifs. Symbol of Assamese culture.", 39900, 0, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", 48, "Gamosa", 1890, 200, "Weave Assam", ["gamosa", "traditional", "cotton", "assam", "assamese attire", "gift", "red border"]),
      (attireCatId, "Silk Gamosa (Premium Gift)", "Premium silk Gamosa with intricate red and golden motifs, ideal as a gift.", 89900, 0, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", 49, "Gamosa", 760, 100, "Sualkuchi Weavers", ["gamosa", "silk", "premium", "assam", "assamese attire", "gift", "traditional"]),
      (attireCatId, "Gamosa Dupatta (Stole)", "Lightweight gamosa-weave dupatta with red border, versatile wear.", 59900, 0, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", 45, "Gamosa", 490, 90, "Weave Assam", ["gamosa", "dupatta", "stole", "assam", "assamese attire", "cotton"]),
      (attireCatId, "Gamosa Table Runner Set (2 pcs)", "Traditional gamosa repurposed as beautiful table runners for homes.", 79900, 5, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", 44, "Gamosa", 280, 120, "Weave Assam", ["gamosa", "table runner", "home decor", "assam", "assamese attire", "gift"]),
      (attireCatId, "Gamosa Cushion Cover Set (2 pcs)", "Beautiful gamosa-weave cushion covers with traditional red motifs.", 69900, 8, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", 45, "Gamosa", 360, 100, "Weave Assam", ["gamosa", "cushion cover", "home decor", "assam", "assamese attire", "traditional"]),

      // Men's Dhoti & Kurta (5)
      (attireCatId, "Men's Assamese Dhoti (Cotton, Premium)", "Comfortable premium cotton dhoti for traditional Assamese ceremonies.", 49900, 5, "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80", 44, "Men's Dhoti & Kurta", 680, 85, "Assam Garments", ["dhoti", "men", "traditional", "cotton", "assam", "assamese attire", "ceremony"]),
      (attireCatId, "Assamese Kurta with Jamdani Work (Men)", "Elegant kurta with traditional Jamdani weave pattern, festive wear.", 149900, 10, "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80", 46, "Men's Dhoti & Kurta", 420, 55, "Weave Wear", ["kurta", "jamdani", "men", "festive", "assam", "assamese attire"]),
      (attireCatId, "Assam Handloom Dhoti-Kurta Set (Men)", "Complete handloom dhoti-kurta set for Bihu and festivals.", 199900, 0, "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80", 47, "Men's Dhoti & Kurta", 380, 40, "Assam Garments", ["dhoti", "kurta", "men", "set", "assam", "assamese attire", "festival", "bihu"]),
      (attireCatId, "Cotton Lungi (Assamese Style) 2.5m", "Traditional Assamese lungi in fine cotton, comfortable for daily wear.", 34900, 0, "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80", 43, "Men's Dhoti & Kurta", 540, 120, "Assam Garments", ["lungi", "dhoti", "men", "cotton", "assam", "assamese attire", "daily wear"]),

      // ===== HANDLOOM & TEXTILES =====
      // Muga Silk (5)
      (handloomCatId, "Muga Silk Mekhela Chador Set", "Authentic Assam Muga silk Mekhela Chador. GI tagged. Handwoven by local artisans.", 549900, 0, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", 49, "Muga Silk", 320, 30, "Sualkuchi Weavers", ["muga silk", "silk", "handloom", "GI tagged", "assam", "traditional", "mekhela chador"]),
      (handloomCatId, "Muga Silk Stole with Elephant Motif", "Elegant Muga silk stole featuring traditional Assamese elephant motifs.", 149900, 0, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", 48, "Muga Silk", 430, 50, "Sualkuchi Weavers", ["muga silk", "silk", "stole", "elephant", "assam", "handloom", "gift"]),
      (handloomCatId, "Muga Silk Saree Traditional Assam", "Classic Muga silk saree, handwoven with traditional Assamese border patterns.", 449900, 5, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", 48, "Muga Silk", 260, 25, "Sualkuchi Weavers", ["muga silk", "silk", "saree", "assam", "handloom", "traditional"]),
      (handloomCatId, "Muga Silk Kurta Length 2m", "Premium Muga silk fabric for custom kurta stitching, golden natural sheen.", 299900, 0, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", 47, "Muga Silk", 180, 35, "Assam Silk Co.", ["muga silk", "silk", "fabric", "kurta", "assam", "handloom"]),

      // Pat Silk (5)
      (handloomCatId, "Pat Silk Fabric Roll 2m", "Premium Pat silk fabric roll for custom stitching. Natural golden sheen.", 89900, 0, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", 46, "Pat Silk", 260, 40, "Assam Silk Co.", ["pat silk", "silk", "fabric", "assam", "handloom", "premium"]),
      (handloomCatId, "Pat Silk Saree with Assamese Border", "Beautiful Pat silk saree with traditional Assamese motif border.", 379900, 0, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", 47, "Pat Silk", 290, 20, "Sualkuchi Weavers", ["pat silk", "silk", "saree", "assam", "handloom", "traditional"]),
      (handloomCatId, "Pat Silk Blouse Piece 1m", "Pure Pat silk blouse piece, pairs perfectly with any Assamese saree.", 69900, 5, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", 45, "Pat Silk", 380, 50, "Assam Silk Co.", ["pat silk", "silk", "blouse", "assam", "handloom"]),

      // Eri Silk (5)
      (handloomCatId, "Eri Silk Saree with Jaapi Motif", "Lightweight Eri silk saree with traditional Jaapi and elephant motifs.", 289900, 5, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", 47, "Eri Silk", 180, 25, "Silk Route Assam", ["eri silk", "silk", "saree", "jaapi", "assam", "handloom", "motif"]),
      (handloomCatId, "Eri Silk Shawl (Warm and Soft)", "Naturally warm Eri silk shawl, perfect for winters.", 199900, 0, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", 47, "Eri Silk", 320, 40, "Silk Route Assam", ["eri silk", "silk", "shawl", "assam", "handloom", "warm"]),
      (handloomCatId, "Eri Silk Stole (Lightweight)", "Soft Eri silk stole for everyday use, naturally dyed.", 99900, 8, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", 46, "Eri Silk", 240, 60, "Silk Route Assam", ["eri silk", "silk", "stole", "assam", "handloom", "gift"]),

      // Cotton Handloom (5)
      (handloomCatId, "Assamese Handloom Cotton Saree", "Handwoven cotton saree in traditional Assamese colours and patterns.", 179900, 10, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", 45, "Cotton Handloom", 480, 60, "Weavers Guild", ["cotton", "handloom", "saree", "assam", "traditional", "cotton handloom"]),
      (handloomCatId, "Handloom Cotton Dupatta (Assamese)", "Vibrant cotton dupatta from Assam, hand-woven with nature motifs.", 79900, 0, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", 44, "Cotton Handloom", 360, 90, "Weavers Guild", ["cotton", "handloom", "dupatta", "assam", "traditional", "cotton handloom"]),
      (handloomCatId, "Assamese Cotton Bed Sheet (Double, Handloom)", "King size handloom cotton bed sheet with Assamese weave pattern.", 249900, 8, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", 45, "Cotton Handloom", 280, 45, "Loom Craft Assam", ["cotton", "handloom", "bed sheet", "assam", "home decor", "cotton handloom"]),

      // ===== HANDICRAFTS =====
      // Bamboo Craft (6)
      (handicraftCatId, "Jaapi (Traditional Conical Hat) Decorative", "Decorative Assamese Jaapi, symbol of welcome and hospitality. Hand-crafted.", 89900, 0, "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&q=80", 48, "Bamboo Craft", 1100, 70, "Crafts of Assam", ["jaapi", "bamboo", "traditional", "handicraft", "assam", "decor", "handmade"]),
      (handicraftCatId, "Cane Bamboo Storage Basket Set (3pcs)", "Set of three handmade cane and bamboo storage baskets.", 79900, 10, "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&q=80", 45, "Bamboo Craft", 870, 100, "Bamboo Crafts Assam", ["bamboo", "cane", "basket", "storage", "handicraft", "assam", "handmade"]),
      (handicraftCatId, "Bamboo Photo Frame (Handmade)", "Eco-friendly bamboo photo frame with traditional Assamese carvings.", 29900, 15, "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&q=80", 44, "Bamboo Craft", 550, 120, "Green Crafts", ["bamboo", "photo frame", "eco-friendly", "handmade", "assam", "handicraft"]),
      (handicraftCatId, "Bamboo Wind Chime (Handcrafted)", "Melodious bamboo wind chime, perfect for home decor.", 39900, 0, "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&q=80", 45, "Bamboo Craft", 440, 150, "Green Crafts", ["bamboo", "wind chime", "home decor", "handmade", "assam", "handicraft"]),
      (handicraftCatId, "Bamboo Coaster Set (6pcs)", "Eco-friendly bamboo coasters with burnt Assamese motifs.", 24900, 5, "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&q=80", 44, "Bamboo Craft", 380, 200, "Bamboo Crafts Assam", ["bamboo", "coaster", "eco-friendly", "assam", "handicraft", "kitchen"]),
      (handicraftCatId, "Decorative Bamboo Lamp Shade", "Handcrafted bamboo lamp shade with geometric weave patterns.", 69900, 0, "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&q=80", 46, "Bamboo Craft", 310, 80, "Green Crafts", ["bamboo", "lamp shade", "home decor", "handmade", "assam", "handicraft", "light"]),

      // Bell Metal (5)
      (handicraftCatId, "Bell Metal Xorai (Ritual Offering Plate)", "Traditional Assam bell metal Xorai for religious ceremonies and decoration.", 149900, 5, "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&q=80", 49, "Bell Metal", 690, 45, "Sarthebari Craftsmen", ["bell metal", "xorai", "ritual", "traditional", "assam", "handicraft", "puja"]),
      (handicraftCatId, "Bell Metal Bota (Decorative Bowl)", "Exquisitely crafted bell metal Bota, used for offerings and decoration.", 119900, 0, "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&q=80", 48, "Bell Metal", 310, 35, "Sarthebari Craftsmen", ["bell metal", "bota", "bowl", "handcrafted", "assam", "handicraft"]),
      (handicraftCatId, "Bell Metal Diya Set (5pcs)", "Set of five small bell metal oil lamps, ideal for puja and festivals.", 79900, 0, "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&q=80", 47, "Bell Metal", 560, 60, "Sarthebari Craftsmen", ["bell metal", "diya", "lamp", "puja", "festival", "assam", "handicraft"]),
      (handicraftCatId, "Bell Metal Flower Vase", "Decorative bell metal vase with traditional Assamese engravings.", 149900, 8, "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&q=80", 47, "Bell Metal", 280, 40, "Sarthebari Craftsmen", ["bell metal", "vase", "decor", "assam", "handicraft", "engraved"]),

      // Clay Pottery (5)
      (handicraftCatId, "Terracotta Elephant Figurine Set (2pcs)", "Hand-painted terracotta elephant pair, traditional Assamese motifs.", 49900, 0, "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&q=80", 47, "Clay Pottery", 780, 80, "Dhekiakhowa Pottery", ["terracotta", "elephant", "pottery", "clay", "assam", "handicraft", "decor"]),
      (handicraftCatId, "Clay Diya Set (Deepawali Special) 10pcs", "Handmade clay diyas for Deepawali and daily puja.", 19900, 0, "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&q=80", 46, "Clay Pottery", 980, 300, "Dhekiakhowa Pottery", ["clay", "diya", "pottery", "deepawali", "assam", "handicraft", "puja"]),
      (handicraftCatId, "Assamese Clay Pot (Water Cooling)", "Traditional Assamese clay pot for cooling water naturally.", 39900, 0, "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&q=80", 45, "Clay Pottery", 560, 70, "Dhekiakhowa Pottery", ["clay", "pot", "pottery", "water", "assam", "handicraft", "traditional"]),

      // Mask Making (5)
      (handicraftCatId, "Ravana Mask (Raas Mahotsav) Decorative", "Traditional Assamese Ravana mask used in Raas festival, vibrant and hand-painted.", 59900, 0, "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&q=80", 47, "Mask Making", 320, 50, "Majuli Crafts", ["mask", "ravana", "raas", "festival", "assam", "handicraft", "traditional", "decor"]),
      (handicraftCatId, "Mahishasur Mask Assam Traditional", "Large decorative mask of Mahishasur, traditionally made in Majuli.", 69900, 0, "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&q=80", 46, "Mask Making", 240, 35, "Majuli Crafts", ["mask", "mahishasur", "assam", "handicraft", "traditional", "decor", "majuli"]),
      (handicraftCatId, "Vaishnavite Deity Mask (Small Set, 3pcs)", "Set of three small Vaishnavite deity masks, handmade in Majuli.", 89900, 5, "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?w=400&q=80", 48, "Mask Making", 280, 40, "Majuli Crafts", ["mask", "vaishnavite", "deity", "assam", "handicraft", "majuli", "traditional"]),

      // ===== ART & PAINTINGS =====
      (artCatId, "Assamese Countryside Oil Painting (16x20)", "Original oil painting of Assam's Brahmaputra riverside village.", 299900, 0, "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80", 47, "Assamese Oil Paintings", 120, 10, "Assam Art Studio", ["painting", "oil painting", "assam", "art", "original", "landscape", "brahmaputra"]),
      (artCatId, "Kaziranga Rhino Oil Painting (12x16)", "Vivid oil painting of a one-horned rhino in Kaziranga grasslands.", 249900, 0, "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80", 48, "Assamese Oil Paintings", 90, 8, "Wildlife Art Assam", ["painting", "oil painting", "rhino", "kaziranga", "assam", "art", "wildlife"]),
      (artCatId, "Bihu Dance Watercolour (A3)", "Expressive watercolour depicting Bihu dancers in traditional attire.", 149900, 10, "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80", 46, "Watercolors", 180, 15, "Assam Art Studio", ["painting", "watercolour", "bihu", "dance", "assam", "art", "traditional"]),
      (artCatId, "Assamese Village Watercolour (A4)", "Serene watercolour of an Assamese village with tea gardens.", 89900, 0, "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80", 45, "Watercolors", 140, 20, "Guwahati Artists", ["painting", "watercolour", "village", "tea garden", "assam", "art"]),
      (artCatId, "Sattriya Dance Folk Art Print (A3)", "Vibrant folk art print depicting Sattriya classical dance form.", 79900, 0, "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80", 46, "Folk Art", 210, 30, "Assam Folk Studio", ["folk art", "sattriya", "dance", "assam", "print", "art", "traditional"]),
      (artCatId, "Bihu Festival Folk Art Canvas Print", "Colourful canvas print of Bihu festival celebrations.", 69900, 5, "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80", 45, "Folk Art", 270, 40, "Assam Folk Studio", ["folk art", "bihu", "festival", "canvas", "assam", "print", "art"]),
      (artCatId, "Assamese Bronze Sculpture (Nataraja Variant)", "Hand-cast bronze sculpture in Assamese traditional style.", 499900, 0, "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80", 48, "Sculptures", 60, 5, "Assam Sculptures", ["sculpture", "bronze", "assam", "art", "traditional", "handcrafted"]),
      (artCatId, "Assam Tea Garden Art Print (A2, Framed)", "Panoramic print of Assam tea gardens at sunrise, professionally framed.", 119900, 0, "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&q=80", 47, "Prints", 160, 25, "Assam Art Studio", ["print", "tea garden", "assam", "art", "framed", "landscape"]),

      // ===== BOOKS & LITERATURE =====
      (booksCatId, "Assamese Short Stories Anthology", "Collection of 25 contemporary Assamese short stories translated to English.", 39900, 0, "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80", 46, "Assamese Novels", 640, 90, "Sahitya Prakashan", ["books", "assamese", "short stories", "literature", "translated", "assam"]),
      (booksCatId, "Seuji Patar Xapun (Assamese Novel)", "Bestselling Assamese novel by a celebrated modern author.", 34900, 5, "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80", 47, "Assamese Novels", 540, 80, "Bani Prakashan", ["books", "assamese novel", "fiction", "assam", "literature"]),
      (booksCatId, "History of Assam by Dr. P.C. Choudhury", "Comprehensive history of Assam from ancient Kamarupa to modern times.", 59900, 10, "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80", 48, "History & Culture", 450, 60, "Bani Prakashan", ["books", "history", "assam", "kamarupa", "academic", "culture"]),
      (booksCatId, "Assam's Tribal Heritage (Culture Book)", "Illustrated cultural survey of Assam's many tribes and communities.", 69900, 0, "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80", 47, "History & Culture", 320, 50, "Heritage Press Assam", ["books", "tribal", "heritage", "assam", "culture", "history"]),
      (booksCatId, "Lakshminath Bezbaroa Poetry Collection", "Selected works of the father of Assamese literature, bilingual edition.", 44900, 5, "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80", 49, "Poetry", 380, 75, "Assam Sahitya Sabha", ["books", "poetry", "bezbaroa", "assamese", "classic", "literature", "assam"]),
      (booksCatId, "Modern Assamese Poetry Anthology (English)", "Translated collection of modern Assamese poetry, multiple voices.", 39900, 0, "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80", 46, "Poetry", 280, 65, "Sahitya Prakashan", ["books", "poetry", "assamese", "translated", "modern", "literature", "assam"]),
      (booksCatId, "Assamese Folk Tales for Children (Illustrated)", "Illustrated collection of traditional Assamese folk tales for young readers.", 29900, 0, "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80", 47, "Children's Books", 920, 110, "Prantik Publishers", ["books", "folk tales", "children", "illustrated", "assamese", "assam", "kids"]),
      (booksCatId, "Bihu: Culture and Celebration (Coffee Table Book)", "Beautiful coffee table book on Assam's Bihu festival with photographs.", 79900, 15, "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80", 47, "History & Culture", 280, 45, "Photo Assam", ["books", "bihu", "festival", "culture", "coffee table book", "assam", "photography"]),

      // ===== CHRONICLES & MAGAZINES =====
      (chroniclesCatId, "Gariyoshi Monthly Magazine (3-month subscription)", "Premium Assamese monthly magazine covering culture, arts and current affairs.", 44900, 0, "https://images.unsplash.com/photo-1585241936939-be4099591252?w=400&q=80", 46, "Monthly Magazines", 380, 100, "Gariyoshi Publications", ["magazine", "assamese", "monthly", "culture", "assam", "chronicles"]),
      (chroniclesCatId, "Sadin Assamese Weekly Magazine (5 issues)", "Popular Assamese weekly newspaper and magazine bundle.", 24900, 5, "https://images.unsplash.com/photo-1585241936939-be4099591252?w=400&q=80", 45, "Monthly Magazines", 290, 150, "Sadin Publications", ["magazine", "assamese", "weekly", "news", "assam", "chronicles"]),
      (chroniclesCatId, "Assam Annual Cultural Digest 2024", "Comprehensive annual review of Assam's culture, arts and literature.", 49900, 0, "https://images.unsplash.com/photo-1585241936939-be4099591252?w=400&q=80", 47, "Annual Editions", 210, 60, "Heritage Press Assam", ["magazine", "annual", "culture", "assam", "chronicles", "digest"]),
      (chroniclesCatId, "Journal of Assamese Studies (Vol.12)", "Peer-reviewed academic journal on Assamese language, culture and history.", 59900, 0, "https://images.unsplash.com/photo-1585241936939-be4099591252?w=400&q=80", 46, "Research Journals", 120, 40, "Assam University Press", ["journal", "academic", "assam", "research", "chronicles", "studies"]),
      (chroniclesCatId, "Bihu Utsav Souvenir Magazine 2024", "Special edition souvenir magazine for Bihu festival 2024.", 29900, 0, "https://images.unsplash.com/photo-1585241936939-be4099591252?w=400&q=80", 45, "Cultural Publications", 160, 80, "Bihu Cultural Org", ["magazine", "bihu", "souvenir", "festival", "assam", "chronicles", "cultural"]),
      (chroniclesCatId, "Northeast India Travel & Culture Magazine", "Travel and culture magazine focused on Northeast India including Assam.", 34900, 5, "https://images.unsplash.com/photo-1585241936939-be4099591252?w=400&q=80", 45, "Cultural Publications", 240, 90, "NE India Publications", ["magazine", "travel", "culture", "northeast", "assam", "chronicles"]),

      // ===== MUSICAL INSTRUMENTS =====
      // Dhol (5)
      (musicCatId, "Assamese Dhol (Traditional Drum, Full Size)", "Authentic full-size Assamese double-headed Dhol, used in Bihu.", 249900, 0, "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80", 48, "Dhol", 320, 20, "Assam Instruments", ["dhol", "drum", "assam", "bihu", "musical instrument", "traditional", "percussion"]),
      (musicCatId, "Dhol Mini Decorative (Display)", "Miniature decorative Dhol, ideal as showpiece or cultural gift.", 69900, 0, "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80", 45, "Dhol", 430, 60, "Assam Artisans", ["dhol", "drum", "miniature", "assam", "musical instrument", "gift", "decor"]),
      (musicCatId, "Dhol Stick Pair (Khutia & Baahi)", "Traditional Dhol playing sticks — flat wood and bamboo pair.", 24900, 0, "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80", 44, "Dhol", 180, 100, "Assam Instruments", ["dhol", "stick", "drumstick", "assam", "musical instrument", "bihu", "percussion"]),

      // Pepa (5)
      (musicCatId, "Pepa (Buffalo Horn Flute) Traditional", "Authentic Pepa made from buffalo horn, key instrument in Bihu music.", 79900, 0, "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80", 47, "Pepa", 280, 40, "Assam Instruments", ["pepa", "flute", "horn", "buffalo horn", "assam", "bihu", "musical instrument", "traditional"]),
      (musicCatId, "Pepa Brass Replica (Decorative)", "Brass replica of the traditional Pepa flute, ideal for display.", 54900, 0, "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80", 44, "Pepa", 210, 60, "Assam Artisans", ["pepa", "flute", "brass", "replica", "assam", "musical instrument", "gift", "decor"]),

      // Gogona (5)
      (musicCatId, "Gogona (Jaw Harp) Assamese Traditional", "Traditional Assamese jaw harp (Gogona), unique twanging instrument.", 34900, 0, "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80", 46, "Gogona", 380, 80, "Assam Instruments", ["gogona", "jaw harp", "assam", "bihu", "musical instrument", "traditional"]),
      (musicCatId, "Gogona Gift Pack (3 pieces, mixed tones)", "Set of three Gogonas in different tones, perfect as cultural gift.", 79900, 5, "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80", 47, "Gogona", 240, 50, "Assam Instruments", ["gogona", "jaw harp", "set", "assam", "bihu", "musical instrument", "gift"]),

      // Dotara (5)
      (musicCatId, "Dotara (4-string Folk Lute) Assam", "Traditional Assamese Dotara folk lute, handcrafted, tuned.", 349900, 0, "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80", 47, "Dotara", 180, 15, "Assam Instruments", ["dotara", "lute", "folk", "assam", "musical instrument", "traditional", "string instrument"]),
      (musicCatId, "Dotara Wall Hanging (Decorative)", "Decorative non-playable Dotara wall piece, cultural art.", 99900, 0, "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80", 44, "Dotara", 140, 30, "Assam Artisans", ["dotara", "wall hanging", "decor", "assam", "musical instrument", "gift"]),

      // ===== RELIGIOUS & PUJA ITEMS =====
      // Idols & Figurines (5)
      (pujaCatId, "Lord Vishnu Brass Idol (6 inch)", "Beautifully crafted brass Vishnu idol, polished finish.", 149900, 0, "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80", 48, "Idols & Figurines", 420, 50, "Assam Religious Arts", ["idol", "vishnu", "brass", "puja", "assam", "religious", "figurine"]),
      (pujaCatId, "Lakhimi (Lakshmi) Idol Brass (4 inch)", "Traditional Assamese Lakhimi (Lakshmi) brass idol for home puja.", 99900, 0, "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80", 47, "Idols & Figurines", 560, 70, "Assam Religious Arts", ["idol", "lakshmi", "lakhimi", "brass", "puja", "assam", "religious", "figurine"]),
      (pujaCatId, "Durga Idol (Clay, Navratri) 12 inch", "Beautiful hand-painted clay Durga idol for Navratri celebrations.", 199900, 0, "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80", 48, "Idols & Figurines", 310, 20, "Dhekiakhowa Pottery", ["idol", "durga", "clay", "navratri", "puja", "assam", "religious", "figurine"]),
      (pujaCatId, "Saraswati Brass Idol (4 inch)", "Elegant brass Saraswati idol, ideal for home and office.", 89900, 5, "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80", 46, "Idols & Figurines", 380, 60, "Assam Religious Arts", ["idol", "saraswati", "brass", "puja", "assam", "religious", "figurine"]),

      // Puja Thalis (5)
      (pujaCatId, "Bell Metal Xorai (Ritual Offering Plate)", "Traditional Assam bell metal Xorai for religious ceremonies.", 149900, 5, "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80", 49, "Puja Thalis", 690, 45, "Sarthebari Craftsmen", ["xorai", "bell metal", "puja thali", "ritual", "assam", "religious", "puja"]),
      (pujaCatId, "Brass Puja Thali Set (5-piece)", "Complete brass puja thali set with diya, bell, incense holder.", 199900, 0, "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80", 47, "Puja Thalis", 390, 40, "Assam Religious Arts", ["puja thali", "brass", "set", "diya", "assam", "religious", "puja"]),
      (pujaCatId, "Copper Puja Thali with Engraved Border", "Premium copper puja thali with Om and lotus engravings.", 129900, 8, "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80", 46, "Puja Thalis", 280, 55, "Assam Religious Arts", ["puja thali", "copper", "engraved", "assam", "religious", "puja"]),

      // Incense & Diyas (5)
      (pujaCatId, "Assam Bamboo Incense Sticks 100 sticks", "Natural bamboo incense with Assamese forest fragrances.", 14900, 0, "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80", 46, "Incense & Diyas", 780, 300, "Assam Incense Co.", ["incense", "agarbatti", "bamboo", "assam", "fragrance", "puja", "religious"]),
      (pujaCatId, "Loban (Benzoin) Dhup Incense 50g", "Traditional Assamese Loban resin incense, purifies atmosphere.", 19900, 0, "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80", 48, "Incense & Diyas", 560, 200, "Assam Incense Co.", ["incense", "loban", "dhup", "assam", "puja", "religious", "fragrance"]),
      (pujaCatId, "Brass Diya Set (12pcs, Deepawali)", "Set of twelve hand-cast brass diyas, ideal for Deepawali.", 79900, 5, "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80", 47, "Incense & Diyas", 480, 100, "Assam Religious Arts", ["diya", "brass", "deepawali", "set", "assam", "puja", "religious", "festival"]),

      // ===== DECORATIVE ITEMS =====
      (decorCatId, "Assamese Jaapi Wall Decor (Large)", "Large decorative Jaapi for wall mounting, painted with traditional motifs.", 129900, 0, "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80", 47, "Wall Decor", 540, 40, "Crafts of Assam", ["wall decor", "jaapi", "assam", "decorative", "traditional", "handmade"]),
      (decorCatId, "Assam Silk Wall Tapestry (30x40 inch)", "Vibrant silk tapestry depicting Assamese cultural scenes.", 249900, 10, "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80", 47, "Wall Decor", 290, 25, "Silk Route Assam", ["wall decor", "tapestry", "silk", "assam", "decorative", "cultural"]),
      (decorCatId, "Bell Metal Table Decor Elephant Pair", "Pair of bell metal elephants for table decoration.", 179900, 0, "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80", 48, "Table Decor", 360, 35, "Sarthebari Craftsmen", ["table decor", "bell metal", "elephant", "assam", "decorative", "handcrafted"]),
      (decorCatId, "Assamese Pottery Vase (Handmade)", "Hand-painted pottery vase with Assamese floral and animal motifs.", 69900, 5, "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80", 46, "Handmade Vases", 430, 60, "Dhekiakhowa Pottery", ["vase", "pottery", "handmade", "assam", "decorative", "floral"]),
      (decorCatId, "Bamboo Decorative Tray with Motifs", "Handcrafted bamboo tray with burnt Assamese patterns, multipurpose.", 49900, 0, "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80", 45, "Table Decor", 380, 80, "Green Crafts", ["tray", "bamboo", "decorative", "assam", "handmade", "table decor"]),
      (decorCatId, "Assamese Motif Clock (Handpainted Wood)", "Wooden wall clock hand-painted with Assamese bihu motifs.", 89900, 8, "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80", 45, "Assamese Motif Items", 220, 50, "Assam Artisans", ["clock", "wall clock", "wooden", "assam", "decorative", "handpainted", "bihu"]),
      (decorCatId, "Gamosa-Print Decorative Pillow Cover", "Cushion cover printed with authentic gamosa red-on-white pattern.", 59900, 0, "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80", 45, "Assamese Motif Items", 310, 100, "Weave Assam", ["pillow cover", "gamosa", "decorative", "assam", "traditional", "motif"]),

      // ===== KITCHEN & COOKWARE =====
      (kitchenCatId, "Bell Metal Thaal (Dinner Plate) Traditional", "Authentic bell metal dinner plate (Thaal) handcrafted in Sarthebari.", 199900, 0, "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80", 48, "Baan (Bell Metal)", 520, 40, "Sarthebari Craftsmen", ["bell metal", "thaal", "plate", "assam", "kitchen", "traditional", "cookware"]),
      (kitchenCatId, "Bell Metal Lota (Water Vessel)", "Traditional bell metal water vessel, antimicrobial and beautiful.", 89900, 5, "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80", 47, "Baan (Bell Metal)", 360, 55, "Sarthebari Craftsmen", ["bell metal", "lota", "water vessel", "assam", "kitchen", "traditional"]),
      (kitchenCatId, "Bell Metal Kosha (Cooking Pot) 1L", "Traditional Assamese bell metal cooking pot for slow-cooking curries.", 249900, 0, "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80", 47, "Baan (Bell Metal)", 280, 30, "Sarthebari Craftsmen", ["bell metal", "kosha", "cooking pot", "assam", "kitchen", "traditional", "cookware"]),
      (kitchenCatId, "Clay Handi (Earthen Cooking Pot)", "Traditional clay cooking pot for slow-cooking Assamese dishes.", 34900, 0, "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80", 45, "Clay Cookware", 640, 70, "Dhekiakhowa Pottery", ["clay pot", "handi", "earthen", "assam", "kitchen", "cookware", "traditional"]),
      (kitchenCatId, "Clay Kadai (Earthen Wok) Assam", "Deep clay kadai for frying and slow cooking traditional dishes.", 44900, 5, "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80", 45, "Clay Cookware", 420, 50, "Dhekiakhowa Pottery", ["clay", "kadai", "wok", "assam", "kitchen", "cookware", "earthen"]),
      (kitchenCatId, "Bamboo Serving Tray Set (2pcs)", "Eco-friendly bamboo serving tray set, practical and stylish.", 49900, 10, "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80", 44, "Bamboo Kitchenware", 780, 90, "Bamboo Home", ["bamboo", "tray", "serving", "eco-friendly", "assam", "kitchen", "cookware"]),
      (kitchenCatId, "Bamboo Spoon & Ladle Set (5pcs)", "Natural bamboo cooking utensils, eco-friendly and durable.", 39900, 20, "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80", 43, "Bamboo Kitchenware", 890, 150, "Green Home", ["bamboo", "spoon", "ladle", "eco-friendly", "assam", "kitchen", "utensils"]),
      (kitchenCatId, "Assamese Brass Serving Set (4pcs)", "Traditional brass serving bowls and serving spoon set, festive use.", 149900, 0, "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80", 47, "Assamese Serving Sets", 310, 35, "Assam Brass Works", ["brass", "serving set", "bowls", "assam", "kitchen", "festive", "traditional"]),

      // ===== LIVING ROOM DECOR =====
      (livingCatId, "Assamese Handloom Cotton Rug (4x6 ft)", "Flat-weave cotton rug with traditional Assamese geometric patterns.", 349900, 10, "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80", 47, "Assamese Rugs", 280, 20, "Loom Craft Assam", ["rug", "carpet", "handloom", "cotton", "assam", "living room", "home decor", "geometric"]),
      (livingCatId, "Muga Silk Cushion Cover Set (2pcs)", "Luxurious Muga silk cushion covers with traditional border embroidery.", 179900, 0, "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80", 48, "Cushion Covers", 340, 40, "Silk Route Assam", ["cushion cover", "muga silk", "assam", "living room", "home decor", "embroidery"]),
      (livingCatId, "Gamosa Pattern Cushion Cover Set (4pcs)", "Cotton cushion covers with traditional gamosa red-on-white weave.", 129900, 5, "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80", 46, "Cushion Covers", 490, 60, "Weave Assam", ["cushion cover", "gamosa", "cotton", "assam", "living room", "home decor"]),
      (livingCatId, "Assam Silk Wall Hanging (24x36 inch)", "Hand-embroidered silk wall hanging with Bihu and cultural scenes.", 299900, 0, "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80", 47, "Wall Hangings", 210, 15, "Silk Route Assam", ["wall hanging", "silk", "embroidered", "bihu", "assam", "living room", "home decor"]),
      (livingCatId, "Bamboo Macrame Wall Hanging", "Bohemian bamboo and macrame wall hanging with Assamese beads.", 69900, 0, "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80", 45, "Wall Hangings", 360, 50, "Green Crafts", ["wall hanging", "bamboo", "macrame", "assam", "living room", "boho", "home decor"]),
      (livingCatId, "Assamese Bamboo Lamp (Table, Handcrafted)", "Artisan bamboo table lamp with rice-paper shade and forest motif.", 149900, 8, "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80", 47, "Decorative Lamps", 280, 30, "Green Crafts", ["lamp", "bamboo", "table lamp", "assam", "living room", "home decor", "handcrafted"]),
      (livingCatId, "Terracotta Floor Lamp (Assam Motif)", "Hand-painted terracotta floor lamp with Assamese folk art patterns.", 249900, 0, "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80", 46, "Decorative Lamps", 160, 20, "Dhekiakhowa Pottery", ["lamp", "floor lamp", "terracotta", "assam", "living room", "home decor", "folk art"]),
      (livingCatId, "Assam Jute Runner Rug (2x6 ft, Hallway)", "Natural jute runner with hand-stitched Assam motif borders, ideal for hallways.", 129900, 10, "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80", 45, "Assamese Rugs", 230, 35, "Loom Craft Assam", ["rug", "runner", "jute", "assam", "hallway", "living room", "home decor"]),
    ];

    var id = nextProductId;
    for ((catId, title, description, price, discount, imageUrl, rating, subCategory, reviewCount, stock, brand, tags) in seedProductData.values()) {
      products.add({
        id;
        title;
        description;
        price;
        discountPercent = discount;
        imageUrls = [imageUrl];
        category = catId;
        subCategory;
        rating;
        reviewCount;
        stock;
        brand;
        tags;
        isActive = true;
        createdAt = now;
        updatedAt = now;
      });
      id += 1;
    };
    id;
  };
};
