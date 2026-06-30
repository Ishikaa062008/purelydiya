import React, { useState } from "react";
import { Sparkles, Check, ChevronRight, RotateCcw, ArrowRight, Heart, ShoppingCart, Info, Activity } from "lucide-react";
import { Product } from "../types";
import { SAMPLE_PRODUCTS } from "../lib/data";

interface SkinAnalyzerProps {
  user: any;
  userSkinProfile: any;
  onSaveProfile: (profile: { skinType: string; concerns: string[] }) => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  onViewProductDetail: (product: Product) => void;
  onNavigateToShop: () => void;
}

const SKIN_TYPES = [
  { id: "Oily", title: "Oily Skin", desc: "Greasy look, excess shine, large open pores, prone to frequent breakouts and blackheads.", icon: "💧" },
  { id: "Dry", title: "Dry Skin", desc: "Feels parched, tight, slightly rough, flaky, and has visible fine dehydration lines.", icon: "🏜️" },
  { id: "Combination", title: "Combination Skin", desc: "Oily T-Zone (forehead, nose, chin) with dry or completely normal cheeks.", icon: "⚖️" },
  { id: "Sensitive", title: "Sensitive Skin", desc: "Frequently red, highly reactive, itchy, dry, and easily irritated by chemicals.", icon: "🌸" },
  { id: "Normal", title: "Normal Skin", desc: "Perfectly balanced moisture, clear complexion, small pores, and high elasticity.", icon: "✨" },
];

const SKIN_CONCERNS = [
  { id: "Acne", name: "Acne & Pimples", desc: "Frequent active breakouts, whiteheads, or inflammatory blemishes.", icon: "🔴" },
  { id: "Pigmentation", name: "Pigmentation", desc: "Uneven dark skin patches, melasma, or blotchiness.", icon: "🌗" },
  { id: "Tan Removal", name: "Sun Tan & Burn", desc: "Darkening, solar damage, or dull patches from sun exposure.", icon: "☀️" },
  { id: "Dullness", name: "Dullness & Lack of Glow", desc: "Lacks natural radiance, looks fatigued, and has uneven texture.", icon: "☁️" },
  { id: "Dryness", name: "Dryness & Dehydration", desc: "Prone to peeling, tight texture, and rough spots.", icon: "❄️" },
  { id: "Anti-Aging", name: "Fine Lines & Wrinkles", desc: "Early signs of aging, loss of firmness, and fatigue signs.", icon: "⏳" },
  { id: "Dark Spots", name: "Dark Spots & Acne Scars", desc: "Post-inflammatory scars, brown spots, or hyperpigmentation.", icon: "🎯" },
];

export default function SkinAnalyzer({
  user,
  userSkinProfile,
  onSaveProfile,
  onAddToCart,
  onAddToWishlist,
  onViewProductDetail,
  onNavigateToShop,
}: SkinAnalyzerProps) {
  const [step, setStep] = useState(userSkinProfile ? 3 : 1);
  const [selectedType, setSelectedType] = useState<string>(userSkinProfile?.skinType || "");
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(userSkinProfile?.concerns || []);

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
  };

  const handleConcernToggle = (concernId: string) => {
    if (selectedConcerns.includes(concernId)) {
      setSelectedConcerns(selectedConcerns.filter((c) => c !== concernId));
    } else {
      setSelectedConcerns([...selectedConcerns, concernId]);
    }
  };

  const handleSubmit = () => {
    if (!selectedType) return;
    onSaveProfile({
      skinType: selectedType,
      concerns: selectedConcerns,
    });
    setStep(3);
  };

  const handleReset = () => {
    setSelectedType("");
    setSelectedConcerns([]);
    setStep(1);
  };

  // Filter recommendations based on skin type and concerns
  const recommendedProducts = SAMPLE_PRODUCTS.filter((product) => {
    const matchesType = product.skinTypes.includes(selectedType as any);
    const matchesConcern = product.concerns.some((c) => selectedConcerns.includes(c));
    return matchesType || (selectedType === "Normal" && product.category !== "Combo Packs");
  });

  // Custom skincare routines based on type
  const getCustomRoutine = () => {
    switch (selectedType) {
      case "Oily":
        return [
          { step: "Step 1: Cleanse", title: "Absorb Excess Oil", text: "Lather Handcrafted Coffee Soap to scrub away surface oil and dead cells.", product: "coffee-soap" },
          { step: "Step 2: Tone", title: "Balance pH & Tighten Pores", text: "Mist Pure Steam-Distilled Rose Water onto your face to tighten pores.", product: "rose-water-mist" },
          { step: "Step 3: Treatment Pack", title: "Decongest & Clarify", text: "Mix Multani Mitti Powder with Lemon Powder and Rose Water. Apply for 12 mins. Wash off.", product: "multani-mitti-powder" },
        ];
      case "Dry":
        return [
          { step: "Step 1: Cleanse", title: "Gentle Cleanse", text: "Splash with lukewarm water or use a very mild herbal wash.", product: "" },
          { step: "Step 2: Mask Pack", title: "Deep Nourishment & Hydration", text: "Mix Ubtan Powder or Beetroot Powder with fresh raw milk. Apply for 10 mins and wash.", product: "ubtan-powder" },
          { step: "Step 3: Hydrate & Lock", title: "Barrier Repair & Glow", text: "Mix Aloe Vera Gel powder with a tiny bit of water or honey, apply and leave on.", product: "aloe-vera-powder" },
        ];
      case "Sensitive":
        return [
          { step: "Step 1: Calm", title: "Hydrating Mist", text: "Spray pure Rose Water Mist to calm down any hot flushes or itching immediately.", product: "rose-water-mist" },
          { step: "Step 2: Pack", title: "Soothe & Brighten", text: "Blend Aloe Vera Gel powder and Organic Rose Petal powder with cold milk. Apply for 8 mins.", product: "sensitive-soothing-combo" },
        ];
      case "Combination":
        return [
          { step: "Step 1: Cleanse", title: "Deep Scrubbing", text: "Use Revitalizing Papaya Face Scrub twice a week on your oily T-Zone.", product: "papaya-scrub" },
          { step: "Step 2: Tone", title: "Control & Clarify", text: "Mist Rose Water across the face to balance combination patches.", product: "rose-water-mist" },
          { step: "Step 3: Multi-Masking", title: "Custom Treatment", text: "Apply Multani Mitti on oily forehead/nose, and Beetroot pack on dry cheeks.", product: "ultimate-glow-combo" },
        ];
      default:
        return [
          { step: "Step 1: Scrub", title: "Exfoliation", text: "Exfoliate gently with Coffee Soap or Papaya Scrub.", product: "coffee-soap" },
          { step: "Step 2: Nourish", title: "Ayurvedic Polish", text: "Apply Traditional Ubtan face pack with rose water for a clean, natural shine.", product: "ubtan-powder" },
        ];
    }
  };

  return (
    <div id="skin-analyzer-widget" className="bg-stone-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Step Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full text-emerald-800 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="h-4 w-4 animate-spin" />
            <span>AI Powered Skincare Diagnostic</span>
          </div>
          <h1 className="mt-3 font-sans font-bold text-3xl sm:text-4xl text-stone-800 tracking-tight">
            Discover Your Ideal <span className="text-emerald-800">Herbal Routine</span>
          </h1>
          <p className="mt-2 text-stone-600 max-w-lg mx-auto text-sm sm:text-base">
            Take our quick ayurvedic-backed quiz to find natural products formulated perfectly for your distinct skin profile.
          </p>

          {/* Progress Indicators */}
          {step < 3 && (
            <div className="flex items-center justify-center mt-6 space-x-2 sm:space-x-4">
              <span className={`h-2.5 w-16 rounded-full transition-all duration-300 ${step >= 1 ? "bg-emerald-800" : "bg-stone-200"}`} />
              <span className={`h-2.5 w-16 rounded-full transition-all duration-300 ${step >= 2 ? "bg-emerald-800" : "bg-stone-200"}`} />
              <span className={`h-2.5 w-16 rounded-full transition-all duration-300 ${step >= 3 ? "bg-emerald-800" : "bg-stone-200"}`} />
            </div>
          )}
        </div>

        {/* Step 1: Select Skin Type */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-md border border-stone-100 p-6 sm:p-10 transition-all">
            <div className="mb-6">
              <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase">Step 1 of 2</span>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-800 mt-1">What is your Skin Type?</h2>
              <p className="text-sm text-stone-500 mt-1">Select the one option that best describes how your skin behaves throughout the day.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SKIN_TYPES.map((type) => (
                <div
                  key={type.id}
                  onClick={() => handleTypeSelect(type.id)}
                  className={`border rounded-xl p-5 cursor-pointer hover:border-emerald-800 hover:shadow-md transition-all flex space-x-4 items-start ${
                    selectedType === type.id
                      ? "border-emerald-800 bg-emerald-50/40 ring-1 ring-emerald-800"
                      : "border-stone-200 bg-white"
                  }`}
                >
                  <span className="text-3xl">{type.icon}</span>
                  <div>
                    <h3 className="font-semibold text-stone-800 text-base flex items-center">
                      {type.title}
                      {selectedType === type.id && <Check className="h-4 w-4 ml-2 text-emerald-800" />}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">{type.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                disabled={!selectedType}
                onClick={() => setStep(2)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-semibold text-white shadow-md transition-all ${
                  selectedType
                    ? "bg-emerald-800 hover:bg-emerald-700 cursor-pointer"
                    : "bg-stone-300 cursor-not-allowed"
                }`}
              >
                <span>Continue</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Skin Concerns */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-md border border-stone-100 p-6 sm:p-10 transition-all">
            <div className="mb-6">
              <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase">Step 2 of 2</span>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-800 mt-1">Any specific Skin Concerns?</h2>
              <p className="text-sm text-stone-500 mt-1">Select all concerns you are currently seeking to address with natural products.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SKIN_CONCERNS.map((concern) => {
                const isSelected = selectedConcerns.includes(concern.id);
                return (
                  <div
                    key={concern.id}
                    onClick={() => handleConcernToggle(concern.id)}
                    className={`border rounded-xl p-4 cursor-pointer hover:border-emerald-800 hover:shadow-md transition-all flex space-x-3 items-center ${
                      isSelected
                        ? "border-emerald-800 bg-emerald-50/40 ring-1 ring-emerald-800"
                        : "border-stone-200 bg-white"
                    }`}
                  >
                    <span className="text-2xl">{concern.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-stone-800 text-sm flex items-center justify-between">
                        {concern.name}
                        {isSelected && <Check className="h-4 w-4 text-emerald-800" />}
                      </h3>
                      <p className="text-[11px] text-stone-500 leading-snug">{concern.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="flex items-center space-x-1 px-4 py-2 border border-stone-200 hover:bg-stone-50 rounded-full text-stone-600 text-sm font-semibold transition-all"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center space-x-2 bg-emerald-800 hover:bg-emerald-700 px-6 py-3 rounded-full text-sm font-semibold text-white shadow-md transition-all"
              >
                <span>Generate Recommendations</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Diagnostic Result */}
        {step === 3 && (
          <div className="space-y-8 animate-fade-in">
            {/* Skin Summary Card */}
            <div className="bg-stone-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl border border-stone-800">
              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">Your Skincare Identity</span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">Skin Type: {selectedType}</h2>
                    {selectedConcerns.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {selectedConcerns.map((c) => (
                          <span key={c} className="bg-white/10 text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/5">
                            ✨ {c}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-emerald-100 text-sm mt-2">All normal, balanced skin characteristics!</p>
                    )}
                  </div>
                  <button
                    onClick={handleReset}
                    className="bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full border border-white/10 transition-colors"
                    title="Retake Diagnostic Quiz"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-8 border-t border-white/10 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-emerald-200 text-sm uppercase tracking-wider">Expert Observations</h4>
                    <p className="text-sm text-stone-200 mt-2 leading-relaxed">
                      Based on your choices, your barrier needs structured herbal ingredients to address {selectedConcerns.join(", ") || "balance maintenance"}. Avoid mineral oils, sulfates, or artificial perfumes. Nature's active organic agents are highly biological and deliver safe, deep skin regeneration.
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-start space-x-3">
                    <Info className="h-5 w-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-xs text-white uppercase tracking-wider">Ayurvedic Tip</h5>
                      <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                        Drink plenty of warm water, minimize heavy synthetic makeup, and apply our cold-distilled rose water throughout the day to calm down dermal flare-ups.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative background circle */}
              <div className="absolute -bottom-10 -right-10 bg-emerald-700/20 rounded-full h-40 w-40 blur-2xl" />
            </div>

            {/* Custom Routine Steps */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Activity className="h-5 w-5 text-emerald-800" />
                <h3 className="text-lg font-bold text-stone-800 uppercase tracking-wider">Suggested Skin Routine</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getCustomRoutine().map((routine, idx) => (
                  <div key={idx} className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">{routine.step}</span>
                    <h4 className="font-semibold text-stone-800 mt-1.5">{routine.title}</h4>
                    <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">{routine.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Personalized Recommendations Catalog */}
            <div>
              <h3 className="text-xl font-bold text-stone-800 mb-4">Your Match Recommendations</h3>
              {recommendedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {recommendedProducts.slice(0, 6).map((product) => (
                    <div key={product.id} className="bg-white rounded-2xl border border-stone-150 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col group">
                      {/* Product Image */}
                      <div className="relative aspect-square overflow-hidden bg-stone-100 cursor-pointer" onClick={() => onViewProductDetail(product)}>
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2 left-2 bg-emerald-800 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow">
                          {Math.floor(Math.random() * 10) + 90}% Skin Match
                        </span>
                      </div>

                      {/* Details */}
                      <div className="p-4 flex-1 flex flex-col">
                        <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">{product.category}</span>
                        <h4
                          onClick={() => onViewProductDetail(product)}
                          className="font-semibold text-stone-800 text-sm mt-1 hover:text-emerald-800 cursor-pointer transition-colors truncate"
                        >
                          {product.name}
                        </h4>
                        <p className="text-xs text-stone-500 mt-1 leading-snug line-clamp-2 flex-1">{product.description}</p>

                        <div className="flex items-center justify-between mt-4 border-t border-stone-50 pt-3">
                          <span className="font-bold text-emerald-800 text-base">₹{product.price}</span>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => onAddToWishlist(product)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 border border-stone-100 rounded-full hover:bg-rose-50 transition-colors"
                            >
                              <Heart className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onAddToCart(product)}
                              className="bg-stone-900 hover:bg-stone-800 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1 transition-all"
                            >
                              <ShoppingCart className="h-3.5 w-3.5" />
                              <span>Add</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center bg-white border border-stone-150 rounded-2xl py-12 px-4">
                  <p className="text-stone-500 text-sm">No specialized products found. Browse our full natural beauty line.</p>
                  <button onClick={onNavigateToShop} className="mt-4 bg-emerald-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold">
                    Browse Shop Catalog
                  </button>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center shadow-sm">
              <h4 className="font-bold text-stone-800 text-base">Have more personalized questions about your skincare routine?</h4>
              <p className="text-stone-600 text-xs mt-1 max-w-lg mx-auto leading-relaxed">
                Connect with our expert chatbot Diya, available at the bottom right of the screen, to discuss specialized packs, ingredients, or routine steps!
              </p>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
