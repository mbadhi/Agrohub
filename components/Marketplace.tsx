
import React, { useState, useMemo } from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { Product, ProductCategory, Review } from '../types';
import { getPriceSuggestion } from '../services/geminiService';

interface MarketplaceProps {
  currencyCode: string;
  userCountry: string | null;
  onAddToCart: (product: Product) => void;
}

const ProductDetailModal: React.FC<{ product: Product; onClose: () => void; currencyCode: string; onAddToCart: (product: Product) => void }> = ({ product, onClose, currencyCode, onAddToCart }) => {
  const [activeImage, setActiveImage] = useState(product.image);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{ suggestedPrice: string; reasoning: string; trends: string } | null>(null);
  
  const images = [product.image, ...(product.moreImages || [])];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: currencyCode }).format(price);
  };

  const handleSuggestPrice = async () => {
    setIsSuggesting(true);
    setAiSuggestion(null);
    try {
      const region = `${product.location}, ${product.country}`;
      const suggestion = await getPriceSuggestion(product.name, region, currencyCode);
      setAiSuggestion(suggestion);
    } catch (error) {
      console.error("Failed to get price suggestion:", error);
    } finally {
      setIsSuggesting(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center text-amber-500">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 fill-current ${i < Math.floor(rating) ? '' : 'text-stone-200'}`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-stone-600 hover:text-stone-900 shadow-sm transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="flex flex-col lg:flex-row max-h-[90vh] overflow-y-auto lg:overflow-hidden">
          <div className="lg:w-1/2 bg-stone-100 flex flex-col">
            <div className="relative h-[300px] sm:h-[450px]">
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="p-4 flex gap-2 overflow-x-auto bg-white border-t border-stone-100">
                {images.map((img, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? 'border-emerald-500 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:w-1/2 p-6 sm:p-10 lg:overflow-y-auto flex flex-col">
            <div className="mb-2 flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${product.sellerType === 'FARMER' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                {product.sellerType} Listing
              </span>
              {product.isVerified && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.607.309 1.188.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Verified
                </span>
              )}
            </div>
            
            <h2 className="text-3xl font-bold text-stone-900 mb-2">{product.name}</h2>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-amber-500">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <span className="ml-1 font-bold">{product.rating}</span>
                <span className="ml-1 text-stone-400 font-medium">({product.reviewCount || 0} reviews)</span>
              </div>
              <div className="w-1 h-1 bg-stone-300 rounded-full"></div>
              <p className="text-stone-500 text-sm flex items-center">
                <svg className="w-4 h-4 mr-1 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {product.location}, {product.country}
              </p>
            </div>

            <div className="text-4xl font-black text-stone-900 mb-8">
              {formatPrice(product.price)}
              <span className="text-base font-medium text-stone-500"> / {product.unit}</span>
            </div>

            <div className="space-y-6 mb-8 flex-grow">
              {/* AI Suggestion Box */}
              {aiSuggestion && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-amber-500 p-1 rounded-md">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">AI Market Insights</span>
                  </div>
                  <p className="text-lg font-bold text-amber-900 mb-1">{aiSuggestion.suggestedPrice}</p>
                  <p className="text-sm text-amber-700 leading-snug mb-2">{aiSuggestion.reasoning}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-amber-500 uppercase">Trend:</span>
                    <span className="text-[10px] text-amber-600 font-medium">{aiSuggestion.trends}</span>
                  </div>
                </div>
              )}

              <section>
                <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">Description</h4>
                <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                  {product.description}
                </p>
              </section>

              {/* Seller Information Section */}
              <section className="bg-stone-50 p-5 rounded-3xl border border-stone-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Seller Information</h4>
                  {product.isVerified && <span className="text-[10px] font-bold text-emerald-600 bg-white px-2 py-0.5 rounded border border-emerald-100">Verified Seller</span>}
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={product.sellerAvatar || 'https://via.placeholder.com/100'} className="w-14 h-14 rounded-2xl object-cover shadow-md" alt={product.sellerName} />
                    {product.isVerified && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-stone-900 text-lg leading-tight truncate">{product.sellerName}</h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-stone-500 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        Joined {product.sellerJoinDate || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <button className="bg-white hover:bg-emerald-50 text-emerald-600 border border-stone-200 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                    View Store
                  </button>
                </div>
              </section>

              {/* Reviews Section */}
              <section className="mt-8">
                <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4 border-b border-stone-100 pb-2">Customer Reviews</h4>
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sm text-stone-800">{review.userName}</span>
                          <span className="text-[10px] text-stone-400 font-medium">{review.date}</span>
                        </div>
                        <div className="mb-2">
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-stone-600 text-sm italic">"{review.comment}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-stone-50 p-6 rounded-xl border border-stone-100 text-center">
                    <p className="text-stone-400 text-sm italic">No reviews yet. Be the first to review!</p>
                  </div>
                )}
              </section>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button 
                onClick={() => onAddToCart(product)}
                className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                Add to Cart
              </button>
              
              <button 
                onClick={handleSuggestPrice}
                disabled={isSuggesting}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-stone-300 text-white font-bold py-4 rounded-2xl shadow-xl shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isSuggesting ? (
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                )}
                Suggest Price
              </button>

              <button className="px-6 py-4 bg-white text-stone-700 border border-stone-200 rounded-2xl font-bold hover:bg-stone-50 transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Marketplace: React.FC<MarketplaceProps> = ({ currencyCode, userCountry, onAddToCart }) => {
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'ALL'>('ALL');
  const [sellerTypeFilter, setSellerTypeFilter] = useState<'ALL' | 'FARMER' | 'SHOP'>('ALL');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'newest'>('newest');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredAndSortedProducts = useMemo(() => {
    let result = MOCK_PRODUCTS.filter(p => {
      const matchesCountry = userCountry ? p.country === userCountry : true;
      const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
      const matchesSellerType = sellerTypeFilter === 'ALL' || p.sellerType === sellerTypeFilter;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
      return matchesCountry && matchesCategory && matchesSellerType && matchesSearch;
    });

    result.sort((a, b) => {
      let valA, valB;
      if (sortBy === 'price') {
        valA = a.price;
        valB = b.price;
      } else if (sortBy === 'rating') {
        valA = a.rating;
        valB = b.rating;
      } else {
        valA = new Date(a.dateAdded).getTime();
        valB = new Date(b.dateAdded).getTime();
      }

      if (sortOrder === 'asc') return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

    return result;
  }, [categoryFilter, sellerTypeFilter, search, sortBy, sortOrder, userCountry]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: currencyCode }).format(price);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex-1 max-w-xl">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-stone-900">Marketplace</h1>
            {userCountry && (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wide">
                Local: {userCountry}
              </span>
            )}
          </div>
          <p className="text-stone-600">Discover fresh produce and farming essentials from verified local sources.</p>
          <div className="mt-4 relative">
            <input 
              type="text" 
              placeholder="Search for tomatoes, seeds, tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all shadow-sm"
            />
            <svg className="absolute left-3 top-3.5 h-5 w-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col gap-4 min-w-[300px]">
          {/* Sorting and Seller Type Filter */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mr-1">Sort:</span>
              <div className="bg-stone-100 p-1 rounded-xl flex gap-1">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-bold text-stone-600 px-2 py-1 outline-none cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                </select>
                <button 
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="bg-white p-1 rounded-lg shadow-sm text-emerald-600 hover:bg-stone-50 transition-colors"
                  title={`Toggle ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  {sortOrder === 'asc' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4 4m0 0l4-4m-4 4v12" /></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mr-1">Sellers:</span>
              <div className="bg-stone-100 p-1 rounded-xl flex gap-1">
                {(['ALL', 'FARMER', 'SHOP'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSellerTypeFilter(type)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      sellerTypeFilter === type 
                      ? 'bg-white text-emerald-600 shadow-sm' 
                      : 'text-stone-500 hover:text-stone-700'
                    }`}
                  >
                    {type === 'ALL' ? 'Everyone' : type === 'FARMER' ? 'Farmers' : 'Agro-Shops'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
             <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mr-1 flex-shrink-0">Categories:</span>
            {['ALL', ...Object.values(ProductCategory)].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex-shrink-0 border ${
                  categoryFilter === cat 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                {cat.charAt(0) + cat.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <div 
              key={product.id} 
              onClick={() => setSelectedProduct(product)}
              className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group cursor-pointer"
            >
              <div className="h-48 relative overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  <div className="flex gap-1 flex-wrap">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase shadow-sm ${product.sellerType === 'FARMER' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                      {product.sellerType === 'FARMER' ? 'Farmer' : 'Agro-Shop'}
                    </span>
                    {product.isVerified && (
                      <span className="px-2 py-1 rounded text-[10px] font-bold uppercase shadow-sm bg-white text-emerald-600 border border-emerald-100 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.607.309 1.188.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-stone-800 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center text-amber-500 text-sm">
                    <span className="mr-1 font-semibold">{product.rating}</span>
                  </div>
                </div>
                <p className="text-stone-500 text-xs mb-3 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {product.location}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-bold text-stone-900">{formatPrice(product.price)}<span className="text-xs font-normal text-stone-500"> / {product.unit}</span></span>
                  
                  {/* Quick Add Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    title="Quick Add to Cart"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg transition-all shadow-sm active:scale-90"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200">
          <div className="w-20 h-20 bg-stone-50 text-stone-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-stone-800">No matching products</h3>
          <p className="text-stone-500 mt-2">Try adjusting your filters for the {sellerTypeFilter === 'ALL' ? 'selected' : sellerTypeFilter === 'FARMER' ? 'Farmer' : 'Agro-Shop'} category in {userCountry || 'your region'}.</p>
        </div>
      )}

      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          currencyCode={currencyCode}
          onAddToCart={onAddToCart}
        />
      )}
    </div>
  );
};

export default Marketplace;
