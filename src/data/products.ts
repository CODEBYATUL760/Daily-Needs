import { Product, Review, Coupon } from "../types";

// Category list as requested
export const CATEGORIES = [
  "Rice",
  "Atta",
  "Pulses",
  "Oils",
  "Spices",
  "Tea",
  "Coffee",
  "Sugar",
  "Salt",
  "Snacks",
  "Chocolates",
  "Beverages",
  "Frozen Food",
  "Dry Fruits",
  "Personal Care",
  "Baby Care",
  "Cleaning Supplies",
  "Kitchen Essentials",
  "Pet Care",
  "Stationery",
];

// Helper to get beautiful Unsplash image URLs based on category
const CATEGORY_IMAGES: Record<string, string[]> = {
  Rice: [
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1536304997881-a372c179924b?auto=format&fit=crop&q=80&w=600"
  ],
  Atta: [
    "https://images.unsplash.com/photo-1574325131876-a79999773303?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600"
  ],
  Pulses: [
    "https://images.unsplash.com/photo-1585998080726-4a554d8210a8?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600"
  ],
  Oils: [
    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1542317148-8b4df560737a?auto=format&fit=crop&q=80&w=600"
  ],
  Spices: [
    "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&q=80&w=600"
  ],
  Tea: [
    "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=600"
  ],
  Coffee: [
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600"
  ],
  Sugar: [
    "https://images.unsplash.com/photo-1581781870027-04212e231e96?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1534080391025-a77b3b3a62f2?auto=format&fit=crop&q=80&w=600"
  ],
  Salt: [
    "https://images.unsplash.com/photo-1604836222482-f52174007980?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1618038483079-bfe64dcb17f1?auto=format&fit=crop&q=80&w=600"
  ],
  Snacks: [
    "https://images.unsplash.com/photo-1599490659213-e2b9527bb087?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=600"
  ],
  Chocolates: [
    "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1549007994-cb92ca81ee17?auto=format&fit=crop&q=80&w=600"
  ],
  Beverages: [
    "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=600"
  ],
  "Frozen Food": [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=600"
  ],
  "Dry Fruits": [
    "https://images.unsplash.com/photo-1595124253360-210952f7f13b?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1606923829579-0ac984c55d03?auto=format&fit=crop&q=80&w=600"
  ],
  "Personal Care": [
    "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=600"
  ],
  "Baby Care": [
    "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&q=80&w=600"
  ],
  "Cleaning Supplies": [
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=600"
  ],
  "Kitchen Essentials": [
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=600"
  ],
  "Pet Care": [
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&q=80&w=600"
  ],
  Stationery: [
    "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600"
  ],
};

const DUMMY_REVIEW_AUTHORS = [
  "Amit Sharma", "Priya Patel", "Suresh Kumar", "Anjali Gupta", "Rohan Mehta",
  "Sneha Reddy", "Vikram Singh", "Deepika Rao", "Abhishek Nair", "Meera Joshi",
  "Pooja Verma", "Karan Malhotra", "Nisha Saxena", "Siddharth Jain", "Rahul Roy"
];

const DUMMY_REVIEW_COMMENTS = [
  "Excellent quality, fresh and well packaged. Best price on Daily Needs!",
  "Highly recommended. Authentic taste and very fast delivery.",
  "Super convenient packaging. Daily Needs always delivers on time.",
  "Very clean and good brand. Best for daily consumption.",
  "Really premium product. Got a good discount on this purchase.",
  "Value for money. Stock is always fresh and genuine.",
  "Quality is very consistent. Will definitely order again.",
  "Satisfied with this purchase. Prompt 30 mins delivery."
];

// Base product seeds for the 20 categories
const SEED_DATA: {
  category: string;
  brand: string;
  name: string;
  description: string;
  basePrice: number; // MRP
  unitTemplates: string[]; // list of sizes
}[] = [
  // 1. Rice
  {
    category: "Rice",
    brand: "India Gate",
    name: "Classic Basmati Rice",
    description: "Fluffy, long-grain basmati rice with exotic aroma and sweet flavor. Perfect for biryanis, pulao, and everyday premium meals.",
    basePrice: 160,
    unitTemplates: ["1 kg", "5 kg", "10 kg"],
  },
  {
    category: "Rice",
    brand: "Daawat",
    name: "Rozana Super Basmati",
    description: "High quality aromatic basmati rice broken slightly for everyday consumption. Smooth texture and non-sticky.",
    basePrice: 110,
    unitTemplates: ["1 kg", "5 kg"],
  },
  // 2. Atta
  {
    category: "Atta",
    brand: "Aashirvaad",
    name: "Shudh Chakki Atta",
    description: "100% pure whole wheat flour processed with traditional chakki technology to retain natural nutrients and dietary fibers.",
    basePrice: 60,
    unitTemplates: ["1 kg", "5 kg", "10 kg"],
  },
  {
    category: "Atta",
    brand: "Pillsbury",
    name: "Chakki Fresh Atta",
    description: "Made from selected high-quality premium wheat grains for incredibly soft and nutritious rotis that stay soft for hours.",
    basePrice: 62,
    unitTemplates: ["5 kg", "10 kg"],
  },
  // 3. Pulses
  {
    category: "Pulses",
    brand: "Tata Sampann",
    name: "Unpolished Toor Dal (Arhar)",
    description: "Rich source of protein, processed under extremely hygienic conditions. Unpolished to retain natural goodness and taste.",
    basePrice: 180,
    unitTemplates: ["500 g", "1 kg"],
  },
  {
    category: "Pulses",
    brand: "Organic Tattva",
    name: "Organic Moong Dal Yellow",
    description: "Certified organic split moong bean without any synthetic pesticides. Extremely light on stomach and rich in nutrition.",
    basePrice: 195,
    unitTemplates: ["500 g", "1 kg"],
  },
  {
    category: "Pulses",
    brand: "Tata Sampann",
    name: "Chana Dal Premium",
    description: "Delicious protein-rich premium split chickpeas, sweet in flavor and rich in dietary fibers.",
    basePrice: 110,
    unitTemplates: ["500 g", "1 kg"],
  },
  // 4. Oils
  {
    category: "Oils",
    brand: "Fortune",
    name: "Soya Health Refined Oil",
    description: "Fortified with Vitamins A and D. Extremely light refined soyabean oil ideal for all types of Indian cooking and frying.",
    basePrice: 145,
    unitTemplates: ["1 L", "5 L"],
  },
  {
    category: "Oils",
    brand: "Saffola",
    name: "Gold Pro Healthy Lifestyle Oil",
    description: "Physically refined rice bran oil mixed with safflower oil, loaded with natural antioxidants like Oryzanol to care for your heart.",
    basePrice: 195,
    unitTemplates: ["1 L", "5 L"],
  },
  {
    category: "Oils",
    brand: "Dhara",
    name: "Kachi Ghani Mustard Oil",
    description: "Cold-pressed pure mustard oil with sharp pungent aroma and taste. Naturally rich in Omega-3 fatty acids for robust health.",
    basePrice: 175,
    unitTemplates: ["1 L"],
  },
  // 5. Spices
  {
    category: "Spices",
    brand: "Everest",
    name: "Tikhalal Chili Powder",
    description: "Fine-ground chili powder with brilliant deep red color and strong hot flavor. Sourced from the finest chili fields of Guntur.",
    basePrice: 85,
    unitTemplates: ["100 g", "200 g", "500 g"],
  },
  {
    category: "Spices",
    brand: "Catch",
    name: "Turmeric Powder (Haldi)",
    description: "Sourced from Salem, high in Curcumin content which acts as a powerful anti-inflammatory and natural antioxidant.",
    basePrice: 40,
    unitTemplates: ["100 g", "200 g", "500 g"],
  },
  {
    category: "Spices",
    brand: "MDH",
    name: "Garam Masala Saboot",
    description: "Traditional aromatic blend of spices like cardamom, black pepper, cloves, and cinnamon to add rich flavor to curries.",
    basePrice: 95,
    unitTemplates: ["100 g"],
  },
  // 6. Tea
  {
    category: "Tea",
    brand: "Red Label",
    name: "Brooke Bond Tea Premium",
    description: "Carefully selected tea leaves from Assam that offer perfect strength, authentic flavor, and heartwarming rich color.",
    basePrice: 160,
    unitTemplates: ["250 g", "500 g", "1 kg"],
  },
  {
    category: "Tea",
    brand: "Tata Tea",
    name: "Gold Premium Assam Tea",
    description: "Gently rolled premium tea leaves blended with 15% long leaves that open up to release rich aroma and exquisite taste.",
    basePrice: 185,
    unitTemplates: ["500 g", "1 kg"],
  },
  // 7. Coffee
  {
    category: "Coffee",
    brand: "Nescafe",
    name: "Classic Instant Coffee",
    description: "100% pure premium coffee beans, double-filter processed to deliver a rich, fresh, and deeply invigorating coffee experience.",
    basePrice: 170,
    unitTemplates: ["50 g", "100 g", "200 g"],
  },
  {
    category: "Coffee",
    brand: "Bru",
    name: "Gold Instant Coffee",
    description: "An authentic, aromatic blend of Robusta and Arabica coffee beans carefully roasted to perfection.",
    basePrice: 140,
    unitTemplates: ["100 g", "200 g"],
  },
  // 8. Sugar
  {
    category: "Sugar",
    brand: "Madhur",
    name: "Pure Sulphur-Free Sugar",
    description: "Untouched by hand, clean crystalline sweet sugar extracted from high quality sugarcane without harmful sulphur processing.",
    basePrice: 55,
    unitTemplates: ["1 kg", "5 kg"],
  },
  // 9. Salt
  {
    category: "Salt",
    brand: "Tata",
    name: "Iodised Vacuum Evaporated Salt",
    description: "India's trustworthy salt with vital iodine that aids healthy mental development in kids. Vacuum purified for superior quality.",
    basePrice: 28,
    unitTemplates: ["1 kg"],
  },
  {
    category: "Salt",
    brand: "Tata",
    name: "Rock Salt (Sendha Namak)",
    description: "Crushed naturally from premium Himalayan rock salt. Rich in natural trace minerals and pure, unprocessed taste.",
    basePrice: 85,
    unitTemplates: ["1 kg"],
  },
  // 10. Snacks
  {
    category: "Snacks",
    brand: "Haldiram's",
    name: "Aloo Bhujia Spicy",
    description: "Crispy and spicy potato noodles seasoned with mint, lime, and rich Indian spices. A timeless classic tea-time snack.",
    basePrice: 45,
    unitTemplates: ["150 g", "400 g", "1 kg"],
  },
  {
    category: "Snacks",
    brand: "Lay's",
    name: "Classic Salted Potato Chips",
    description: "Finest quality potatoes sliced wafer-thin, lightly sprinkled with salt, and cooked to a golden crispy crunch.",
    basePrice: 20,
    unitTemplates: ["50 g", "95 g"],
  },
  {
    category: "Snacks",
    brand: "Parle",
    name: "Parle-G Gold Biscuits",
    description: "Bigger, richer, and crunchier version of the classic Parle-G biscuits packed with the natural goodness of milk and wheat.",
    basePrice: 15,
    unitTemplates: ["100 g", "250 g"],
  },
  // 11. Chocolates
  {
    category: "Chocolates",
    brand: "Cadbury",
    name: "Dairy Milk Silk",
    description: "Rich, smooth, and creamy milk chocolate bar that melts in your mouth for an ultimate luxurious chocolate experience.",
    basePrice: 80,
    unitTemplates: ["60 g", "150 g"],
  },
  {
    category: "Chocolates",
    brand: "Amul",
    name: "Dark Chocolate 75% Cocoa",
    description: "Rich dark chocolate with premium single-origin bitter cocoa. Perfectly rich taste crafted for cocoa lovers.",
    basePrice: 110,
    unitTemplates: ["150 g"],
  },
  // 12. Beverages
  {
    category: "Beverages",
    brand: "Coca-Cola",
    name: "Original Cola Soft Drink",
    description: "Crisp and refreshing cold carbonated soft drink that brings moments of happiness to your family and friends.",
    basePrice: 40,
    unitTemplates: ["250 ml", "750 ml", "1.25 L", "2 L"],
  },
  {
    category: "Beverages",
    brand: "Real",
    name: "Activ 100% Orange Juice",
    description: "100% squeezed pure orange juice with zero added sugars or synthetic preservatives. Rich in immunity-boosting Vitamin C.",
    basePrice: 125,
    unitTemplates: ["1 L"],
  },
  {
    category: "Beverages",
    brand: "Amul",
    name: "Taaza Fresh Milk",
    description: "Homogenized toned fresh milk with long shelf life, perfect for healthy breakfast cereals, tea, and baking.",
    basePrice: 32,
    unitTemplates: ["500 ml", "1 L"],
  },
  // 13. Frozen Food
  {
    category: "Frozen Food",
    brand: "McCain",
    name: "French Fries Classic",
    description: "Ready-to-fry premium frozen potato strips, golden crisp on the outside and wonderfully fluffy on the inside.",
    basePrice: 150,
    unitTemplates: ["450 g", "1.25 kg"],
  },
  {
    category: "Frozen Food",
    brand: "Amul",
    name: "Premium Frozen Green Peas",
    description: "Sweet green peas instantly frozen at optimal freshness to preserve sweet taste, bright color, and high dietary value.",
    basePrice: 120,
    unitTemplates: ["500 g", "1 kg"],
  },
  // 14. Dry Fruits
  {
    category: "Dry Fruits",
    brand: "Happilo",
    name: "Premium California Almonds",
    description: "Selected handpicked sweet, crisp, and nutrient-dense raw almonds. Loaded with fiber, vitamins, and minerals.",
    basePrice: 350,
    unitTemplates: ["200 g", "500 g"],
  },
  {
    category: "Dry Fruits",
    brand: "Happilo",
    name: "Premium Cashew Nuts (Kaju)",
    description: "Rich creamy Cashews, handpicked and vacuum-packed to preserve crunchiness and delightful nutty flavor.",
    basePrice: 380,
    unitTemplates: ["200 g", "500 g"],
  },
  // 15. Personal Care
  {
    category: "Personal Care",
    brand: "Dove",
    name: "Intense Repair Shampoo",
    description: "Formulated with Keratin Actives to continuously nourish and repair damaged hair structure from root to tip.",
    basePrice: 180,
    unitTemplates: ["180 ml", "340 ml", "650 ml"],
  },
  {
    category: "Personal Care",
    brand: "Dettol",
    name: "Liquid Handwash Original",
    description: "Trusted germ protection formula that prevents illnesses, leaving hands highly clean and gently moisturized.",
    basePrice: 99,
    unitTemplates: ["200 ml", "750 ml", "1.5 L"],
  },
  {
    category: "Personal Care",
    brand: "Colgate",
    name: "MaxFresh Spicy Fresh Gel",
    description: "Packed with cooling crystals that dissolve instantly as you brush, providing an intense wave of refreshing freshness.",
    basePrice: 95,
    unitTemplates: ["150 g", "300 g"],
  },
  // 16. Baby Care
  {
    category: "Baby Care",
    brand: "Pampers",
    name: "All-Round Baby Diapers Pants",
    description: "With magic gel channels that provide up to 12 hours of dry lock protection. Made of breathable soft cotton.",
    basePrice: 450,
    unitTemplates: ["Pack of 28", "Pack of 54", "Pack of 86"],
  },
  {
    category: "Baby Care",
    brand: "Himalaya Baby",
    name: "Gentle Baby Wipes",
    description: "Infused with Lotus and Aloe Vera to soothe, protect, and moisturize baby's delicate skin while maintaining normal pH.",
    basePrice: 120,
    unitTemplates: ["Pack of 72"],
  },
  // 17. Cleaning Supplies
  {
    category: "Cleaning Supplies",
    brand: "Surf Excel",
    name: "Easy Wash Detergent Powder",
    description: "With engineered power of blue oxygen clean technology that quickly dissolves inside water to erase severe spots easily.",
    basePrice: 140,
    unitTemplates: ["1 kg", "3 kg", "5 kg"],
  },
  {
    category: "Cleaning Supplies",
    brand: "Vim",
    name: "Dishwash Gel Lemon",
    description: "Powerful degreasing gel with pure active lemons that cleans grease from multiple utensils with just one spoonful.",
    basePrice: 105,
    unitTemplates: ["250 ml", "500 ml", "1 L"],
  },
  {
    category: "Cleaning Supplies",
    brand: "Lizol",
    name: "Disinfectant Floor Cleaner",
    description: "Kills 99.9% of germs, removes tough stains, and leaves a pleasant citrus fragrance. Safe for all floor types.",
    basePrice: 120,
    unitTemplates: ["500 ml", "1 L"],
  },
  // 18. Kitchen Essentials
  {
    category: "Kitchen Essentials",
    brand: "Daily Needs",
    name: "Stainless Steel Fork & Spoon Set",
    description: "Made from premium heavy-gauge food-grade stainless steel with polished mirror finish. Sleek, comfortable design.",
    basePrice: 299,
    unitTemplates: ["Set of 6", "Set of 12"],
  },
  {
    category: "Kitchen Essentials",
    brand: "Pigeon",
    name: "Non-Stick Aluminium Tawa",
    description: "With high quality triple-layer German stone non-stick coating. Induction-compatible base, sturdy heatproof handle.",
    basePrice: 650,
    unitTemplates: ["250 mm", "280 mm"],
  },
  // 19. Pet Care
  {
    category: "Pet Care",
    brand: "Pedigree",
    name: "Dry Dog Food Chicken & Vegetables",
    description: "Complete and balanced dog nutrition that supports gut health, immune system, skin health, and strong bones and teeth.",
    basePrice: 320,
    unitTemplates: ["1.2 kg", "3 kg", "10 kg"],
  },
  {
    category: "Pet Care",
    brand: "Whiskas",
    name: "Dry Cat Food Ocean Fish",
    description: "Delightful crunchy kibble enriched with essential nutrients, high quality protein, and vitamin A for eye vision health.",
    basePrice: 240,
    unitTemplates: ["1.1 kg", "3 kg"],
  },
  // 20. Stationery
  {
    category: "Stationery",
    brand: "Classmate",
    name: "Spiral Notebook Single Line",
    description: "High quality eco-friendly chlorine-free pages with smooth finish. Sturdy multi-subject spiral wire binding.",
    basePrice: 85,
    unitTemplates: ["160 Pages", "300 Pages"],
  },
  {
    category: "Stationery",
    brand: "Reynolds",
    name: "Gel Pen Super-Fluid Blue",
    description: "Retractable gel ink pen with smudge-free fluid ink that writes smoothly and quickly. Soft textured comfort grip.",
    basePrice: 60,
    unitTemplates: ["Pack of 5", "Pack of 10"],
  },
];

// Generate exactly 260 products procedurally (to fulfill the 250+ products requirement elegantly)
export function generateProducts(): Product[] {
  const products: Product[] = [];
  let currentId = 1;

  // Let's loop until we have exactly 260 products
  // We will distribute them across categories
  let seedIndex = 0;

  while (products.length < 265) {
    const seed = SEED_DATA[seedIndex % SEED_DATA.length];
    
    // We can generate variations by choosing a unitTemplate
    // and also adding some minor suffixes if we run this seed multiple times
    const iteration = Math.floor(seedIndex / SEED_DATA.length);
    const unitIndex = iteration % seed.unitTemplates.length;
    const unit = seed.unitTemplates[unitIndex];

    // Determine brand, category, names, price
    let name = seed.name;
    let brand = seed.brand;
    let category = seed.category;
    let basePrice = seed.basePrice;
    let desc = seed.description;

    // Mutate parameters slightly to create unique products per variation
    if (iteration > 0) {
      if (iteration === 1) {
        name = `${name} (Premium Value Pack)`;
        basePrice = Math.round(basePrice * 1.8);
      } else if (iteration === 2) {
        name = `${name} (Super Saver Deal)`;
        basePrice = Math.round(basePrice * 2.5);
      } else if (iteration === 3) {
        name = `${name} (Diet / Sugar-Free Special)`;
        basePrice = Math.round(basePrice * 1.15);
      } else {
        name = `${name} (Family Pack)`;
        basePrice = Math.round(basePrice * 3.6);
      }
    }

    // Include the size in the name if appropriate
    const finalName = `${name} - ${unit}`;

    // Get images for the category
    const catImages = CATEGORY_IMAGES[category] || [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600"
    ];
    // Rotate images if multiple exist
    const selectedImages = [
      catImages[iteration % catImages.length],
      catImages[(iteration + 1) % catImages.length],
    ];

    // Create realistic discount (between 5% and 40%)
    const discount = Math.round(5 + ((currentId * 7) % 31)); // deterministic discount
    const mrp = basePrice;
    const sellingPrice = Math.max(10, Math.round(mrp * (1 - discount / 100)));

    // Create structured mock reviews
    const reviews: Review[] = [];
    const reviewsCount = 3 + (currentId % 6);
    let totalRatingSum = 0;

    for (let r = 0; r < reviewsCount; r++) {
      const author = DUMMY_REVIEW_AUTHORS[(currentId + r) % DUMMY_REVIEW_AUTHORS.length];
      const comment = DUMMY_REVIEW_COMMENTS[(currentId * 3 + r) % DUMMY_REVIEW_COMMENTS.length];
      const ratingVal = 4 + (r % 2); // mostly 4s and 5s for premium store
      totalRatingSum += ratingVal;

      reviews.push({
        id: `rev-${currentId}-${r}`,
        userName: author,
        rating: ratingVal,
        comment: comment,
        date: new Date(2026, 6, 17 - (r % 10)).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      });
    }

    const averageRating = parseFloat((totalRatingSum / reviewsCount).toFixed(1));

    products.push({
      id: `prod-${currentId}`,
      name: finalName,
      brand: brand,
      category: category,
      images: selectedImages,
      description: desc,
      unit: unit,
      stock: 10 + (currentId % 90), // stock between 10 and 100
      sku: `DN-${category.substring(0,3).toUpperCase()}-${1000 + currentId}`,
      mrp: mrp,
      sellingPrice: sellingPrice,
      discount: discount,
      rating: averageRating,
      reviews: reviews,
      deliveryTime: currentId % 3 === 0 ? "15-30 Mins" : currentId % 3 === 1 ? "20-45 Mins" : "30-50 Mins",
      bestseller: currentId % 11 === 0 || currentId % 17 === 0,
      trending: currentId % 7 === 0 || currentId % 13 === 0,
      featured: currentId % 9 === 0 || currentId % 15 === 0,
      returnPolicy: currentId % 2 === 0 ? "7 Days Return Policy" : "No Returns - Quality Guaranteed",
    });

    currentId++;
    seedIndex++;
  }

  return products;
}

// Single initialized array of all 260+ products
export const ALL_PRODUCTS = generateProducts();

// Coupon codes list
export const ACTIVE_COUPONS: Coupon[] = [
  {
    code: "DAILY10",
    discountType: "percentage",
    value: 10,
    minOrderValue: 1200,
    description: "Get 10% OFF on orders above ₹1,200 (Max discount ₹300)",
  },
  {
    code: "SUPERNEEDS",
    discountType: "fixed",
    value: 200,
    minOrderValue: 2500,
    description: "Flat ₹200 OFF on orders above ₹2,500",
  },
  {
    code: "FREESHIP",
    discountType: "fixed",
    value: 100,
    minOrderValue: 1500,
    description: "Save ₹100 flat discount on orders above ₹1,500",
  },
  {
    code: "WELCOME50",
    discountType: "percentage",
    value: 15,
    minOrderValue: 1000,
    description: "Special 15% OFF for our premium users on orders above ₹1,000",
  }
];
