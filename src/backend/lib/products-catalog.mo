import Types "../types/products-catalog";
import List "mo:core/List";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";

module {
  public type Product = Types.Product;
  public type Category = Types.Category;
  public type ProductId = Types.ProductId;
  public type CategoryId = Types.CategoryId;
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

  // --- Product Operations ---

  public func getProduct(products : List.List<Product>, id : ProductId) : ?Product {
    products.find<Product>(func(p) = p.id == id and p.isActive);
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
          if (not titleMatch and not descMatch and not brandMatch) return false;
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
    let seedData : [(Text, Text, Text, [Text])] = [
      ("Assam Tea", "assam-tea", "Premium teas from the lush Assam valley", ["CTC Tea", "Orthodox Tea", "Green Tea", "White Tea", "Herbal Tea"]),
      ("Assamese Food", "assamese-food", "Traditional Assamese food products and delicacies", ["Rice & Grains", "Pickles & Chutneys", "Sweets & Snacks", "Pulses & Lentils", "Oils & Ghee"]),
      ("Handloom & Textiles", "handloom-textiles", "Authentic Assamese handloom weaves and textiles", ["Mekhela Chador", "Gamosa", "Silk Sarees", "Stoles & Shawls", "Fabric Rolls"]),
      ("Handicrafts", "handicrafts", "Traditional Assamese handicrafts and artisan works", ["Bamboo Crafts", "Cane Crafts", "Bell Metal", "Pottery", "Wood Crafts"]),
      ("Books & Literature", "books-literature", "Books on Assam, Assamese literature, and culture", ["Assamese Novels", "History & Culture", "Poetry", "Children Books", "Academic"]),
      ("Kitchen & Cookware", "kitchen-cookware", "Traditional Assamese kitchen items and cookware", ["Bell Metal Utensils", "Bamboo Kitchenware", "Clay Pots", "Traditional Vessels", "Accessories"]),
      ("Spices & Herbs", "spices-herbs", "Aromatic Assamese spices, herbs, and condiments", ["Whole Spices", "Ground Spices", "Herb Blends", "Medicinal Herbs", "Chilli Products"]),
      ("Assamese Attire", "assamese-attire", "Traditional and contemporary Assamese clothing", ["Mekhela Chador Sets", "Kurtas & Shirts", "Dhoti & Accessories", "Festival Wear", "Kids Wear"]),
    ];
    var id = nextId;
    for ((name, slug, description, subCats) in seedData.values()) {
      categories.add({
        id;
        name;
        slug;
        description;
        imageUrl = "https://placehold.co/400x300/saffron/white?text=" # name;
        subCategories = subCats;
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
    // Find category IDs by slug
    let findCatId = func(slug : Text) : Nat {
      switch (categories.find<Category>(func(c) = c.slug == slug)) {
        case (?c) c.id;
        case null 1;
      };
    };

    let teaCatId = findCatId("assam-tea");
    let foodCatId = findCatId("assamese-food");
    let handloomCatId = findCatId("handloom-textiles");
    let handicraftCatId = findCatId("handicrafts");
    let booksCatId = findCatId("books-literature");
    let kitchenCatId = findCatId("kitchen-cookware");
    let spicesCatId = findCatId("spices-herbs");
    let attireCatId = findCatId("assamese-attire");

    let now = Time.now();

    let seedProductData : [(Nat, Text, Text, Nat, Nat, [Text], Nat, Text, Nat, Nat, Nat, Text, [Text])] = [
      // (catId, title, description, price, discount, imageUrls, rating, subCategory, reviewCount, stock, id placeholder, brand, tags)
      // --- Assam Tea (6 products) ---
      (teaCatId, "Assam Gold CTC Tea 500g", "Bold, malty CTC tea from Upper Assam estates. Perfect for a strong morning brew.", 29900, 10, ["https://placehold.co/400x400/8B4513/white?text=Assam+Gold+CTC"], 45, "CTC Tea", 1240, 150, 0, "Assam Gold", ["tea", "ctc", "assam", "morning"]),
      (teaCatId, "Halmari Orthodox Whole Leaf Tea 250g", "Award-winning single estate orthodox tea, delicate floral notes.", 74900, 0, ["https://placehold.co/400x400/8B4513/white?text=Halmari+Orthodox"], 49, "Orthodox Tea", 890, 80, 0, "Halmari Estate", ["orthodox", "premium", "single-estate"]),
      (teaCatId, "Kaziranga Green Tea 100g", "Fresh, light green tea from the foothills near Kaziranga. Rich in antioxidants.", 39900, 15, ["https://placehold.co/400x400/228B22/white?text=Kaziranga+Green"], 44, "Green Tea", 560, 200, 0, "Kaziranga Naturals", ["green-tea", "antioxidant", "healthy"]),
      (teaCatId, "Assam White Tea First Flush 50g", "Rare white tea harvested during first flush. Delicate, sweet flavor profile.", 89900, 0, ["https://placehold.co/400x400/F5F5DC/brown?text=White+Tea"], 47, "White Tea", 320, 50, 0, "Upper Assam Estates", ["white-tea", "rare", "first-flush"]),
      (teaCatId, "Brahmaputra Masala Chai Blend 200g", "Traditional Assamese masala chai with local spices. Aromatic and warming.", 24900, 5, ["https://placehold.co/400x400/D2691E/white?text=Masala+Chai"], 43, "Herbal Tea", 780, 300, 0, "Brahmaputra Blends", ["masala-chai", "spiced", "traditional"]),
      (teaCatId, "Dibrugarh Estate CTC Premium 1kg", "Economy pack of premium CTC tea from Dibrugarh estates. Great value.", 54900, 20, ["https://placehold.co/400x400/8B4513/white?text=Dibrugarh+CTC"], 42, "CTC Tea", 2100, 250, 0, "Dibrugarh Tea Co.", ["ctc", "bulk", "economy"]),
      // --- Assamese Food (8 products) ---
      (foodCatId, "Joha Saul (Joha Rice) 2kg", "Aromatic indigenous Joha rice variety, naturally fragrant. GI tagged product.", 32900, 0, ["https://placehold.co/400x400/F5DEB3/brown?text=Joha+Rice"], 48, "Rice & Grains", 1560, 100, 0, "Assam Organic Farms", ["rice", "joha", "aromatic", "GI-tagged"]),
      (foodCatId, "Assamese Khorisa (Bamboo Shoot Pickle) 300g", "Traditional fermented bamboo shoot pickle, tangy and flavorful.", 18900, 0, ["https://placehold.co/400x400/9ACD32/white?text=Khorisa"], 44, "Pickles & Chutneys", 890, 180, 0, "Maa's Kitchen", ["bamboo-shoot", "pickle", "traditional", "fermented"]),
      (foodCatId, "Til Pitha Mix 500g", "Ready mix for Assam's beloved sesame rice cake made during Bihu.", 22900, 10, ["https://placehold.co/400x400/FFD700/brown?text=Til+Pitha"], 46, "Sweets & Snacks", 1200, 120, 0, "Bihu Delights", ["pitha", "sesame", "bihu", "traditional"]),
      (foodCatId, "Black Masoor Dal (Assamese) 1kg", "Earthy, flavourful local masoor dal from Assam's organic farms.", 14900, 0, ["https://placehold.co/400x400/8B0000/white?text=Masoor+Dal"], 42, "Pulses & Lentils", 670, 200, 0, "Brahmaputra Organics", ["dal", "lentil", "organic"]),
      (foodCatId, "Cold-Pressed Mustard Oil (Teel) 1L", "Traditional cold-pressed mustard oil, pungent and aromatic as used in Assamese cooking.", 38900, 5, ["https://placehold.co/400x400/DAA520/white?text=Mustard+Oil"], 45, "Oils & Ghee", 980, 90, 0, "Assam Pure Foods", ["mustard-oil", "cold-pressed", "cooking"]),
      (foodCatId, "Narikolor Ladoo (Coconut Sweet) 12pcs", "Handcrafted Assamese coconut sweets, perfect for festivals and gifts.", 29900, 0, ["https://placehold.co/400x400/F5DEB3/brown?text=Coconut+Ladoo"], 47, "Sweets & Snacks", 540, 60, 0, "Guwahati Sweets", ["coconut", "ladoo", "sweets", "festival"]),
      (foodCatId, "Assam Egg Pickle (Dim Achar) 250g", "Unique spiced egg pickle in mustard oil, a traditional Assamese delicacy.", 24900, 0, ["https://placehold.co/400x400/FFD700/brown?text=Egg+Pickle"], 43, "Pickles & Chutneys", 420, 70, 0, "Maa's Kitchen", ["pickle", "egg", "achar", "spiced"]),
      (foodCatId, "Bora Saul (Glutinous Rice) 1kg", "Sticky glutinous rice used for Assamese pithas and traditional dishes.", 28900, 8, ["https://placehold.co/400x400/F5F5DC/brown?text=Bora+Rice"], 44, "Rice & Grains", 730, 130, 0, "Assam Organic Farms", ["sticky-rice", "glutinous", "pitha"]),
      (foodCatId, "Assamese Lemon Pickle (Guti Nemu Achar) 300g", "Whole baby lemon pickle in traditional Assamese spices.", 17900, 12, ["https://placehold.co/400x400/9ACD32/white?text=Lemon+Pickle"], 45, "Pickles & Chutneys", 880, 150, 0, "Home Harvest", ["lemon-pickle", "achar", "tangy"]),
      // --- Handloom & Textiles (7 products) ---
      (handloomCatId, "Muga Silk Mekhela Chador Set", "Authentic Assam Muga silk Mekhela Chador. GI tagged. Handwoven by local artisans.", 549900, 0, ["https://placehold.co/400x400/DAA520/white?text=Muga+Silk"], 49, "Mekhela Chador", 320, 30, 0, "Sualkuchi Weavers", ["muga-silk", "handwoven", "GI-tagged", "traditional"]),
      (handloomCatId, "Traditional White Gamosa (Assamese Towel)", "Hand-woven cotton Gamosa with red border motifs. Symbol of Assamese culture.", 39900, 0, ["https://placehold.co/400x400/FFFFFF/red?text=Gamosa"], 48, "Gamosa", 1890, 200, 0, "Weave Assam", ["gamosa", "traditional", "cotton", "gift"]),
      (handloomCatId, "Eri Silk Saree with Jaapi Motif", "Lightweight Eri silk saree with traditional Jaapi and elephant motifs.", 289900, 5, ["https://placehold.co/400x400/8B4513/white?text=Eri+Silk"], 47, "Silk Sarees", 180, 25, 0, "Silk Route Assam", ["eri-silk", "saree", "handloom", "motif"]),
      (handloomCatId, "Assamese Cotton Mekhela Chador (Daily Wear)", "Comfortable cotton Mekhela Chador for everyday use. Multiple colour options.", 179900, 10, ["https://placehold.co/400x400/4169E1/white?text=Cotton+Mekhela"], 44, "Mekhela Chador", 560, 80, 0, "Weavers Guild", ["cotton", "mekhela", "daily-wear", "affordable"]),
      (handloomCatId, "Muga Silk Stole with Elephant Motif", "Elegant Muga silk stole featuring traditional Assamese elephant motifs.", 149900, 0, ["https://placehold.co/400x400/DAA520/white?text=Muga+Stole"], 48, "Stoles & Shawls", 430, 50, 0, "Sualkuchi Weavers", ["muga-silk", "stole", "elephant", "gift"]),
      (handloomCatId, "Pat Silk Fabric Roll 2m", "Premium Pat silk fabric roll for custom stitching. Natural golden sheen.", 89900, 0, ["https://placehold.co/400x400/FFD700/brown?text=Pat+Silk"], 46, "Fabric Rolls", 260, 40, 0, "Assam Silk Co.", ["pat-silk", "fabric", "premium"]),
      (handloomCatId, "Handwoven Woollen Shawl (Assam Hills)", "Warm, hand-woven woollen shawl from Assam hill communities.", 149900, 15, ["https://placehold.co/400x400/8B0000/white?text=Woollen+Shawl"], 45, "Stoles & Shawls", 340, 60, 0, "Hill Weavers", ["shawl", "woollen", "warm", "handwoven"]),
      // --- Handicrafts (7 products) ---
      (handicraftCatId, "Jaapi (Traditional Conical Hat) Decorative", "Decorative Assamese Jaapi, symbol of welcome and hospitality. Hand-crafted.", 89900, 0, ["https://placehold.co/400x400/9ACD32/white?text=Jaapi"], 48, "Bamboo Crafts", 1100, 70, 0, "Crafts of Assam", ["jaapi", "traditional", "decor", "handmade"]),
      (handicraftCatId, "Bell Metal Xorai (Ritual Offering Plate)", "Traditional Assam bell metal Xorai for religious ceremonies and decoration.", 149900, 5, ["https://placehold.co/400x400/DAA520/white?text=Xorai"], 49, "Bell Metal", 690, 45, 0, "Sarthebari Craftsmen", ["xorai", "bell-metal", "ritual", "traditional"]),
      (handicraftCatId, "Cane Bamboo Storage Basket Set (3pcs)", "Set of three handmade cane and bamboo storage baskets in different sizes.", 79900, 10, ["https://placehold.co/400x400/D2691E/white?text=Cane+Basket"], 45, "Cane Crafts", 870, 100, 0, "Bamboo Crafts Assam", ["cane", "bamboo", "basket", "storage"]),
      (handicraftCatId, "Dhol (Assamese Traditional Drum) Miniature", "Decorative miniature Dhol, ideal as a showpiece or cultural gift.", 69900, 0, ["https://placehold.co/400x400/8B4513/white?text=Dhol"], 46, "Wood Crafts", 430, 60, 0, "Assam Artisans", ["dhol", "drum", "miniature", "gift"]),
      (handicraftCatId, "Terracotta Elephant Figurine Set (2pcs)", "Hand-painted terracotta elephant pair, traditional Assamese motifs.", 49900, 0, ["https://placehold.co/400x400/CD853F/white?text=Terracotta"], 47, "Pottery", 780, 80, 0, "Dhekiakhowa Pottery", ["terracotta", "elephant", "pottery", "decor"]),
      (handicraftCatId, "Bamboo Photo Frame (Handmade)", "Eco-friendly bamboo photo frame with traditional Assamese carvings.", 29900, 15, ["https://placehold.co/400x400/9ACD32/white?text=Bamboo+Frame"], 44, "Bamboo Crafts", 550, 120, 0, "Green Crafts", ["bamboo", "photo-frame", "eco-friendly", "handmade"]),
      (handicraftCatId, "Bell Metal Bota (Decorative Bowl)", "Exquisitely crafted bell metal Bota, used for offerings and decoration.", 119900, 0, ["https://placehold.co/400x400/DAA520/white?text=Bota"], 48, "Bell Metal", 310, 35, 0, "Sarthebari Craftsmen", ["bell-metal", "bowl", "bota", "handcrafted"]),
      // --- Books & Literature (5 products) ---
      (booksCatId, "Assamese Short Stories Anthology", "Collection of 25 contemporary Assamese short stories translated to English.", 39900, 0, ["https://placehold.co/400x400/1E4D2B/white?text=Short+Stories"], 46, "Assamese Novels", 640, 90, 0, "Sahitya Prakashan", ["assamese", "short-stories", "literature", "translated"]),
      (booksCatId, "History of Assam by Dr. P.C. Choudhury", "Comprehensive history of Assam from ancient Kamarupa to modern times.", 59900, 10, ["https://placehold.co/400x400/1E4D2B/white?text=History+Assam"], 48, "History & Culture", 450, 60, 0, "Bani Prakashan", ["history", "assam", "kamarupa", "academic"]),
      (booksCatId, "Lakshminath Bezbaroa Poetry Collection", "Selected works of the father of Assamese literature, bilingual edition.", 44900, 5, ["https://placehold.co/400x400/1E4D2B/white?text=Bezbaroa"], 49, "Poetry", 380, 75, 0, "Assam Sahitya Sabha", ["poetry", "bezbaroa", "classic", "bilingual"]),
      (booksCatId, "Assamese Folk Tales for Children", "Illustrated collection of traditional Assamese folk tales for young readers.", 29900, 0, ["https://placehold.co/400x400/1E4D2B/white?text=Folk+Tales"], 47, "Children Books", 920, 110, 0, "Prantik Publishers", ["folk-tales", "children", "illustrated", "assamese"]),
      (booksCatId, "Bihu: Culture and Celebration", "Beautiful coffee table book on Assam's Bihu festival with photographs.", 79900, 15, ["https://placehold.co/400x400/1E4D2B/white?text=Bihu+Book"], 47, "History & Culture", 280, 45, 0, "Photo Assam", ["bihu", "festival", "culture", "coffee-table"]),
      // --- Kitchen & Cookware (5 products) ---
      (kitchenCatId, "Bell Metal Thaal (Dinner Plate) Traditional", "Authentic bell metal dinner plate (Thaal) handcrafted in Sarthebari.", 199900, 0, ["https://placehold.co/400x400/DAA520/white?text=Bell+Metal+Thaal"], 48, "Bell Metal Utensils", 520, 40, 0, "Sarthebari Craftsmen", ["bell-metal", "thaal", "plate", "traditional"]),
      (kitchenCatId, "Bamboo Serving Tray Set (2pcs)", "Eco-friendly bamboo serving tray set, practical and stylish.", 49900, 10, ["https://placehold.co/400x400/9ACD32/white?text=Bamboo+Tray"], 44, "Bamboo Kitchenware", 780, 90, 0, "Bamboo Home", ["bamboo", "tray", "serving", "eco-friendly"]),
      (kitchenCatId, "Clay Handi (Earthen Cooking Pot)", "Traditional clay cooking pot for slow-cooking Assamese dishes.", 34900, 0, ["https://placehold.co/400x400/CD853F/white?text=Clay+Handi"], 45, "Clay Pots", 640, 70, 0, "Dhekiakhowa Pottery", ["clay-pot", "handi", "traditional", "earthen"]),
      (kitchenCatId, "Bell Metal Lota (Water Vessel)", "Traditional bell metal water vessel, antimicrobial and beautiful.", 89900, 5, ["https://placehold.co/400x400/DAA520/white?text=Bell+Metal+Lota"], 47, "Traditional Vessels", 360, 55, 0, "Sarthebari Craftsmen", ["bell-metal", "lota", "water", "vessel"]),
      (kitchenCatId, "Bamboo Spoon & Ladle Set (5pcs)", "Natural bamboo cooking utensils set, eco-friendly and durable.", 39900, 20, ["https://placehold.co/400x400/9ACD32/white?text=Bamboo+Spoons"], 43, "Bamboo Kitchenware", 890, 150, 0, "Green Home", ["bamboo", "spoon", "ladle", "eco-friendly"]),
      // --- Spices & Herbs (6 products) ---
      (spicesCatId, "Assam King Chilli (Bhut Jolokia) Powder 50g", "World-famous ghost pepper powder from Assam. Extreme heat, use sparingly!", 34900, 0, ["https://placehold.co/400x400/DC143C/white?text=Bhut+Jolokia"], 47, "Chilli Products", 1890, 200, 0, "Spice Farm Assam", ["bhut-jolokia", "ghost-pepper", "hot", "chilli"]),
      (spicesCatId, "Assamese Panch Phoron Spice Blend 100g", "Traditional five-spice blend used in Assamese and Bengali cooking.", 19900, 0, ["https://placehold.co/400x400/DAA520/white?text=Panch+Phoron"], 46, "Herb Blends", 1100, 180, 0, "Spice Route India", ["panch-phoron", "spice-mix", "blend", "cooking"]),
      (spicesCatId, "Wild Turmeric (Joha Haldi) Powder 200g", "Aromatic wild turmeric unique to Assam, stronger than regular turmeric.", 24900, 5, ["https://placehold.co/400x400/FFD700/brown?text=Wild+Turmeric"], 48, "Ground Spices", 820, 140, 0, "Brahmaputra Spices", ["turmeric", "haldi", "wild", "aromatic"]),
      (spicesCatId, "Mustard Seeds (Black) Assam Organic 250g", "Organically grown black mustard seeds from Assam's fertile plains.", 14900, 0, ["https://placehold.co/400x400/1C1C1C/white?text=Mustard+Seeds"], 45, "Whole Spices", 670, 220, 0, "Organic Assam", ["mustard-seeds", "organic", "black", "spice"]),
      (spicesCatId, "Assamese Bay Leaves (Tej Patta) 50g", "Fragrant bay leaves from Assam's forests, aromatic and flavourful.", 12900, 10, ["https://placehold.co/400x400/228B22/white?text=Bay+Leaves"], 44, "Whole Spices", 560, 300, 0, "Forest Harvest", ["bay-leaves", "tej-patta", "aromatic", "spice"]),
      (spicesCatId, "Bhut Jolokia Pickle (Ghost Pepper Pickle) 200g", "Fiery ghost pepper pickle in mustard oil, an Assamese condiment for the brave.", 28900, 0, ["https://placehold.co/400x400/DC143C/white?text=Bhut+Pickle"], 48, "Chilli Products", 730, 100, 0, "Maa's Kitchen", ["ghost-pepper", "pickle", "spicy", "condiment"]),
      // --- Assamese Attire (8 products) ---
      (attireCatId, "Silk Mekhela Chador for Wedding (Bridal)", "Exquisite bridal Mekhela Chador in Muga and Pat silk. Handwoven, wedding ready.", 899900, 0, ["https://placehold.co/400x400/DAA520/white?text=Bridal+Mekhela"], 49, "Mekhela Chador Sets", 210, 20, 0, "Royal Assam Silks", ["bridal", "wedding", "muga-silk", "traditional"]),
      (attireCatId, "Men's Assamese Dhoti (Cotton, Premium)", "Comfortable premium cotton dhoti for traditional Assamese ceremonies.", 49900, 5, ["https://placehold.co/400x400/FFFFFF/brown?text=Dhoti"], 44, "Dhoti & Accessories", 680, 85, 0, "Assam Garments", ["dhoti", "men", "traditional", "cotton"]),
      (attireCatId, "Assamese Kurta with Jamdani Work (Men)", "Elegant kurta with traditional Jamdani weave pattern, festive wear.", 149900, 10, ["https://placehold.co/400x400/4169E1/white?text=Assamese+Kurta"], 46, "Kurtas & Shirts", 420, 55, 0, "Weave Wear", ["kurta", "jamdani", "men", "festive"]),
      (attireCatId, "Bihu Festival Mekhela Chador (Cotton)", "Vibrant cotton Mekhela Chador ideal for Bihu celebrations.", 219900, 8, ["https://placehold.co/400x400/FF4500/white?text=Bihu+Mekhela"], 47, "Festival Wear", 870, 45, 0, "Festival Fashions", ["bihu", "festival", "cotton", "mekhela"]),
      (attireCatId, "Girls' Mekhela Chador (Kids, 4-12 yrs)", "Adorable handloom Mekhela Chador for girls, perfect for Bihu and puja.", 99900, 0, ["https://placehold.co/400x400/FF69B4/white?text=Kids+Mekhela"], 48, "Kids Wear", 560, 70, 0, "Little Assam", ["kids", "girls", "mekhela", "handloom"]),
      (attireCatId, "Boys' Traditional Dhoti Kurta Set (Kids)", "Traditional dhoti-kurta set for boys for festivals and cultural events.", 89900, 5, ["https://placehold.co/400x400/4169E1/white?text=Boys+Dhoti"], 46, "Kids Wear", 380, 60, 0, "Little Assam", ["kids", "boys", "dhoti-kurta", "traditional"]),
      (attireCatId, "Assamese Gamosa Dupatta (Stole)", "Lightweight gamosa-weave dupatta with red border design, versatile wear.", 59900, 0, ["https://placehold.co/400x400/FFFFFF/red?text=Gamosa+Dupatta"], 45, "Dhoti & Accessories", 490, 90, 0, "Weave Assam", ["gamosa", "dupatta", "stole", "cotton"]),
      (attireCatId, "Ready-to-Wear Stitched Mekhela Chador", "Pre-stitched Mekhela Chador in cotton-silk blend. Easy to wear, modern fit.", 249900, 12, ["https://placehold.co/400x400/8B008B/white?text=Ready+Mekhela"], 45, "Mekhela Chador Sets", 720, 40, 0, "Assam Ready Wear", ["ready-to-wear", "mekhela", "modern", "easy"]),
    ];

    var id = nextProductId;
    for ((catId, title, description, price, discount, imageUrls, rating, subCategory, reviewCount, stock, _, brand, tags) in seedProductData.values()) {
      products.add({
        id;
        title;
        description;
        price;
        discountPercent = discount;
        imageUrls;
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
