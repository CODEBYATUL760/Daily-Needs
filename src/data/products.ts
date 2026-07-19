/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Daily Needs Kirana Store Product Database
 * Sourced for local Indian households (Connaught Place, New Delhi)
 */

import { Product } from '../types';
import { cat1_3 } from './products/cat1_3';
import { cat4_6 } from './products/cat4_6';
import { cat7_9 } from './products/cat7_9';
import { cat10_12 } from './products/cat10_12';
import { cat13_15 } from './products/cat13_15';

// Unsplash high quality food & grocery image IDs mapped to Kirana categories
const imagePool: Record<string, string[]> = {
  'Atta, Flour & Grains': [
    'photo-1586201375761-83865001e31c', // Flour/Wheat
    'photo-1596484552834-6a58f850e0a1', // Rice
    'photo-1607349913338-fca6f7fc42d0', // Pulses / Lentils
  ],
  'Cooking Oils & Ghee': [
    'photo-1474979266404-7eaacbcd87c5', // Cooking Oil
    'photo-1628088062854-d1870b4553da', // Clarified Butter/Ghee
  ],
  'Spices, Salt & Sugar': [
    'photo-1626132647523-66f5bf380027', // Salt & Spices
    'photo-1596003906949-67221c37965c', // Spices whole
  ],
  'Dry Fruits, Seeds & Nuts': [
    'photo-1596003906949-67221c37965c', // Nuts
    'photo-1514733670139-4d87a19ec157', // Raisins
  ],
  'Tea, Coffee & Health Drinks': [
    'photo-1576092768241-dec231879fc3', // Tea
    'photo-1544787219-7f47ccb76574', // Coffee
  ],
  'Biscuits, Cookies & Namkeen': [
    'photo-1599490659213-e2b9527b0f76', // Cookies
    'photo-1566478989037-eec170784d0b', // Chips
    'photo-1613919113640-25732ec5e61f', // Crackers
  ],
  'Chocolates & Sweet Cravings': [
    'photo-1600850056064-a8b380df8395', // Chocolate
    'photo-1571816119607-57e48af1cca9', // Sweets
  ],
  'Instant & Packaged Foods': [
    'photo-1612182062633-9ff3b3598e96', // Noodles
    'photo-1584269600464-37b1b58a9fe7', // Jams
    'photo-1534422298391-e4f8c172dddb', // Soups
  ],
  'Breakfast Cereals & Mixes': [
    'photo-1586201375761-83865001e31c', // Wheat oats
    'photo-1509440159596-0249088772ff', // Breads
  ],
  'Personal Care & Hygiene': [
    'photo-1608248597481-496100c80836', // Soap/Wash
    'photo-1526947425960-945c6e72858f', // Shampoo
    'photo-1598440947619-2c35fc9aa908', // Toothpaste
    'photo-1556228720-195a672e8a03', // Lotion
  ],
  'Cleaning & Household Essentials': [
    'photo-1581578731548-c64695cc6952', // Cleaning spray
    'photo-1563453392212-326f5e854473', // Detergent
    'photo-1607344645866-009c320c5ab8', // Dishwash
  ],
  'Puja Needs / Pooja Samagri': [
    'photo-1609137144813-2d46e309cc4c', // Incense/diya
    'photo-1602810318383-e386cc2a3ccf', // Aromatherapy
  ],
  'Kitchen Essentials & Disposables': [
    'photo-1585130401366-fe05a8d813c4', // Trash bags
    'photo-1563453392212-326f5e854473', // Scrubbers
  ],
  'Stationery & Utilities': [
    'photo-1586075010923-2dd4570fb338', // Pens, pencils
    'photo-1513542789411-b6a5d4f31634', // Drawing
    'photo-1456513080510-7bf3a84b82f8', // Notebooks
    'photo-1588854337236-6889d631faa8', // Calculator/office
  ],
  'Festival & Seasonal Essentials': [
    'photo-1531747118685-ca8fa6324844', // Umbrella
    'photo-1508873696983-2df519f0397e', // Holi colors
    'photo-1513151233558-d860c5398176', // Diwali lights
  ]
};

// Helper to get consistent Unsplash image links
function getUnsplashUrl(imgId: string, w = 600): string {
  return `https://images.unsplash.com/${imgId}?auto=format&fit=crop&q=80&w=${w}`;
}

const baseCategoryConfig = [
  ...cat1_3,
  ...cat4_6,
  ...cat7_9,
  ...cat10_12,
  ...cat13_15
];

export function generateProducts(): Product[] {
  const finalProducts: Product[] = [];
  let skuCounter = 1001;

  baseCategoryConfig.forEach((catObj) => {
    catObj.items.forEach((itemObj) => {
      itemObj.weights.forEach((weightStr, wIndex) => {
        const baseMin = itemObj.priceRange[0];
        const baseMax = itemObj.priceRange[1];
        const variantsCount = itemObj.weights.length;
        
        let price = baseMin;
        if (variantsCount > 1) {
          const ratio = wIndex / (variantsCount - 1);
          price = Math.round(baseMin + (baseMax - baseMin) * ratio);
        }
        
        const mrp = Math.round(price * (1.10 + (skuCounter % 15) / 100)); // 10% to 25% markup
        const discount = Math.round(((mrp - price) / mrp) * 100);
        const saveAmount = mrp - price;

        const pool = imagePool[catObj.name] || imagePool['Atta, Flour & Grains'];
        const imgIndex = (skuCounter + wIndex) % pool.length;
        const mainImgId = pool[imgIndex];
        const frontImgId = pool[(imgIndex + 1) % pool.length];
        const sideImgId = pool[(imgIndex + 2) % pool.length];
        const backImgId = pool[(imgIndex + 3) % pool.length];
        const lifestyleImgId = pool[(imgIndex + 4) % pool.length];

        const mainImg = getUnsplashUrl(mainImgId, 600);
        const frontImg = getUnsplashUrl(frontImgId, 500);
        const sideImg = getUnsplashUrl(sideImgId, 500);
        const backImg = getUnsplashUrl(backImgId, 500);
        const zoomImg = getUnsplashUrl(mainImgId, 1000);
        const lifestyleImg = getUnsplashUrl(lifestyleImgId, 800);

        const itemBrand = itemObj.brand;

        let finalName = itemObj.baseName;
        if (!finalName.includes(itemBrand) && itemBrand !== 'Daily Needs') {
          finalName = `${itemBrand} ${finalName}`;
        }

        const isBestSeller = skuCounter % 11 === 0;
        const isTrending = skuCounter % 13 === 0;
        const isNewArrival = skuCounter % 17 === 0;
        const isTodayDeal = skuCounter % 9 === 0;
        const isHealthyChoice = catObj.name === 'Atta, Flour & Grains' || catObj.name === 'Dry Fruits, Seeds & Nuts' || itemBrand === 'Tata Sampann';

        const categoryHighlights: Record<string, string[]> = {
          'Atta, Flour & Grains': ['Authentic farm grains milled stone-ground', 'High natural dietary fiber & plant proteins', 'No artificial polishers, unadulterated', 'Essential staple for healthy Indian cooking'],
          'Cooking Oils & Ghee': ['100% pure extracted fat solids', 'Contains fat-soluble vitamins A, D, E, K', 'Excellent smoking temperature, zero trans-fat', 'Deep granular texture & signature aroma'],
          'Spices, Salt & Sugar': ['Premium spices sourced from organic gardens', 'Nitrogen flush sealed for long aroma life', 'No synthetic visual dyes or colors', 'Ground under hygienic temperatures'],
          'Dry Fruits, Seeds & Nuts': ['Premium grade crunchy dry fruits', 'Sourced from organic farming regions', 'Perfect natural source of vitamins & energy', 'Hygienically packed inside seal pouches'],
          'Tea, Coffee & Health Drinks': ['Pure premium Assam tea gardens selection', 'Double-filtered instant roast coffee beans', 'Enriched chocolate booster nutrients', 'Provides long-lasting daily focus & energy'],
          'Biscuits, Cookies & Namkeen': ['Perfect crunch companion for evening Chai', 'Baked under strictly hygienic facilities', 'Packed with crunchy dry fruits or spices', 'Authentic Indian savoury spices blend'],
          'Chocolates & Sweet Cravings': ['Rich creamy cocoa butter solids', 'Canned sweets prepared in pure ghee syrup', 'Excellent choice for family celebrations', '100% vegetarian, food-grade pack'],
          'Instant & Packaged Foods': ['Prepares inside few minutes instantly', 'Packed under advanced food safety controls', 'Iconic Indian spice seasoning packet included', 'Perfect delicious quick snack option'],
          'Breakfast Cereals & Mixes': ['High dietary fibers, low cholesterol fat', 'Excellent wholesome morning energy boost', 'Authentic ready-to-mix quick recipe batters', 'Requires minimal cooking efforts'],
          'Personal Care & Hygiene': ['Provides maximum certified germ protection', 'Skin-friendly, pH balanced formula', 'Infused with soothing natural aromatic oils', 'Dermatologically safe daily hygiene care'],
          'Cleaning & Household Essentials': ['Cuts deep oil stains & sticky mud instantly', 'Kills 99.9% of house bacteria & germs', 'Leaves a lingering fresh citrusy scent', 'Safe for all modern floor tiles & marbles'],
          'Puja Needs / Pooja Samagri': ['Pure organic ingredients, no toxic charcoal', 'Traditional materials for holy Indian prayers', 'Creates a peaceful calm environment', 'Hygienically packed spiritual essentials'],
          'Kitchen Essentials & Disposables': ['Heavy-duty scratch-free wire scrubbers', 'Oxo-biodegradable leak-proof garbage bags', 'Food-grade certified foils and paper sheets', 'Useful high-strength utility items'],
          'Stationery & Utilities': ['Smooth smear-free ink & neat writing flow', 'Premium clean drawing & notebooks paper sheets', 'Strong adhesive strength, durable tapes', 'Essential high-grade tools for students & office'],
          'Festival & Seasonal Essentials': ['100% skin-safe organic herbal colors', 'Traditional baked hand-made terracotta diyas', 'Windproof durable folding protection umbrella', 'Useful seasonal essentials for daily commute']
        };

        finalProducts.push({
          id: `prod_${skuCounter}`,
          name: finalName,
          brand: itemBrand,
          weight: weightStr,
          mrp,
          price,
          discount,
          saveAmount,
          availability: skuCounter % 43 !== 0,
          stock: skuCounter % 43 === 0 ? 0 : 15 + (skuCounter % 75),
          sku: `DN-${skuCounter}`,
          category: catObj.name,
          subcategory: itemObj.defaultSub,
          rating: parseFloat((3.9 + (skuCounter % 11) * 0.1).toFixed(1)),
          ratingCount: 22 + (skuCounter % 380),
          images: {
            main: mainImg,
            front: frontImg,
            side: sideImg,
            back: backImg,
            zoom: zoomImg,
            lifestyle: lifestyleImg
          },
          description: `Treat your household to premium ${finalName} in ${weightStr} size. Handpicked and certified by the grocery specialists at Daily Needs, it ensures ultimate purity, great flavor, and unbeatable value for money. Sourced directly from verified distributors and brand owners for Connaught Place kitchens.`,
          highlights: categoryHighlights[catObj.name] || ['Premium grocery essential', 'Guaranteed premium quality', 'Hygienically packed'],
          ingredients: `Premium grade active ingredients, grains, or raw materials processed for ${finalName}. Clean, vegetarian product with no hidden preservatives.`,
          nutritionFacts: ['Personal Care & Hygiene', 'Cleaning & Household Essentials', 'Puja Needs / Pooja Samagri', 'Kitchen Essentials & Disposables', 'Stationery & Utilities', 'Festival & Seasonal Essentials'].includes(catObj.name)
            ? undefined
            : { 'Energy': `${140 + (skuCounter % 300)} kcal`, 'Protein': `${2 + (skuCounter % 15)} g`, 'Carbohydrates': `${15 + (skuCounter % 50)} g`, 'Fat': `${0.5 + (skuCounter % 12)} g` },
          storageInstructions: catObj.name === 'Festival & Seasonal Essentials' || catObj.name === 'Stationery & Utilities'
            ? 'Store in a neat dry drawer or closet away from water.'
            : 'Store in a clean, dry, insect-free container. Keep away from heat and moisture.',
          manufacturer: `${itemBrand} Sourcing & Manufacturing Private Limited`,
          countryOfOrigin: 'India',
          expiryInfo: 'Best before 9 months from the date of packaging (Demo)',
          isBestSeller,
          isTrending,
          isNewArrival,
          isTodayDeal,
          isSeasonal: skuCounter % 19 === 0,
          isFestivalSpecial: skuCounter % 23 === 0,
          isHealthyChoice,
          isDailyEssential: true
        });

        skuCounter++;
      });
    });
  });

  return finalProducts;
}

export interface BrandLogo {
  name: string;
  count: number;
  description: string;
  image: string;
}

export const curatedBrands: BrandLogo[] = [
  { name: 'Amul', count: 48, description: 'The Taste of India. Pure cow ghee, premium buffalo butter & sweets.', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=200' },
  { name: 'Aashirvaad', count: 32, description: 'Wholesome nutrition. Stone-ground whole wheat chakki atta.', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=200' },
  { name: 'Fortune', count: 40, description: 'Healthy living. Premium kachi ghani mustard oils & flours.', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200' },
  { name: 'Britannia', count: 35, description: 'Freshly baked. High fiber wheat rusks, butter cookies & snacks.', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=200' },
  { name: 'Tata Sampann', count: 28, description: 'Organic Trust. Unpolished dals, clean pulses & whole spices.', image: 'https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?auto=format&fit=crop&q=80&w=200' },
  { name: 'Haldiram\'s', count: 45, description: 'Desi Munchies. Famous aloo bhujia, sev & traditional sweets.', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=200' },
  { name: 'Maggi', count: 15, description: '2-Minute taste. Instant comfort masala noodles & tomato sauce.', image: 'https://images.unsplash.com/photo-1612182062633-9ff3b3598e96?auto=format&fit=crop&q=80&w=200' },
  { name: 'Classmate', count: 22, description: 'Academic companion. Rich smooth sheet notebooks & writing pens.', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=200' },
  { name: 'Dettol', count: 18, description: 'Advanced protection. Multi-purpose germ killers, hand sanitizers & soaps.', image: 'https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&q=80&w=200' },
  { name: 'Cycle Pure', count: 14, description: 'Spiritual prayers. Fragrant sandalwood incense & batti.', image: 'https://images.unsplash.com/photo-1609137144813-2d46e309cc4c?auto=format&fit=crop&q=80&w=200' }
];

export const staticCoupons = [
  { code: 'DAILY100', discountPercent: 10, minOrderValue: 800, description: 'Get 10% off on orders above ₹800 (Max discount ₹150)' },
  { code: 'FREESHIP', discountPercent: 0, minOrderValue: 500, description: 'Free delivery on orders above ₹500' },
  { code: 'FESTIVE25', discountPercent: 15, minOrderValue: 1200, description: 'Festival special: Flat 15% off on orders above ₹1200' },
  { code: 'FIRSTNEEDS', discountPercent: 20, minOrderValue: 400, description: 'First customer trial! 20% off above ₹400 (Max discount ₹100)' }
];
