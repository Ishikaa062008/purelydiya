import { Product, Blog } from "../types";

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "multani-mitti-powder",
    name: "Multani Mitti Powder (Fuller's Earth)",
    category: "Face Powders",
    price: 199,
    description: "Pure organic Fuller's Earth powder sourced from deep mineral deposits. This traditional Ayurvedic face pack deep cleanses, removes oil, and fights acne naturally.",
    benefits: [
      "Absorbs excess sebum and oil without over-drying",
      "Decongests skin pores and removes deep-seated impurities",
      "Fights acne-causing bacteria and reduces blemishes",
      "Improves blood circulation and promotes an even skin tone"
    ],
    ingredients: ["100% Pure Fuller's Earth (Multani Mitti) Powder"],
    usage: "Mix 1 tbsp with Rose Water to form a smooth paste. Apply evenly to face and neck, leave for 12-15 minutes until dry, then rinse with cool water.",
    imageUrl: "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
    reviewsCount: 124,
    skinTypes: ["Oily", "Combination", "Normal"],
    concerns: ["Acne", "Dullness", "Tan Removal", "Dark Spots"],
    stock: 45
  },
  {
    id: "coffee-soap",
    name: "Handcrafted Coffee & Shea Soap",
    category: "Soaps",
    price: 149,
    description: "Cold-pressed bath soap made with fresh Arabica coffee grounds, rich shea butter, and essential oils. Gently exfoliates and tones skin.",
    benefits: [
      "Gently scrubs away dead skin cells for a smooth texture",
      "Caffeine helps firm and tone skin while reducing cellulite appearance",
      "Rich Shea Butter provides deep hydration and moisture lock",
      "Eliminates tan and brightens dark patches"
    ],
    ingredients: ["Arabica Coffee Grounds", "Unrefined Shea Butter", "Cold-Pressed Coconut Oil", "Pure Essential Oils"],
    usage: "Wet skin, gently lather the soap in circular motions to allow coffee particles to exfoliate, then rinse thoroughly.",
    imageUrl: "https://images.unsplash.com/photo-1607006342411-1a903042475d?q=80&w=600&auto=format&fit=crop",
    rating: 4.6,
    reviewsCount: 88,
    skinTypes: ["Oily", "Combination", "Normal", "Dry"],
    concerns: ["Tan Removal", "Dullness", "Dryness"],
    stock: 32
  },
  {
    id: "rose-powder",
    name: "Organic Rose Petal Powder",
    category: "Herbal Powders",
    price: 179,
    description: "Sustainably harvested rose petals sun-dried and finely ground. Rich in antioxidants and natural cooling agents to soothe and hydrate sensitive skin.",
    benefits: [
      "Deeply hydrates and locks in natural skin moisture",
      "Soothes redness, inflammation, and irritated sensitive skin",
      "Contains Vitamin C to boost collagen and brighten dull skin",
      "Balances natural skin oils and acts as a mild astringent"
    ],
    ingredients: ["100% Sun-Dried Rosa Damascena (Rose Petal) Powder"],
    usage: "Mix 1 tbsp with raw milk or honey to form a paste. Apply for 10 minutes, then wash gently with warm water while massaging in circular motions.",
    imageUrl: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    reviewsCount: 95,
    skinTypes: ["Sensitive", "Dry", "Normal"],
    concerns: ["Dullness", "Dryness", "Anti-Aging"],
    stock: 25
  },
  {
    id: "aloe-vera-powder",
    name: "Dehydrated Aloe Vera Gel Powder",
    category: "Herbal Powders",
    price: 189,
    description: "Highly potent freeze-dried Aloe Vera inner leaf gel powder. Instant rescue for dry, dehydrated, sunburned, or hypersensitive skin types.",
    benefits: [
      "Intensely hydrates and repairs damaged skin barrier",
      "Cools sunburns, rashes, and highly irritated skin instantly",
      "Rich in vitamins and minerals that promote collagen synthesis",
      "Acts as a powerful natural anti-aging agent"
    ],
    ingredients: ["100% Pure Freeze-Dried Organic Aloe Barbadensis Leaf Extract"],
    usage: "Mix equal parts of Aloe Powder and Water or Yogurt. Apply to face or hair, leave for 15 minutes, and wash off.",
    imageUrl: "https://images.unsplash.com/photo-1564419320461-6870859219a5?q=80&w=600&auto=format&fit=crop",
    rating: 4.7,
    reviewsCount: 67,
    skinTypes: ["Sensitive", "Dry", "Normal", "Combination"],
    concerns: ["Dryness", "Acne", "Anti-Aging"],
    stock: 50
  },
  {
    id: "beetroot-powder",
    name: "Brightening Beetroot Powder",
    category: "Herbal Powders",
    price: 169,
    description: "Sun-dried organic beetroot roots finely milled. Loaded with iron, potassium, and vitamins to give your skin an unmatched natural rosy glow.",
    benefits: [
      "Provides an instant rosy glow and pinkish complexion",
      "Reduces dark spots, blemishes, and under-eye dark circles",
      "Brightens lip pigmentation and restores natural pink color",
      "Hydrates thoroughly while improving skin cell regeneration"
    ],
    ingredients: ["100% Organic Beta Vulgaris (Beetroot) Root Powder"],
    usage: "Mix 1 tsp Beetroot Powder with 1 tbsp Yogurt or Rose Water. Apply as a face mask for 10 minutes, then rinse. Can also be mixed with honey for lips.",
    imageUrl: "https://images.unsplash.com/photo-1593113630400-ea4288922497?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
    reviewsCount: 110,
    skinTypes: ["Dry", "Normal", "Combination"],
    concerns: ["Dullness", "Dark Spots", "Pigmentation"],
    stock: 40
  },
  {
    id: "lemon-powder",
    name: "Vitamin-C Rich Lemon Peel Powder",
    category: "Herbal Powders",
    price: 159,
    description: "Dehydrated lemon rinds packed with natural alpha-hydroxy acids (AHA) and citric acid. Ideal for skin lightening, tan removal, and deep brightening.",
    benefits: [
      "Rich in Vitamin C which brightens complexion and fades dark spots",
      "Removes stubborn sun tans and evens skin tone",
      "Regulates excess facial oil and reduces pore visibility",
      "Naturally bleaches and exfoliates dead cells gently"
    ],
    ingredients: ["100% Pure Dehydrated Lemon (Citrus Limon) Peel Powder"],
    usage: "Mix 1/2 tsp Lemon Peel Powder with 1 tbsp Multani Mitti and Rose Water. Apply for 10 minutes (not more). A slight tingling is normal. Rinse.",
    imageUrl: "https://images.unsplash.com/photo-1534531173927-aeb928d54385?q=80&w=600&auto=format&fit=crop",
    rating: 4.5,
    reviewsCount: 54,
    skinTypes: ["Oily", "Combination", "Normal"],
    concerns: ["Tan Removal", "Dullness", "Dark Spots", "Pigmentation"],
    stock: 18
  },
  {
    id: "papaya-scrub",
    name: "Revitalizing Papaya Face Scrub",
    category: "Scrubs",
    price: 249,
    description: "Exfoliating gel scrub enriched with raw papaya extracts (papain enzyme), walnut shell granules, and natural aloe juice for complete skin resurfacing.",
    benefits: [
      "Papain enzyme naturally digests dead cells for ultra-soft skin",
      "Fades stubborn acne scars, spots, and marks over time",
      "Unclogs pores, blackheads, and prevents whiteheads",
      "Leaves skin supple and glowing with active vitamin A"
    ],
    ingredients: ["Papaya Fruit Extract", "Fine Walnut Shell Powder", "Organic Aloe Vera Juice", "Vegetable Glycerine"],
    usage: "Apply a small amount to damp face. Massage very gently in upward circular motions for 2-3 minutes. Wash off thoroughly with water. Use twice a week.",
    imageUrl: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=600&auto=format&fit=crop",
    rating: 4.7,
    reviewsCount: 74,
    skinTypes: ["Combination", "Normal", "Oily", "Dry"],
    concerns: ["Acne", "Tan Removal", "Dullness"],
    stock: 22
  },
  {
    id: "rose-water-mist",
    name: "Pure Steam-Distilled Rose Water Mist",
    category: "Mists & Toners",
    price: 129,
    description: "Steam-distilled from fresh Kannauj roses. Free of alcohol, artificial fragrance, or chemical preservatives. Restores hydration and balances skin pH.",
    benefits: [
      "Provides instant cooling and deep hydration anytime, anywhere",
      "Balances skin pH and tightens enlarged pores",
      "Works as a highly effective makeup setting spray and primer",
      "Soothes sensitive, red, or sun-fatigued facial skin"
    ],
    ingredients: ["100% Pure Steam-Distilled Rose (Rosa Damascena) Water"],
    usage: "Spray directly onto face and neck after cleansing, or mix with face powders to make packs. Use throughout the day for a refreshing boost.",
    imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    reviewsCount: 210,
    skinTypes: ["Oily", "Dry", "Combination", "Sensitive", "Normal"],
    concerns: ["Dullness", "Dryness", "Acne", "Anti-Aging"],
    stock: 65
  },
  {
    id: "ubtan-powder",
    name: "Traditional Ayurvedic Ubtan Powder",
    category: "Face Powders",
    price: 229,
    description: "An ancient royal Ayurvedic formula combining turmeric, sandalwood, chickpea flour, and saffron. Gives a bride-like, timeless, golden complexion glow.",
    benefits: [
      "Infuses skin with a healthy golden glow and removes tan",
      "Softens fine lines, tightens skin, and acts as an anti-aging tonic",
      "Chickpea flour gently cleanses and removes fine facial hair",
      "Turmeric and Sandalwood soothe blemishes and uneven pigmentation"
    ],
    ingredients: ["Wild Turmeric", "Sandalwood Powder", "Chickpea Flour", "Saffron Strands", "Almond Powder"],
    usage: "Mix 1 tbsp Ubtan with raw milk (for dry skin) or rose water (for oily skin). Apply and allow to semi-dry. Rub gently in opposite direction of hair growth, then rinse.",
    imageUrl: "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    reviewsCount: 145,
    skinTypes: ["Dry", "Normal", "Combination", "Sensitive"],
    concerns: ["Dullness", "Tan Removal", "Pigmentation", "Anti-Aging"],
    stock: 30
  },
  {
    id: "ultimate-glow-combo",
    name: "Ultimate Glow Skincare Combo Pack",
    category: "Combo Packs",
    price: 499,
    description: "Our signature 3-step home glow routine. Includes Pure Steam-Distilled Rose Water Mist (100ml), Multani Mitti Powder (100g), and Brightening Beetroot Powder (100g).",
    benefits: [
      "Perfect complete pack for detoxifying, hydrating, and glowing skin",
      "Multani Mitti absorbs toxins while Beetroot adds a pink blush glow",
      "Rose water blends these together beautifully for absolute skincare synergy",
      "Great discount compared to buying individual products"
    ],
    ingredients: ["Multani Mitti Powder", "Beetroot Powder", "Pure Rose Water Mist"],
    usage: "Step 1: Cleanse with rose water. Step 2: Mix equal parts Multani Mitti and Beetroot powder with rose water, apply for 12 minutes, rinse. Step 3: Mist skin to lock in glow.",
    imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    reviewsCount: 168,
    skinTypes: ["Oily", "Dry", "Combination", "Normal"],
    concerns: ["Dullness", "Tan Removal", "Acne", "Dark Spots"],
    stock: 15
  },
  {
    id: "sensitive-soothing-combo",
    name: "Sensitive Skin Soothing Combo Pack",
    category: "Combo Packs",
    price: 449,
    description: "Soothe, calm, and heal sensitive, dry, or sunburned skin with this customized pack. Contains Organic Rose Petal Powder (100g), Dehydrated Aloe Vera Powder (100g), and Pure Rose Water Mist (100ml).",
    benefits: [
      "Instantly relieves itching, redness, inflammation, and heat rashes",
      "Repairs compromised skin barriers and dry patches",
      "Gentle, zero chemical and zero fragrance formulation",
      "Extremely nourishing, cooling, and calming Ayurvedic blend"
    ],
    ingredients: ["Rose Petal Powder", "Aloe Vera Gel Powder", "Pure Rose Water Mist"],
    usage: "Mix 1 tsp Rose Petal powder and 1 tsp Aloe Vera powder with Rose Water. Apply a thin layer on face and neck, leave for 10 minutes (do not let it fully dry out), wash with cold water.",
    imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
    reviewsCount: 79,
    skinTypes: ["Sensitive", "Dry", "Normal"],
    concerns: ["Dryness", "Dullness", "Anti-Aging"],
    stock: 20
  }
];

export const SAMPLE_BLOGS: Blog[] = [
  {
    id: "diy-multani-mitti-glow",
    title: "5 DIY Multani Mitti Face Packs for Glowing Skin",
    category: "DIY Face Packs",
    content: `Multani Mitti (Fuller's Earth) has been India's ancient skincare secret for generations. This magical clay absorbs excess oil, cleanses pores, and lightens tans. Here are 5 ways to customize your Multani Mitti mask:

1. **For Oily & Acne-Prone Skin:** Mix 1 tbsp Multani Mitti with 2 tsp Rose Water and 3 drops of tea tree oil. This mask balances pH and controls sebum.
2. **For Dry Skin:** Blend 1 tbsp Multani Mitti with 1 tbsp raw honey and 1 tbsp curd. Honey and curd counteract the drying effect of clay while deep cleansing.
3. **For Tan Removal & Brightening:** Combine 1 tbsp Multani Mitti, 1 tsp Lemon Powder, and enough raw milk to make a paste. Apply on tanned areas for 15 minutes.
4. **For Pigmentation & Dark Spots:** Mix 1 tbsp Multani Mitti with 1 tbsp fresh Tomato juice. Tomato acts as a natural skin bleacher.
5. **For Instant Royal Glow:** Combine 1 tbsp Multani Mitti, 1/2 tsp Ubtan Powder, and 1 tbsp Rose Water. Perfect for a quick glow before events.`,
    imageUrl: "https://images.unsplash.com/photo-1590156221122-c413d9db0407?q=80&w=600&auto=format&fit=crop",
    author: "Dr. Diya Sharma (Ayurvedic Expert)",
    createdAt: "2026-06-15"
  },
  {
    id: "skincare-by-skin-type",
    title: "The Ultimate Guide to Figuring Out Your Skin Type",
    category: "Skincare Routines",
    content: `Are you Oily, Dry, Sensitive, Combination, or Normal? Using the wrong products can irritate your skin barrier, trigger breakouts, or cause extreme flakiness. Here is a simple 2-step test to identify your skin type at home:

**The Bare-Face Method:**
1. Wash your face thoroughly with a mild cleanser. Gently pat dry.
2. Leave your skin completely bare. Do not apply any toner, moisturizer, or serums.
3. Wait for 60 minutes.

**Observe Your Skin:**
- **Oily Skin:** Your entire face (forehead, nose, cheeks, chin) looks shiny and feels greasy to the touch. You are prone to large pores and acne.
- **Dry Skin:** Your skin feels tight, parched, and might look slightly flaky. There are no traces of oil anywhere.
- **Combination Skin:** Your T-Zone (forehead, nose, chin) is oily and shiny, but your cheeks are dry or completely normal.
- **Sensitive Skin:** Your skin is slightly red, feels itchy, warm, or reacts quickly to any skincare products.
- **Normal Skin:** Your skin feels balanced—neither tight nor greasy. It is smooth, clear, and has excellent elasticity.`,
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop",
    author: "Ritu Verma (Senior Esthetician)",
    createdAt: "2026-06-22"
  },
  {
    id: "beetroot-benefits-skincare",
    title: "Beetroot: The Secret to Naturally Pink Cheeks and Lips",
    category: "Ingredient Benefits",
    content: `Beetroot isn't just incredible for your body; it's a stellar skincare miracle. Rich in iron, vitamins, and antioxidants (specifically betalains), beetroot works wonders for reviving dull skin and lighting pigmentation.

**Why Beetroot Powder is a Must-Have:**
- **Natural Pink Complexion:** Beetroot powder stimulates blood circulation, bringing a natural flush of rosy color to your cheeks.
- **Lip Pigmentation Eraser:** Mixing beetroot powder with ghee or milk cream and applying it to lips overnight will fade dark lines and restore your natural pink lip color.
- **High Vitamin C Brightener:** Helps combat dark spots and hyperpigmentation, leaving you with an even and glowing complexion.
- **Anti-Aging Antioxidants:** Protects your skin from free-radical damage, preventing premature fine lines and wrinkling.`,
    imageUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=600&auto=format&fit=crop",
    author: "Dr. Diya Sharma (Ayurvedic Expert)",
    createdAt: "2026-06-28"
  }
];
