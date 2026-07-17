import { Product, Coupon } from '../types';

// Let's define the base categories
export const CATEGORIES = [
  'Fruits', 'Vegetables', 'Dairy', 'Bread', 'Bakery',
  'Rice', 'Atta', 'Flour', 'Pulses', 'Oil', 'Ghee',
  'Tea', 'Coffee', 'Sugar', 'Salt', 'Spices',
  'Snacks', 'Biscuits', 'Chocolates', 'Namkeen',
  'Instant Food', 'Noodles', 'Sauces', 'Cold Drinks',
  'Juices', 'Water', 'Frozen Food', 'Ice Cream',
  'Dry Fruits', 'Personal Care', 'Baby Care',
  'Cleaning Supplies', 'Kitchen Essentials', 'Stationery', 'Pet Care'
];

// Aesthetic curated stock images from Unsplash representing various categories
const CATEGORY_IMAGES: Record<string, string[]> = {
  'Fruits': [
    'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&auto=format&fit=crop&q=80', // Apple
    'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop&q=80', // Banana
    'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400&auto=format&fit=crop&q=80', // Orange
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=80', // Grapes
    'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=400&auto=format&fit=crop&q=80', // Pomegranate
    'https://images.unsplash.com/photo-1569870499705-504209102bd6?w=400&auto=format&fit=crop&q=80', // Kiwi
    'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&auto=format&fit=crop&q=80', // Pineapple
    'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&auto=format&fit=crop&q=80', // Avocado
  ],
  'Vegetables': [
    'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80', // Potatoes
    'https://images.unsplash.com/photo-1508313880080-c4bef0730395?w=400&auto=format&fit=crop&q=80', // Onions
    'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400&auto=format&fit=crop&q=80', // Tomatoes
    'https://images.unsplash.com/photo-1587334206506-6b7c9a208767?w=400&auto=format&fit=crop&q=80', // Garlic
    'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=400&auto=format&fit=crop&q=80', // Ginger
    'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&auto=format&fit=crop&q=80', // Green Chillies
    'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&auto=format&fit=crop&q=80', // Spinach
    'https://images.unsplash.com/photo-1568584711075-3d021a7c3ec3?w=400&auto=format&fit=crop&q=80', // Cauliflower
  ],
  'Dairy': [
    'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80', // Milk
    'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&auto=format&fit=crop&q=80', // Cheese
    'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&auto=format&fit=crop&q=80', // Butter
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&auto=format&fit=crop&q=80', // Yogurt
  ],
  'Bread': [
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80', // Sliced bread
    'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&auto=format&fit=crop&q=80', // Whole grain bread
  ],
  'Bakery': [
    'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format&fit=crop&q=80', // Croissant/Pastry
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop&q=80', // Cake
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&auto=format&fit=crop&q=80', // Donut
  ],
  'Rice': [
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80', // Basmati Rice
  ],
  'Atta': [
    'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=400&auto=format&fit=crop&q=80', // Flour bag
  ],
  'Flour': [
    'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=400&auto=format&fit=crop&q=80', // White powder/flour
  ],
  'Pulses': [
    'https://images.unsplash.com/photo-1585994188554-e0b5030f1df2?w=400&auto=format&fit=crop&q=80', // Lentils
  ],
  'Oil': [
    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80', // Cooking oil
  ],
  'Ghee': [
    'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&auto=format&fit=crop&q=80', // Butter oil/Ghee
  ],
  'Tea': [
    'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=400&auto=format&fit=crop&q=80', // Tea bags / tea leaf
  ],
  'Coffee': [
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&auto=format&fit=crop&q=80', // Coffee beans / cup
  ],
  'Sugar': [
    'https://images.unsplash.com/photo-1581781890040-1110035022aa?w=400&auto=format&fit=crop&q=80', // Sugar crystals
  ],
  'Salt': [
    'https://images.unsplash.com/photo-1604882737321-e6937fd6f519?w=400&auto=format&fit=crop&q=80', // Salt shaker
  ],
  'Spices': [
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80', // Colorful spices
  ],
  'Snacks': [
    'https://images.unsplash.com/photo-1599490659213-e2b9527bb087?w=400&auto=format&fit=crop&q=80', // Potato chips
  ],
  'Biscuits': [
    'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop&q=80', // Cookies
  ],
  'Chocolates': [
    'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&auto=format&fit=crop&q=80', // Chocolate bar
  ],
  'Namkeen': [
    'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=400&auto=format&fit=crop&q=80', // Indian snacks
  ],
  'Instant Food': [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80', // Ready meal
  ],
  'Noodles': [
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop&q=80', // Ramen/Noodles
  ],
  'Sauces': [
    'https://images.unsplash.com/photo-1607305387299-a3d9611cd46f?w=400&auto=format&fit=crop&q=80', // Ketchup/Sauces
  ],
  'Cold Drinks': [
    'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&auto=format&fit=crop&q=80', // Soda cans
  ],
  'Juices': [
    'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&auto=format&fit=crop&q=80', // Fruit juice
  ],
  'Water': [
    'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&auto=format&fit=crop&q=80', // Water bottles
  ],
  'Frozen Food': [
    'https://images.unsplash.com/photo-1578550971616-e5c9f53e028b?w=400&auto=format&fit=crop&q=80', // Frozen peas / fries
  ],
  'Ice Cream': [
    'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&auto=format&fit=crop&q=80', // Ice cream scoop
  ],
  'Dry Fruits': [
    'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=400&auto=format&fit=crop&q=80', // Almonds / nuts
  ],
  'Personal Care': [
    'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&auto=format&fit=crop&q=80', // Soap/Shampoo
  ],
  'Baby Care': [
    'https://images.unsplash.com/photo-1515488042361-404e9250afef?w=400&auto=format&fit=crop&q=80', // Baby toys / care products
  ],
  'Cleaning Supplies': [
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop&q=80', // Detergent/Spray
  ],
  'Kitchen Essentials': [
    'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400&auto=format&fit=crop&q=80', // Sponges/Wrap
  ],
  'Stationery': [
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&auto=format&fit=crop&q=80', // Pens/Notebook
  ],
  'Pet Care': [
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop&q=80', // Dog/Cat food
  ]
};

// Raw definitions for 300+ grocery items with realistic specific details
// We'll map through this list and generate 300+ full high-quality product records programmatically.
const BASE_PRODUCTS_PROFILES: {
  brand: string;
  name: string;
  category: string;
  weight: number;
  unit: string;
  mrp: number;
  sellingPrice: number;
  ingredients?: string;
  nutritionInfo?: Product['nutritionInfo'];
  bestSeller?: boolean;
  featured?: boolean;
  trending?: boolean;
}[] = [
  // Fruits (9 items)
  { brand: 'Daily Fresh', name: 'Premium Royal Gala Apples', category: 'Fruits', weight: 1, unit: 'kg', mrp: 260, sellingPrice: 199, bestSeller: true, featured: true, nutritionInfo: { calories: '52 kcal', protein: '0.3 g', carbs: '14 g', fat: '0.2 g', fiber: '2.4 g' } },
  { brand: 'Daily Fresh', name: 'Fresh Cavendish Bananas', category: 'Fruits', weight: 1, unit: 'kg', mrp: 80, sellingPrice: 59, bestSeller: true, nutritionInfo: { calories: '89 kcal', protein: '1.1 g', carbs: '23 g', fat: '0.3 g', fiber: '2.6 g' } },
  { brand: 'Zespri', name: 'Premium Green Kiwis', category: 'Fruits', weight: 3, unit: 'pcs', mrp: 150, sellingPrice: 119, trending: true, nutritionInfo: { calories: '61 kcal', protein: '1.1 g', carbs: '15 g', fat: '0.5 g', fiber: '3 g' } },
  { brand: 'Daily Fresh', name: 'Sweet Seedless Black Grapes', category: 'Fruits', weight: 500, unit: 'g', mrp: 140, sellingPrice: 99, nutritionInfo: { calories: '67 kcal', protein: '0.6 g', carbs: '17 g', fat: '0.4 g' } },
  { brand: 'Daily Fresh', name: 'Fresh Seedless Pomegranate', category: 'Fruits', weight: 1, unit: 'kg', mrp: 280, sellingPrice: 220, featured: true, nutritionInfo: { calories: '83 kcal', protein: '1.7 g', carbs: '19 g', fat: '1.2 g' } },
  { brand: 'Daily Fresh', name: 'Alphonso Mangoes (Hapus)', category: 'Fruits', weight: 1, unit: 'kg', mrp: 399, sellingPrice: 299, bestSeller: true, nutritionInfo: { calories: '60 kcal', protein: '0.8 g', carbs: '15 g', fat: '0.38 g' } },
  { brand: 'Daily Fresh', name: 'Fresh Papaya Semi Ripe', category: 'Fruits', weight: 1.2, unit: 'kg', mrp: 90, sellingPrice: 69, nutritionInfo: { calories: '43 kcal', protein: '0.5 g', carbs: '11 g' } },
  { brand: 'Daily Fresh', name: 'Sweet Lime (Mosambi)', category: 'Fruits', weight: 1, unit: 'kg', mrp: 120, sellingPrice: 89, nutritionInfo: { calories: '30 kcal', protein: '0.7 g', carbs: '10 g' } },
  { brand: 'Daily Fresh', name: 'Fresh Drinking Coconut', category: 'Fruits', weight: 1, unit: 'pcs', mrp: 75, sellingPrice: 55, bestSeller: true },

  // Vegetables (10 items)
  { brand: 'Daily Fresh', name: 'New Crop Potatoes (Aloo)', category: 'Vegetables', weight: 1, unit: 'kg', mrp: 40, sellingPrice: 28, bestSeller: true },
  { brand: 'Daily Fresh', name: 'Fresh Red Onions (Pyaaz)', category: 'Vegetables', weight: 1, unit: 'kg', mrp: 50, sellingPrice: 34, bestSeller: true },
  { brand: 'Daily Fresh', name: 'Hybrid Tomatoes (Tamatar)', category: 'Vegetables', weight: 1, unit: 'kg', mrp: 60, sellingPrice: 42, bestSeller: true },
  { brand: 'Daily Fresh', name: 'Fresh Garlic (Lahsun)', category: 'Vegetables', weight: 200, unit: 'g', mrp: 90, sellingPrice: 65, trending: true },
  { brand: 'Daily Fresh', name: 'Ginger (Adrak)', category: 'Vegetables', weight: 250, unit: 'g', mrp: 70, sellingPrice: 49, trending: true },
  { brand: 'Daily Fresh', name: 'Fresh Green Chillies', category: 'Vegetables', weight: 100, unit: 'g', mrp: 25, sellingPrice: 15 },
  { brand: 'Daily Fresh', name: 'Fresh Spinach (Palak)', category: 'Vegetables', weight: 250, unit: 'g', mrp: 30, sellingPrice: 19, bestSeller: true },
  { brand: 'Daily Fresh', name: 'Cauliflower (Gobhi)', category: 'Vegetables', weight: 1, unit: 'pcs', mrp: 60, sellingPrice: 39 },
  { brand: 'Daily Fresh', name: 'Fresh Lady Finger (Bhindi)', category: 'Vegetables', weight: 500, unit: 'g', mrp: 45, sellingPrice: 29 },
  { brand: 'Daily Fresh', name: 'Button Mushrooms', category: 'Vegetables', weight: 200, unit: 'g', mrp: 70, sellingPrice: 49, featured: true },

  // Dairy (10 items)
  { brand: 'Amul', name: 'Pasteurised Salted Butter', category: 'Dairy', weight: 500, unit: 'g', mrp: 275, sellingPrice: 265, bestSeller: true, ingredients: 'Butter, Salt', nutritionInfo: { calories: '722 kcal', protein: '0.6 g', carbs: '0 g', fat: '80 g' } },
  { brand: 'Mother Dairy', name: 'Full Cream Milk', category: 'Dairy', weight: 1, unit: 'L', mrp: 68, sellingPrice: 66, bestSeller: true, nutritionInfo: { calories: '60 kcal', protein: '3.2 g', carbs: '4.7 g', fat: '6.0 g' } },
  { brand: 'Amul', name: 'Processed Cheese Slices', category: 'Dairy', weight: 200, unit: 'g', mrp: 145, sellingPrice: 135, trending: true, ingredients: 'Cheese, Milk Solids, Emulsifying Salts', nutritionInfo: { calories: '312 kcal', protein: '20 g', fat: '24 g' } },
  { brand: 'Amul', name: 'Fresh Paneer Block', category: 'Dairy', weight: 200, unit: 'g', mrp: 90, sellingPrice: 85, bestSeller: true, nutritionInfo: { calories: '265 kcal', protein: '18 g', fat: '20 g' } },
  { brand: 'Nestle', name: 'A+ Slim Skimmed Milk', category: 'Dairy', weight: 1, unit: 'L', mrp: 110, sellingPrice: 99, featured: true, nutritionInfo: { calories: '35 kcal', protein: '3.3 g', carbs: '4.8 g', fat: '0.2 g' } },
  { brand: 'Epigamia', name: 'Greek Yogurt Blueberry', category: 'Dairy', weight: 90, unit: 'g', mrp: 65, sellingPrice: 59, trending: true, ingredients: 'Pasteurized Double Toned Milk, Blueberry Fruit Prep, Permitted Starter Cultures', nutritionInfo: { calories: '95 kcal', protein: '6 g', carbs: '12 g' } },
  { brand: 'Yakult', name: 'Probiotic Health Drink', category: 'Dairy', weight: 5, unit: 'packs', mrp: 90, sellingPrice: 85, bestSeller: true, ingredients: 'Water, Skimmed Milk Powder, Glucose, Sucrose, Lactobacillus casei Shirota strain' },
  { brand: 'Amul', name: 'Pure Cow Ghee Tin', category: 'Dairy', weight: 1, unit: 'L', mrp: 720, sellingPrice: 675, featured: true, nutritionInfo: { calories: '897 kcal', fat: '99.7 g' } },
  { brand: 'Nestle', name: 'Milkmaid Condensed Milk', category: 'Dairy', weight: 380, unit: 'g', mrp: 145, sellingPrice: 139 },
  { brand: 'Amul', name: 'Fresh Whipping Cream', category: 'Dairy', weight: 250, unit: 'ml', mrp: 120, sellingPrice: 112 },

  // Bread (5 items)
  { brand: 'Harvest Gold', name: '100% Whole Wheat Brown Bread', category: 'Bread', weight: 400, unit: 'g', mrp: 50, sellingPrice: 42, bestSeller: true },
  { brand: 'English Oven', name: 'Premium Sandwich White Bread', category: 'Bread', weight: 400, unit: 'g', mrp: 45, sellingPrice: 38 },
  { brand: 'Bonn', name: 'Active Heart Multigrain Bread', category: 'Bread', weight: 400, unit: 'g', mrp: 60, sellingPrice: 52, featured: true },
  { brand: 'Wibs', name: 'Classic Table White Bread', category: 'Bread', weight: 400, unit: 'g', mrp: 40, sellingPrice: 38 },
  { brand: 'Daily Fresh', name: 'Fresh Burger Buns Pack of 2', category: 'Bread', weight: 150, unit: 'g', mrp: 30, sellingPrice: 24 },

  // Bakery (7 items)
  { brand: 'Britannia', name: 'Premium Fruit Cake Veg', category: 'Bakery', weight: 120, unit: 'g', mrp: 40, sellingPrice: 35, bestSeller: true },
  { brand: 'Wingreens', name: 'Baked Garlic Crostini', category: 'Bakery', weight: 150, unit: 'g', mrp: 150, sellingPrice: 129, trending: true },
  { brand: 'Daily Fresh', name: 'Fresh Pizza Base Pack of 2', category: 'Bakery', weight: 200, unit: 'g', mrp: 45, sellingPrice: 35 },
  { brand: 'The Baker Dozen', name: 'Sourdough Whole Wheat Bread', category: 'Bakery', weight: 400, unit: 'g', mrp: 120, sellingPrice: 99, featured: true },
  { brand: 'Daily Fresh', name: 'Eggless Butter Croissants (2 Pcs)', category: 'Bakery', weight: 120, unit: 'g', mrp: 110, sellingPrice: 89 },
  { brand: 'Daily Fresh', name: 'Choco Chip Muffins Pack of 2', category: 'Bakery', weight: 150, unit: 'g', mrp: 80, sellingPrice: 65, trending: true },
  { brand: 'Daily Fresh', name: 'Rich Eggless Chocolate Brownie', category: 'Bakery', weight: 100, unit: 'g', mrp: 90, sellingPrice: 75 },

  // Rice (7 items)
  { brand: 'India Gate', name: 'Super Basmati Rice (Aged)', category: 'Rice', weight: 5, unit: 'kg', mrp: 1150, sellingPrice: 899, bestSeller: true, featured: true },
  { brand: 'Daawat', name: 'Rozana Super Basmati Rice', category: 'Rice', weight: 5, unit: 'kg', mrp: 550, sellingPrice: 429, bestSeller: true },
  { brand: 'Fortune', name: 'Everyday Basmati Rice Long Grain', category: 'Rice', weight: 5, unit: 'kg', mrp: 600, sellingPrice: 449 },
  { brand: 'Lal Qilla', name: 'Traditional Old Aged Basmati Rice', category: 'Rice', weight: 1, unit: 'kg', mrp: 260, sellingPrice: 215, featured: true },
  { brand: 'Kohinoor', name: 'Super Silver Authentic Basmati Rice', category: 'Rice', weight: 5, unit: 'kg', mrp: 990, sellingPrice: 799 },
  { brand: 'India Gate', name: 'Mogra Basmati Broken Rice', category: 'Rice', weight: 5, unit: 'kg', mrp: 450, sellingPrice: 349 },
  { brand: 'Organic Tattva', name: 'Organic Brown Basmati Rice', category: 'Rice', weight: 1, unit: 'kg', mrp: 190, sellingPrice: 159, trending: true },

  // Atta (5 items)
  { brand: 'Aashirvaad', name: 'Superior MP Chaki Fresh Atta', category: 'Atta', weight: 10, unit: 'kg', mrp: 520, sellingPrice: 469, bestSeller: true, featured: true },
  { brand: 'Pillsbury', name: 'Chakki Fresh Whole Wheat Atta', category: 'Atta', weight: 10, unit: 'kg', mrp: 510, sellingPrice: 459, bestSeller: true },
  { brand: 'Fortune', name: 'Chakki Fresh Whole Wheat Atta', category: 'Atta', weight: 10, unit: 'kg', mrp: 490, sellingPrice: 429 },
  { brand: 'Aashirvaad', name: 'Multigrain Smart Atta with Oats & Ragi', category: 'Atta', weight: 5, unit: 'kg', mrp: 310, sellingPrice: 275, trending: true },
  { brand: 'Patanjali', name: 'Traditional Sharbati Wheat Atta', category: 'Atta', weight: 5, unit: 'kg', mrp: 260, sellingPrice: 225 },

  // Flour (7 items)
  { brand: 'Rajdhani', name: 'Premium Besan (Gram Flour)', category: 'Flour', weight: 1, unit: 'kg', mrp: 120, sellingPrice: 99, bestSeller: true },
  { brand: 'Rajdhani', name: 'Super Fine Sooji (Semolina)', category: 'Flour', weight: 500, unit: 'g', mrp: 40, sellingPrice: 32 },
  { brand: 'Rajdhani', name: 'Fine Quality Maida (All Purpose Flour)', category: 'Flour', weight: 1, unit: 'kg', mrp: 75, sellingPrice: 59 },
  { brand: 'Organic Tattva', name: 'Organic Ragi (Finger Millet) Flour', category: 'Flour', weight: 500, unit: 'g', mrp: 85, sellingPrice: 69, trending: true },
  { brand: 'Organic Tattva', name: 'Organic Bajra (Pearl Millet) Flour', category: 'Flour', weight: 500, unit: 'g', mrp: 80, sellingPrice: 65 },
  { brand: 'MTR', name: 'Instant Rice Idli Rava', category: 'Flour', weight: 1, unit: 'kg', mrp: 110, sellingPrice: 95 },
  { brand: 'Pillsbury', name: 'Gluten Free Flour Multigrain', category: 'Flour', weight: 1, unit: 'kg', mrp: 180, sellingPrice: 155, featured: true },

  // Pulses (10 items)
  { brand: 'Tata Sampann', name: 'Unpolished Toor Dal (Arhar)', category: 'Pulses', weight: 1, unit: 'kg', mrp: 220, sellingPrice: 185, bestSeller: true, featured: true },
  { brand: 'Tata Sampann', name: 'Unpolished Chana Dal', category: 'Pulses', weight: 1, unit: 'kg', mrp: 130, sellingPrice: 110, bestSeller: true },
  { brand: 'Tata Sampann', name: 'Unpolished Moong Dal Chilka', category: 'Pulses', weight: 1, unit: 'kg', mrp: 180, sellingPrice: 155 },
  { brand: 'Tata Sampann', name: 'Kabuli Chana (White Chickpeas)', category: 'Pulses', weight: 1, unit: 'kg', mrp: 190, sellingPrice: 165, trending: true },
  { brand: 'Organic India', name: 'Organic Kashmiri Rajma (Red Kidney Beans)', category: 'Pulses', weight: 1, unit: 'kg', mrp: 210, sellingPrice: 179, featured: true },
  { brand: 'Tata Sampann', name: 'Unpolished Masoor Dal Lall', category: 'Pulses', weight: 1, unit: 'kg', mrp: 140, sellingPrice: 115 },
  { brand: 'Tata Sampann', name: 'Unpolished Urad Dal Chilka', category: 'Pulses', weight: 1, unit: 'kg', mrp: 175, sellingPrice: 149 },
  { brand: 'Organic Tattva', name: 'Organic Black Matpe (Urad Sabut)', category: 'Pulses', weight: 1, unit: 'kg', mrp: 190, sellingPrice: 162 },
  { brand: 'Tata Sampann', name: 'Premium Lobia (Black Eyed Peas)', category: 'Pulses', weight: 500, unit: 'g', mrp: 95, sellingPrice: 79 },
  { brand: 'Organic India', name: 'Organic Green Moong Whole', category: 'Pulses', weight: 1, unit: 'kg', mrp: 200, sellingPrice: 169 },

  // Oil (8 items)
  { brand: 'Fortune', name: 'Kachi Ghani Mustard Oil Bottle', category: 'Oil', weight: 1, unit: 'L', mrp: 195, sellingPrice: 159, bestSeller: true },
  { brand: 'Fortune', name: 'Soya Health Refined Soyabean Oil', category: 'Oil', weight: 1, unit: 'L', mrp: 165, sellingPrice: 135, bestSeller: true },
  { brand: 'Saffola', name: 'Gold Pro Healthy Rice Bran & Corn Oil', category: 'Oil', weight: 5, unit: 'L', mrp: 950, sellingPrice: 785, featured: true },
  { brand: 'Borges', name: 'Extra Virgin Olive Oil Glass Bottle', category: 'Oil', weight: 1, unit: 'L', mrp: 1400, sellingPrice: 1099, featured: true, trending: true },
  { brand: 'Dhara', name: 'Refined Sunflower Oil Pouch', category: 'Oil', weight: 1, unit: 'L', mrp: 175, sellingPrice: 145 },
  { brand: 'Borges', name: 'Extra Light Olive Oil for Cooking', category: 'Oil', weight: 2, unit: 'L', mrp: 2600, sellingPrice: 1899 },
  { brand: 'Figaro', name: 'Pure Olive Oil Tin', category: 'Oil', weight: 500, unit: 'ml', mrp: 799, sellingPrice: 625 },
  { brand: 'Kl冷', name: 'Cold Pressed Virgin Coconut Oil', category: 'Oil', weight: 500, unit: 'ml', mrp: 350, sellingPrice: 289, trending: true },

  // Ghee (5 items)
  { brand: 'Amul', name: 'Pure Cow Ghee Carton', category: 'Ghee', weight: 1, unit: 'L', mrp: 690, sellingPrice: 665, bestSeller: true },
  { brand: 'Mother Dairy', name: 'Pure Buffalo Ghee Tin', category: 'Ghee', weight: 1, unit: 'L', mrp: 750, sellingPrice: 710, featured: true },
  { brand: 'Patanjali', name: 'Cow Ghee Pure & Natural', category: 'Ghee', weight: 1, unit: 'L', mrp: 680, sellingPrice: 635, bestSeller: true },
  { brand: 'Aashirvaad', name: 'Svasti Ghee Danedar Pure Cow Ghee', category: 'Ghee', weight: 1, unit: 'L', mrp: 710, sellingPrice: 669, trending: true },
  { brand: 'Organic India', name: 'Organic Desi Cow Ghee A2', category: 'Ghee', weight: 500, unit: 'ml', mrp: 999, sellingPrice: 899, featured: true },

  // Tea (6 items)
  { brand: 'Brooke Bond', name: 'Red Label Strong Blend Tea', category: 'Tea', weight: 1, unit: 'kg', mrp: 450, sellingPrice: 389, bestSeller: true },
  { brand: 'Taj Mahal', name: 'Premium Rich CTC Tea Powder', category: 'Tea', weight: 500, unit: 'g', mrp: 310, sellingPrice: 275, featured: true },
  { brand: 'Tata Tea', name: 'Premium Tea Leaves Masala Chai', category: 'Tea', weight: 1, unit: 'kg', mrp: 420, sellingPrice: 349, bestSeller: true },
  { brand: 'Lipton', name: 'Honey Lemon Green Tea Bags (100 Pcs)', category: 'Tea', weight: 100, unit: 'packs', mrp: 499, sellingPrice: 425, trending: true },
  { brand: 'Organic India', name: 'Tulsi Green Tea Classic Antioxidant', category: 'Tea', weight: 25, unit: 'packs', mrp: 195, sellingPrice: 165 },
  { brand: 'Twinings', name: 'English Breakfast Pure Black Tea Bags', category: 'Tea', weight: 25, unit: 'packs', mrp: 350, sellingPrice: 299 },

  // Coffee (6 items)
  { brand: 'Nescafe', name: 'Classic 100% Instant Coffee Jar', category: 'Coffee', weight: 200, unit: 'g', mrp: 420, sellingPrice: 379, bestSeller: true, featured: true },
  { brand: 'Davidoff', name: 'Rich Aroma Fine Ground Coffee Glass Jar', category: 'Coffee', weight: 100, unit: 'g', mrp: 599, sellingPrice: 499, trending: true },
  { brand: 'Bru', name: 'Gold Fine Blend Freeze Dried Coffee', category: 'Coffee', weight: 100, unit: 'g', mrp: 310, sellingPrice: 265, bestSeller: true },
  { brand: 'Nescafe', name: 'Gold Blend Premium Soluble Coffee', category: 'Coffee', weight: 100, unit: 'g', mrp: 399, sellingPrice: 349 },
  { brand: 'Blue Tokai', name: 'Attikan Estate Roasted Coffee Beans', category: 'Coffee', weight: 250, unit: 'g', mrp: 450, sellingPrice: 399, featured: true },
  { brand: 'Country Bean', name: 'Caramel Flavoured Sugar-Free Instant Coffee', category: 'Coffee', weight: 50, unit: 'g', mrp: 325, sellingPrice: 275, trending: true },

  // Sugar (5 items)
  { brand: 'Mawana', name: 'Premium Select White Sugar', category: 'Sugar', weight: 1, unit: 'kg', mrp: 60, sellingPrice: 52, bestSeller: true },
  { brand: 'Organic Tattva', name: 'Organic Brown Jaggery Powder', category: 'Sugar', weight: 500, unit: 'g', mrp: 85, sellingPrice: 69, trending: true },
  { brand: 'Trust', name: 'Sugar Free Stevia Sweetener Natural Table', category: 'Sugar', weight: 100, unit: 'g', mrp: 180, sellingPrice: 149, featured: true },
  { brand: 'Mawana', name: 'Super Fine Sugar Crystals Bag', category: 'Sugar', weight: 5, unit: 'kg', mrp: 280, sellingPrice: 245 },
  { brand: 'Organic Tattva', name: 'Organic Demerara Brown Sugar', category: 'Sugar', weight: 1, unit: 'kg', mrp: 140, sellingPrice: 119 },

  // Salt (5 items)
  { brand: 'Tata', name: 'Salt Iodized Vacuum Evaporated Salt', category: 'Salt', weight: 1, unit: 'kg', mrp: 28, sellingPrice: 26, bestSeller: true },
  { brand: 'Tata', name: 'Salt Lite 15% Low Sodium Salt', category: 'Salt', weight: 1, unit: 'kg', mrp: 45, sellingPrice: 41, trending: true },
  { brand: 'Catch', name: 'Sendha Namak (Rock Salt) Powder', category: 'Salt', weight: 1, unit: 'kg', mrp: 110, sellingPrice: 89, featured: true },
  { brand: 'Catch', name: 'Black Salt Sprinkler Bottle', category: 'Salt', weight: 200, unit: 'g', mrp: 60, sellingPrice: 49 },
  { brand: 'Tata', name: 'Salt SuperLite Low Sodium Hydration', category: 'Salt', weight: 1, unit: 'kg', mrp: 65, sellingPrice: 59 },

  // Spices (8 items)
  { brand: 'MDH', name: 'Deggi Mirch Chili Powder (Medium Hot)', category: 'Spices', weight: 100, unit: 'g', mrp: 85, sellingPrice: 75, bestSeller: true },
  { brand: 'Everest', name: 'Chakki Fresh Turmeric (Haldi) Powder', category: 'Spices', weight: 200, unit: 'g', mrp: 70, sellingPrice: 59, bestSeller: true },
  { brand: 'Everest', name: 'Coriander (Dhania) Spiced Ground Powder', category: 'Spices', weight: 200, unit: 'g', mrp: 68, sellingPrice: 55 },
  { brand: 'MDH', name: 'Super Garam Masala Blend Powder', category: 'Spices', weight: 100, unit: 'g', mrp: 110, sellingPrice: 95, bestSeller: true },
  { brand: 'Catch', name: 'Black Pepper Shaker Sprinkler', category: 'Spices', weight: 100, unit: 'g', mrp: 140, sellingPrice: 119, trending: true },
  { brand: 'Catch', name: 'Cumin (Jeera) Roasted Ground Powder', category: 'Spices', weight: 100, unit: 'g', mrp: 95, sellingPrice: 79 },
  { brand: 'Everest', name: 'Kasuri Methi Dry Fenugreek Leaves', category: 'Spices', weight: 50, unit: 'g', mrp: 45, sellingPrice: 38 },
  { brand: 'Catch', name: 'Compounded Asafoetida (Hing) Powder', category: 'Spices', weight: 50, unit: 'g', mrp: 85, sellingPrice: 72, featured: true },

  // Snacks (8 items)
  { brand: 'Lay\'s', name: 'Spanish Tomato Tango Potato Chips', category: 'Snacks', weight: 115, unit: 'g', mrp: 50, sellingPrice: 45, bestSeller: true },
  { brand: 'Kurkure', name: 'Masala Munch Crunchy Spicy Sticks', category: 'Snacks', weight: 150, unit: 'g', mrp: 40, sellingPrice: 36, bestSeller: true },
  { brand: 'Pringles', name: 'Sour Cream & Onion Potato Crisps', category: 'Snacks', weight: 110, unit: 'g', mrp: 120, sellingPrice: 99, featured: true, trending: true },
  { brand: 'Bingo', name: 'Mad Angles Achari Masti', category: 'Snacks', weight: 130, unit: 'g', mrp: 40, sellingPrice: 35 },
  { brand: 'Doritos', name: 'Nacho Cheese Flavour Tortilla Chips', category: 'Snacks', weight: 150, unit: 'g', mrp: 60, sellingPrice: 52, trending: true },
  { brand: 'Too Yumm', name: 'Multigrain Chips Tomato Veg', category: 'Snacks', weight: 90, unit: 'g', mrp: 40, sellingPrice: 35 },
  { brand: 'ACT II', name: 'Golden Sizzle Butter Microwave Popcorn', category: 'Snacks', weight: 99, unit: 'g', mrp: 55, sellingPrice: 45, bestSeller: true },
  { brand: 'Haldiram\'s', name: 'Premium Roasted Salted Cashews', category: 'Snacks', weight: 100, unit: 'g', mrp: 180, sellingPrice: 159 },

  // Biscuits (7 items)
  { brand: 'Britannia', name: 'Good Day Rich Cashew Butter Cookies', category: 'Biscuits', weight: 200, unit: 'g', mrp: 50, sellingPrice: 42, bestSeller: true },
  { brand: 'Sunfeast', name: 'Dark Fantasy Choco Fills Premium', category: 'Biscuits', weight: 300, unit: 'g', mrp: 150, sellingPrice: 119, featured: true, trending: true },
  { brand: 'Parle', name: 'Parle-G Gold Gluco Biscuits Family Pack', category: 'Biscuits', weight: 500, unit: 'g', mrp: 80, sellingPrice: 72, bestSeller: true },
  { brand: 'Oreo', name: 'Original Vanilla Creme Biscuit MultiPack', category: 'Biscuits', weight: 300, unit: 'g', mrp: 100, sellingPrice: 85 },
  { brand: 'Britannia', name: 'Classic Bourbon Chocolate Cream Biscuits', category: 'Biscuits', weight: 150, unit: 'g', mrp: 40, sellingPrice: 32 },
  { brand: 'McVitie\'s', name: 'Digestive High-Fiber Biscuit Box', category: 'Biscuits', weight: 400, unit: 'g', mrp: 120, sellingPrice: 99, featured: true },
  { brand: 'Unibic', name: 'Choco Chip Soft Oatmeal Cookies', category: 'Biscuits', weight: 150, unit: 'g', mrp: 60, sellingPrice: 49 },

  // Chocolates (7 items)
  { brand: 'Cadbury', name: 'Dairy Milk Silk Chocolate Bar', category: 'Chocolates', weight: 150, unit: 'g', mrp: 180, sellingPrice: 162, bestSeller: true },
  { brand: 'Nestle', name: 'KitKat Multi-Finger Chocolate Bar', category: 'Chocolates', weight: 38, unit: 'g', mrp: 30, sellingPrice: 25, bestSeller: true },
  { brand: 'Ferrero Rocher', name: 'Premium Hazelnut Praline Box of 4', category: 'Chocolates', weight: 50, unit: 'g', mrp: 160, sellingPrice: 145, trending: true, featured: true },
  { brand: 'Snickers', name: 'Peanut Roasted Nougat Chocolate Bar', category: 'Chocolates', weight: 45, unit: 'g', mrp: 50, sellingPrice: 42, bestSeller: true },
  { brand: 'Amul', name: '75% Sugar Free Dark Chocolate Bar', category: 'Chocolates', weight: 150, unit: 'g', mrp: 150, sellingPrice: 135, trending: true },
  { brand: 'Cadbury', name: '5 Star Caramel Chocolate Bar Pack of 5', category: 'Chocolates', weight: 100, unit: 'g', mrp: 50, sellingPrice: 44 },
  { brand: 'Hershey\'s', name: 'Kisses Milk Chocolate Classic Box', category: 'Chocolates', weight: 108, unit: 'g', mrp: 175, sellingPrice: 149, featured: true },

  // Namkeen (6 items)
  { brand: 'Haldiram\'s', name: 'Bikaneri Bhujia Crunchy Sev Namkeen', category: 'Namkeen', weight: 400, unit: 'g', mrp: 110, sellingPrice: 95, bestSeller: true },
  { brand: 'Haldiram\'s', name: 'Spicy Crunchy Aloo Bhujia Potato Sev', category: 'Namkeen', weight: 400, unit: 'g', mrp: 110, sellingPrice: 95, bestSeller: true },
  { brand: 'Haldiram\'s', name: 'Light Fried Moong Dal Salted pulses', category: 'Namkeen', weight: 400, unit: 'g', mrp: 120, sellingPrice: 102 },
  { brand: 'Haldiram\'s', name: 'Panchrattan Royal Dryfruit Mix Namkeen', category: 'Namkeen', weight: 400, unit: 'g', mrp: 175, sellingPrice: 149, featured: true, trending: true },
  { brand: 'Bikaji', name: 'Bikaneri Bhujia Original Crunchy Sev', category: 'Namkeen', weight: 400, unit: 'g', mrp: 105, sellingPrice: 89 },
  { brand: 'Haldiram\'s', name: 'Khatta Meetha Tangy Sweet Savory Mix', category: 'Namkeen', weight: 400, unit: 'g', mrp: 110, sellingPrice: 95, bestSeller: true },

  // Instant Food (5 items)
  { brand: 'MTR', name: 'Ready-to-Eat Gourmet Palak Paneer Bowl', category: 'Instant Food', weight: 300, unit: 'g', mrp: 150, sellingPrice: 129, bestSeller: true },
  { brand: 'Gits', name: 'Instant Gulab Jamun Mix Box (Buy 1 Get 1)', category: 'Instant Food', weight: 200, unit: 'g', mrp: 160, sellingPrice: 145, trending: true },
  { brand: 'ITC Master Chef', name: 'Crispy Frozen Chicken Nuggets Bag', category: 'Instant Food', weight: 500, unit: 'g', mrp: 350, sellingPrice: 285, featured: true },
  { brand: 'Knorr', name: 'Classic Sweet Corn Veg Soup Powder Packet', category: 'Instant Food', weight: 44, unit: 'g', mrp: 60, sellingPrice: 49 },
  { brand: 'Betty Crocker', name: 'Original Fluffy Pancake Buttermilk Mix', category: 'Instant Food', weight: 500, unit: 'g', mrp: 299, sellingPrice: 249, trending: true },

  // Noodles (6 items)
  { brand: 'Maggi', name: '2-Minute Masala Instant Noodles (12-Pack)', category: 'Noodles', weight: 840, unit: 'g', mrp: 196, sellingPrice: 182, bestSeller: true, featured: true },
  { brand: 'Nissin', name: 'Geki Hot Spicy Chicken Cup Noodles', category: 'Noodles', weight: 70, unit: 'g', mrp: 50, sellingPrice: 44, trending: true },
  { brand: 'Ching\'s Secret', name: 'Schezwan Instant Noodles (4-Pack)', category: 'Noodles', weight: 240, unit: 'g', mrp: 70, sellingPrice: 59, bestSeller: true },
  { brand: 'Del Monte', name: 'Premium Durum Wheat Penne Rigate Pasta', category: 'Noodles', weight: 500, unit: 'g', mrp: 180, sellingPrice: 139, featured: true },
  { brand: 'Bambino', name: 'Roasted Vermicelli (Semiya) Wheat Packet', category: 'Noodles', weight: 500, unit: 'g', mrp: 75, sellingPrice: 59 },
  { brand: 'YiPPee!', name: 'Magic Masala Non-Sticky Long Noodles', category: 'Noodles', weight: 360, unit: 'g', mrp: 90, sellingPrice: 79 },

  // Sauces (6 items)
  { brand: 'Kissan', name: 'Fresh Sweet Tomato Ketchup Squeezy Bottle', category: 'Sauces', weight: 950, unit: 'g', mrp: 160, sellingPrice: 135, bestSeller: true },
  { brand: 'Veeba', name: 'Classic Rich Eggless Mayonnaise Jar', category: 'Sauces', weight: 250, unit: 'g', mrp: 99, sellingPrice: 85, bestSeller: true, trending: true },
  { brand: 'Nutella', name: 'Hazelnut & Cocoa Sweet Spread Jar', category: 'Sauces', weight: 350, unit: 'g', mrp: 420, sellingPrice: 389, featured: true, trending: true },
  { brand: 'FunFoods', name: 'Creamy Peanut Butter Crunchy Jar', category: 'Sauces', weight: 400, unit: 'g', mrp: 175, sellingPrice: 145, bestSeller: true },
  { brand: 'Ching\'s Secret', name: 'Schezwan Hot Chutney Dipping Sauce', category: 'Sauces', weight: 250, unit: 'g', mrp: 95, sellingPrice: 79 },
  { brand: 'Heinz', name: 'Yellow Mustard Creamy Squeeze Bottle', category: 'Sauces', weight: 240, unit: 'g', mrp: 199, sellingPrice: 165 },

  // Cold Drinks (8 items)
  { brand: 'Coca-Cola', name: 'Original Sweet Soda Soft Drink Pet Bottle', category: 'Cold Drinks', weight: 2, unit: 'L', mrp: 110, sellingPrice: 95, bestSeller: true },
  { brand: 'Pepsi', name: 'Original Flavor Cola Soda Pet Bottle', category: 'Cold Drinks', weight: 2, unit: 'L', mrp: 110, sellingPrice: 95 },
  { brand: 'Sprite', name: 'Lemon Lime Sparkling Clear Soda Pet', category: 'Cold Drinks', weight: 2, unit: 'L', mrp: 110, sellingPrice: 95, bestSeller: true },
  { brand: 'Thums Up', name: 'Strong Charged Cola Carbonated Pet', category: 'Cold Drinks', weight: 2, unit: 'L', mrp: 110, sellingPrice: 95, bestSeller: true },
  { brand: 'Diet Coke', name: 'Zero Sugar Cola Soda Can', category: 'Cold Drinks', weight: 330, unit: 'ml', mrp: 40, sellingPrice: 36, trending: true },
  { brand: 'Fanta', name: 'Orange Burst Flavored Sparking Soda Pet', category: 'Cold Drinks', weight: 2, unit: 'L', mrp: 110, sellingPrice: 95 },
  { brand: 'Mountain Dew', name: 'Neon Citrus Kick Soda Pet Bottle', category: 'Cold Drinks', weight: 2, unit: 'L', mrp: 110, sellingPrice: 95 },
  { brand: 'Monster Energy', name: 'Green Original Carbonated Energy Can', category: 'Cold Drinks', weight: 350, unit: 'ml', mrp: 125, sellingPrice: 115, featured: true, trending: true },

  // Juices (6 items)
  { brand: 'Real Fruit Power', name: 'Mixed Fruit Pure Juice Nectar Drink', category: 'Juices', weight: 1, unit: 'L', mrp: 130, sellingPrice: 112, bestSeller: true },
  { brand: 'Tropicana', name: '100% Pure Orange Natural Squeezed Juice', category: 'Juices', weight: 1, unit: 'L', mrp: 150, sellingPrice: 129, featured: true },
  { brand: 'Paper Boat', name: 'Sweet Mango Aamras Traditional Drink', category: 'Juices', weight: 1, unit: 'L', mrp: 120, sellingPrice: 99, bestSeller: true, trending: true },
  { brand: 'B Natural', name: 'Fresh Pink Guava Gulp Fruit Beverage', category: 'Juices', weight: 1, unit: 'L', mrp: 120, sellingPrice: 99 },
  { brand: 'Real Fruit Power', name: 'Red Ruby Cranberry Fruit Nectar Drink', category: 'Juices', weight: 1, unit: 'L', mrp: 140, sellingPrice: 119 },
  { brand: 'Raw Pressery', name: '100% Cold Pressed Electrolyte Coconut Water', category: 'Juices', weight: 200, unit: 'ml', mrp: 80, sellingPrice: 65, trending: true },

  // Water (5 items)
  { brand: 'Kinley', name: 'Purified Hydration Mineral Water Bottle', category: 'Water', weight: 1, unit: 'L', mrp: 20, sellingPrice: 18, bestSeller: true },
  { brand: 'Bisleri', name: 'Mineral Water Large Hydration Pet Bottle', category: 'Water', weight: 2, unit: 'L', mrp: 30, sellingPrice: 28, bestSeller: true },
  { brand: 'Vedica', name: 'Natural Spring Water Premium Alkaline Glass', category: 'Water', weight: 750, unit: 'ml', mrp: 80, sellingPrice: 69, featured: true },
  { brand: 'Evian', name: 'Premium Natural Mineral Water Imported Bottle', category: 'Water', weight: 1, unit: 'L', mrp: 150, sellingPrice: 135, featured: true },
  { brand: 'Perrier', name: 'Carbonated Sparkling Mineral Water Can', category: 'Water', weight: 330, unit: 'ml', mrp: 120, sellingPrice: 99, trending: true },

  // Frozen Food (5 items)
  { brand: 'Safal', name: 'Frozen Select Green Peas (No Preservatives)', category: 'Frozen Food', weight: 1, unit: 'kg', mrp: 180, sellingPrice: 149, bestSeller: true },
  { brand: 'McCain', name: 'Frozen Crunchy Potato French Fries Bag', category: 'Frozen Food', weight: 1, unit: 'kg', mrp: 250, sellingPrice: 199, bestSeller: true },
  { brand: 'McCain', name: 'Smiles Frozen Crispy Mashed Potato Shapes', category: 'Frozen Food', weight: 400, unit: 'g', mrp: 150, sellingPrice: 119, trending: true },
  { brand: 'Sumeru', name: 'Frozen Premium Flaky Malabar Parotta', category: 'Frozen Food', weight: 500, unit: 'g', mrp: 110, sellingPrice: 89, featured: true },
  { brand: 'ITC Master Chef', name: 'Frozen Spicy Veggie Burger Sliders Patty', category: 'Frozen Food', weight: 400, unit: 'g', mrp: 190, sellingPrice: 149 },

  // Ice Cream (5 items)
  { brand: 'Amul', name: 'Creamy Vanilla Magic Ice Cream Tub', category: 'Ice Cream', weight: 1, unit: 'L', mrp: 160, sellingPrice: 145, bestSeller: true },
  { brand: 'Kwality Wall\'s', name: 'Double Choco Brownie Fudge Tub', category: 'Ice Cream', weight: 700, unit: 'ml', mrp: 280, sellingPrice: 229, featured: true, trending: true },
  { brand: 'Havmor', name: 'Traditional Kesar Pista Rajwadi Kulfi', category: 'Ice Cream', weight: 100, unit: 'ml', mrp: 40, sellingPrice: 35, bestSeller: true },
  { brand: 'Baskin Robbins', name: 'Mississippi Mud Premium Chocolate Tub', category: 'Ice Cream', weight: 450, unit: 'ml', mrp: 350, sellingPrice: 299, featured: true },
  { brand: 'Kwality Wall\'s', name: 'Cornetto Double Chocolate Ice Cream Cone', category: 'Ice Cream', weight: 120, unit: 'ml', mrp: 50, sellingPrice: 42 },

  // Dry Fruits (6 items)
  { brand: 'Happilo', name: 'Premium California Inshell Almonds Pack', category: 'Dry Fruits', weight: 250, unit: 'g', mrp: 350, sellingPrice: 289, bestSeller: true },
  { brand: 'Happilo', name: 'Premium Whole Cashew Nuts Crispy W320', category: 'Dry Fruits', weight: 250, unit: 'g', mrp: 399, sellingPrice: 319, bestSeller: true },
  { brand: 'Happilo', name: 'Premium Salted & Roasted California Pistachios', category: 'Dry Fruits', weight: 200, unit: 'g', mrp: 320, sellingPrice: 259, trending: true },
  { brand: 'Happilo', name: 'Premium Half Walnut Kernels High Antioxidant', category: 'Dry Fruits', weight: 200, unit: 'g', mrp: 420, sellingPrice: 339, featured: true },
  { brand: 'Happilo', name: 'Sweet Seedless Premium Green Raisins Kishmish', category: 'Dry Fruits', weight: 250, unit: 'g', mrp: 150, sellingPrice: 119 },
  { brand: 'Happilo', name: 'Sun Dried Afghan Anjeer Fig Cordial Pack', category: 'Dry Fruits', weight: 250, unit: 'g', mrp: 450, sellingPrice: 359, trending: true },

  // Personal Care (6 items)
  { brand: 'Dettol', name: 'Original Antiseptic Handwash Liquid Bottle', category: 'Personal Care', weight: 750, unit: 'ml', mrp: 160, sellingPrice: 139, bestSeller: true },
  { brand: 'Dove', name: 'Cream Beauty Bathing Bar (Soap 3-Pack)', category: 'Personal Care', weight: 300, unit: 'g', mrp: 220, sellingPrice: 189, bestSeller: true },
  { brand: 'Head & Shoulders', name: 'Anti-Dandruff Smooth Shampoo Bottle', category: 'Personal Care', weight: 340, unit: 'ml', mrp: 350, sellingPrice: 289, featured: true },
  { brand: 'Colgate', name: 'Strong Teeth Anticavity Fluoride Toothpaste', category: 'Personal Care', weight: 200, unit: 'g', mrp: 120, sellingPrice: 99, bestSeller: true },
  { brand: 'Gillette', name: 'Classic Lemon Shaving Foam Aerosol Can', category: 'Personal Care', weight: 200, unit: 'ml', mrp: 180, sellingPrice: 149 },
  { brand: 'Nivea', name: 'Soft Light Moisturizing Cream Tub', category: 'Personal Care', weight: 200, unit: 'ml', mrp: 299, sellingPrice: 229, trending: true },

  // Baby Care (5 items)
  { brand: 'Pampers', name: 'Active Baby Tape Diapers Large (64 Pcs)', category: 'Baby Care', weight: 64, unit: 'packs', mrp: 1199, sellingPrice: 999, bestSeller: true, featured: true },
  { brand: 'Johnson\'s Baby', name: 'No More Tears Mild Cleansing Shampoo', category: 'Baby Care', weight: 200, unit: 'ml', mrp: 210, sellingPrice: 179 },
  { brand: 'Himalaya Baby', name: 'Gentle Cleansing Wet Baby Wipes (80-Pack)', category: 'Baby Care', weight: 80, unit: 'packs', mrp: 180, sellingPrice: 145, bestSeller: true },
  { brand: 'Nestle', name: 'Cerelac Wheat Apple Cereal with Milk Baby', category: 'Baby Care', weight: 300, unit: 'g', mrp: 260, sellingPrice: 245, trending: true },
  { brand: 'Sebamed Baby', name: 'Ultra-Mild Protection Baby Body Lotion', category: 'Baby Care', weight: 200, unit: 'ml', mrp: 499, sellingPrice: 429, featured: true },

  // Cleaning Supplies (7 items)
  { brand: 'Surf Excel', name: 'Easy Wash Detergent Powder Bucket Pouch', category: 'Cleaning Supplies', weight: 1, unit: 'kg', mrp: 180, sellingPrice: 159, bestSeller: true },
  { brand: 'Vim', name: 'Lemon Power Dishwash Liquid Gel Squeezy', category: 'Cleaning Supplies', weight: 500, unit: 'ml', mrp: 120, sellingPrice: 99, bestSeller: true },
  { brand: 'Lizol', name: 'Pine Disinfectant Floor Cleaner Liquid', category: 'Cleaning Supplies', weight: 1, unit: 'L', mrp: 220, sellingPrice: 185, trending: true },
  { brand: 'Harpic', name: 'Power Plus Original Toilet Cleaner Liquid', category: 'Cleaning Supplies', weight: 1, unit: 'L', mrp: 210, sellingPrice: 179, bestSeller: true },
  { brand: 'Colin', name: 'Glass & Multi Surface Cleaner Spray Bottle', category: 'Cleaning Supplies', weight: 500, unit: 'ml', mrp: 110, sellingPrice: 95 },
  { brand: 'Comfort', name: 'Morning Fresh Fabric Softener Liquid Conditioner', category: 'Cleaning Supplies', weight: 860, unit: 'ml', mrp: 240, sellingPrice: 199, featured: true },
  { brand: 'Ariel', name: 'Matic Front Load Liquid Detergent Squeeze', category: 'Cleaning Supplies', weight: 1, unit: 'L', mrp: 280, sellingPrice: 239, trending: true },

  // Kitchen Essentials (5 items)
  { brand: 'Scotch-Brite', name: 'Heavy Duty Scrub Pad (Buy 3 Get 1)', category: 'Kitchen Essentials', weight: 4, unit: 'pcs', mrp: 60, sellingPrice: 49, bestSeller: true },
  { brand: 'Oddy', name: 'Uniwrap Food Grade Baking Greaseproof Paper', category: 'Kitchen Essentials', weight: 1, unit: 'packs', mrp: 240, sellingPrice: 199, trending: true },
  { brand: 'Daily Clean', name: 'Premium Household Aluminium Kitchen Foil Roll', category: 'Kitchen Essentials', weight: 1, unit: 'packs', mrp: 180, sellingPrice: 145, bestSeller: true },
  { brand: 'Gala', name: 'Cotton Kitchen Slabs Wipe Dusting Clothes', category: 'Kitchen Essentials', weight: 3, unit: 'pcs', mrp: 120, sellingPrice: 89 },
  { brand: 'Godrej Protekt', name: 'Dishwash Soap Gel Concentrated Squeeze', category: 'Kitchen Essentials', weight: 500, unit: 'ml', mrp: 110, sellingPrice: 89 },

  // Stationery (5 items)
  { brand: 'Classmate', name: 'A4 Single Line Ruled Notebook Pack of 6', category: 'Stationery', weight: 6, unit: 'packs', mrp: 360, sellingPrice: 299, bestSeller: true, featured: true },
  { brand: 'Reynolds', name: 'Trimax Liquid Blue Gel Pen Refillable', category: 'Stationery', weight: 3, unit: 'pcs', mrp: 150, sellingPrice: 135, trending: true },
  { brand: 'Camel', name: 'Plastic Wax Crayons Non-Toxic (24 Shades)', category: 'Stationery', weight: 1, unit: 'packs', mrp: 120, sellingPrice: 99 },
  { brand: 'Fevicol', name: 'MR General Purpose Squeezable Glue Tube', category: 'Stationery', weight: 100, unit: 'g', mrp: 50, sellingPrice: 45, bestSeller: true },
  { brand: 'Nataraj', name: '621 Black Writing Lead Pencils Box of 10', category: 'Stationery', weight: 1, unit: 'packs', mrp: 60, sellingPrice: 52 },

  // Pet Care (5 items)
  { brand: 'Pedigree', name: 'Adult Dry Dog Food Chicken & Vegetables', category: 'Pet Care', weight: 3, unit: 'kg', mrp: 850, sellingPrice: 749, bestSeller: true, featured: true },
  { brand: 'Whiskas', name: 'Wet Cat Food Gravy Salmon & Chicken Pouch', category: 'Pet Care', weight: 12, unit: 'packs', mrp: 480, sellingPrice: 419, bestSeller: true },
  { brand: 'Drools', name: 'Premium Chicken & Egg Adult Balanced Kibble', category: 'Pet Care', weight: 3, unit: 'kg', mrp: 799, sellingPrice: 679, trending: true },
  { brand: 'Purepet', name: 'Clumping Lavender Fragrance Bentonite Cat Litter', category: 'Pet Care', weight: 5, unit: 'kg', mrp: 450, sellingPrice: 359 },
  { brand: 'Pedigree', name: 'Dentastix Oral Care Treats Large Dogs (7-Pack)', category: 'Pet Care', weight: 1, unit: 'packs', mrp: 210, sellingPrice: 185, trending: true }
];

// Wait! This base array has 214 profiles. Let's programmatically scale it up to exactly 310 products
// by generating variations of these items with different package sizes (e.g., small, medium, large)
// or slightly different brands/flavors to represent a massive, rich commercial-grade catalog of 300+ items.
export const generateProducts = (): Product[] => {
  const productsList: Product[] = [];
  
  // First, add all the custom base profiles with highly specific data
  BASE_PRODUCTS_PROFILES.forEach((profile, index) => {
    const images = CATEGORY_IMAGES[profile.category] || [];
    const imageToUse = images[index % images.length] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80';
    
    // Auto calculate discount
    const discount = Math.round(((profile.mrp - profile.sellingPrice) / profile.mrp) * 100);
    const id = `prod_${index + 1}`;
    
    const product: Product = {
      id,
      brand: profile.brand,
      name: profile.name,
      category: profile.category,
      images: [imageToUse, 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80'],
      weight: profile.weight,
      unit: profile.unit,
      mrp: profile.mrp,
      sellingPrice: profile.sellingPrice,
      discount,
      sku: `SKU-${profile.category.substring(0,3).toUpperCase()}-${1000 + index}`,
      barcode: `89012345${10000 + index}`,
      stock: Math.floor(Math.random() * 45) + 5, // 5 to 50 in stock
      description: `Premium selected quality ${profile.name} by ${profile.brand}. Sourced responsibly and maintained under pristine temperature conditions to preserve peak freshness and taste. Perfect for daily household needs and cooking. Free from harmful chemicals and artificial ripening processes.`,
      ingredients: profile.ingredients || 'Natural agricultural crop / Single-origin standard edible product. No added preservatives, colors or artificial flavorings.',
      nutritionInfo: profile.nutritionInfo || {
        calories: '110 kcal',
        protein: '2 g',
        carbs: '15 g',
        fat: '0.5 g'
      },
      manufacturer: `${profile.brand} Industries India Private Limited`,
      countryOfOrigin: 'India',
      storageInstructions: profile.category === 'Fruits' || profile.category === 'Vegetables' || profile.category === 'Dairy' || profile.category === 'Frozen Food' || profile.category === 'Ice Cream' 
        ? 'Keep refrigerated. Consume within 3 days of opening.' 
        : 'Store in a cool, dry and hygienic place, away from direct sunlight. Once opened, transfer contents to an airtight container.',
      shelfLife: profile.category === 'Fruits' || profile.category === 'Vegetables' 
        ? '3 - 5 Days' 
        : profile.category === 'Dairy' || profile.category === 'Bread'
          ? '5 - 10 Days'
          : '6 - 12 Months',
      deliveryTime: '10-15 mins',
      rating: +(4.0 + Math.random() * 0.9).toFixed(1), // 4.0 to 4.9 rating
      reviewCount: Math.floor(Math.random() * 1200) + 20,
      bestSeller: !!profile.bestSeller,
      featured: !!profile.featured,
      trending: !!profile.trending,
      returnPolicy: profile.category === 'Fruits' || profile.category === 'Vegetables' || profile.category === 'Dairy' || profile.category === 'Frozen Food' || profile.category === 'Ice Cream' || profile.category === 'Bread' || profile.category === 'Bakery'
        ? 'No-questions-asked return at the time of delivery if not satisfied with freshness.'
        : '7 days returnable if seal is unopened and item is intact.'
    };
    productsList.push(product);
  });

  // Programmatically generate variations to reach 315 products
  // Let's create variations of existing profiles for small/medium pack size options
  let targetVariationCount = 315 - productsList.length;
  let profileIndex = 0;
  
  while (targetVariationCount > 0 && productsList.length < 315) {
    const original = BASE_PRODUCTS_PROFILES[profileIndex % BASE_PRODUCTS_PROFILES.length];
    
    // We create a "Mega Pack" or "Value Pack" or "Small Pack" version
    const isMega = targetVariationCount % 2 === 0;
    const sizeMultiplier = isMega ? 2 : 0.5;
    
    const newWeight = +(original.weight * sizeMultiplier).toFixed(2);
    // Don't make weight 0
    if (newWeight > 0) {
      const sizeLabel = isMega ? 'Value Pack' : 'Mini Pack';
      const name = `${original.name} (${sizeLabel})`;
      const mrp = Math.round(original.mrp * sizeMultiplier * 0.95); // slightly cheaper per unit for bulk
      const sellingPrice = Math.round(original.sellingPrice * sizeMultiplier * 0.92);
      const discount = Math.round(((mrp - sellingPrice) / mrp) * 100);
      const id = `prod_var_${productsList.length + 1}`;
      
      const images = CATEGORY_IMAGES[original.category] || [];
      const imageToUse = images[productsList.length % images.length] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80';

      const varProduct: Product = {
        id,
        brand: original.brand,
        name,
        category: original.category,
        images: [imageToUse, 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80'],
        weight: newWeight,
        unit: original.unit,
        mrp: Math.max(mrp, 15), // ensure at least 15 rs
        sellingPrice: Math.max(sellingPrice, 10),
        discount,
        sku: `SKU-${original.category.substring(0,3).toUpperCase()}-V${2000 + productsList.length}`,
        barcode: `89012345${20000 + productsList.length}`,
        stock: Math.floor(Math.random() * 45) + 5,
        description: `Premium quality ${name} brought to you by ${original.brand}. Curated specifically for your exact volume needs. This ${sizeLabel} provides excellent value, premium quality, and optimal freshness.`,
        ingredients: original.ingredients || 'Standard natural grocery item. Formulated under strict hygiene guidelines.',
        nutritionInfo: original.nutritionInfo || { calories: '95 kcal', protein: '1.5 g', carbs: '12 g', fat: '0.4 g' },
        manufacturer: `${original.brand} Industries India Private Limited`,
        countryOfOrigin: 'India',
        storageInstructions: original.category === 'Fruits' || original.category === 'Vegetables' || original.category === 'Dairy' || original.category === 'Frozen Food' || original.category === 'Ice Cream'
          ? 'Store in a chiller/freezer. Use within 3 days of opening.'
          : 'Keep inside a dry pantry in a closed container.',
        shelfLife: original.category === 'Fruits' || original.category === 'Vegetables' ? '3 Days' : '6 Months',
        deliveryTime: '10-15 mins',
        rating: +(4.0 + Math.random() * 0.8).toFixed(1),
        reviewCount: Math.floor(Math.random() * 300) + 10,
        bestSeller: Math.random() > 0.8,
        featured: false,
        trending: Math.random() > 0.8,
        returnPolicy: original.category === 'Fruits' || original.category === 'Vegetables' || original.category === 'Dairy' || original.category === 'Frozen Food' || original.category === 'Ice Cream' || original.category === 'Bread'
          ? 'No questions asked return at delivery.'
          : '7 days returnable on unopened seal.'
      };
      productsList.push(varProduct);
    }
    profileIndex++;
    targetVariationCount--;
  }

  return productsList;
};

// Static export of the 300+ product catalog
export const PRODUCTS: Product[] = generateProducts();

// Coupon options
export const COUPONS: Coupon[] = [
  { code: 'SUPERGROCERY', discountType: 'percentage', value: 15, minOrderValue: 300, description: 'Get 15% OFF on orders above ₹300 (Max discount ₹100)' },
  { code: 'FIRST50', discountType: 'fixed', value: 50, minOrderValue: 200, description: 'Flat ₹50 OFF on your first purchase above ₹200' },
  { code: 'ZEPTOBASH', discountType: 'percentage', value: 20, minOrderValue: 600, description: 'Save 20% on weekly restocking orders above ₹600' },
  { code: 'FREEDELIVERY', discountType: 'fixed', value: 40, minOrderValue: 400, description: 'Flat ₹40 discount equivalent to free delivery above ₹400' }
];

// FAQS
export const FAQS = [
  { q: 'How fast do you deliver?', a: 'We deliver within 10-15 minutes across most service areas in your city. Our hyper-local delivery partners start packing your fresh basket the second you place your order!' },
  { q: 'What is the minimum order value?', a: 'The minimum order value is ₹100. Orders below ₹100 cannot be checked out to maintain fast, sustainable routing.' },
  { q: 'Are delivery charges applicable?', a: 'Yes, we charge a flat shipping fee of ₹40 on orders below ₹500. For orders of ₹500 and above, shipping is absolutely FREE!' },
  { q: 'How does your fresh return policy work?', a: 'For perishable items like fruits, vegetables, dairy, or frozen items, we offer a "no-questions-asked" refund or replacement right at the time of delivery if you are unsatisfied with the quality. Other packaged items can be returned within 7 days if they remain unopened.' },
  { q: 'Can I track my delivery in real-time?', a: 'Yes! Once your order is confirmed, you can track the status from your Dashboard, moving smoothly from Ordered, Packed, Out for Delivery, and Delivered with estimated times.' }
];
