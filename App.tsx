
import React, { useState, useEffect } from 'react';
import { User, UserRole, Product } from './types';
import Layout from './components/Layout';
import Marketplace from './components/Marketplace';
import Dashboard from './components/Dashboard';
import { resolveLocation } from './services/geminiService';

interface LocationInfo {
  country: string;
  currencyCode: string;
  currencySymbol: string;
  regionName: string;
}

interface CartItem {
  productId: string;
  quantity: number;
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'ug-u1',
    name: 'Josephine Namukasa',
    email: 'namukasa@mbararafarms.ug',
    role: UserRole.FARMER,
    isVerified: true,
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?q=80&w=100&h=100&auto=format&fit=crop',
  });

  const [activeView, setActiveView] = useState('dashboard');
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const info = await resolveLocation(latitude, longitude);
        if (info) setLocationInfo(info);
      }, (error) => {
        console.warn("Geolocation access denied or failed:", error);
        // Default to Uganda as requested
        setLocationInfo({ country: 'Uganda', currencyCode: 'UGX', currencySymbol: 'USh', regionName: 'Kampala' });
      });
    }
  }, []);

  const handleRoleSwitch = (role: UserRole) => {
    setCurrentUser(prev => ({ ...prev, role }));
  };

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => 
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { productId: product.id, quantity: 1 }];
    });
  };

  const currentCurrency = locationInfo?.currencyCode || 'UGX';
  const currentCountry = locationInfo?.country || 'Uganda';
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const renderContent = () => {
    switch (activeView) {
      case 'marketplace':
        return <Marketplace currencyCode={currentCurrency} userCountry={currentCountry} onAddToCart={handleAddToCart} />;
      case 'dashboard':
        return <Dashboard user={currentUser} locationInfo={locationInfo} />;
      case 'home':
      default:
        return (
          <div className="flex flex-col items-center justify-center space-y-12 py-10">
            <div className="text-center max-w-2xl space-y-4">
              <h1 className="text-5xl font-extrabold text-stone-900 leading-tight">
                Empowering the Future of <span className="text-emerald-600">Agribusiness</span>
              </h1>
              <p className="text-lg text-stone-600">
                A unified digital ecosystem for farmers, agro-shops, and consumers{locationInfo ? ` in ${locationInfo.country}` : ''}.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <button 
                  onClick={() => setActiveView('marketplace')}
                  className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all transform hover:-translate-y-1"
                >
                  Browse Marketplace
                </button>
                <button 
                  onClick={() => setActiveView('dashboard')}
                  className="px-8 py-4 bg-white text-stone-800 border border-stone-200 rounded-2xl font-bold shadow-sm hover:bg-stone-50 transition-all transform hover:-translate-y-1"
                >
                  Seller Dashboard
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              <div className="p-8 bg-white rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">Local Trading</h3>
                <p className="text-stone-500 text-sm">Transact in {locationInfo?.currencyCode || 'local currency'} with verified regional sellers.</p>
              </div>
              <div className="p-8 bg-white rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">Verified Ecosystem</h3>
                <p className="text-stone-500 text-sm">Robust KYC and moderation ensure a safe marketplace for high-quality farm inputs.</p>
              </div>
              <div className="p-8 bg-white rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">AI-Powered Insights</h3>
                <p className="text-stone-500 text-sm">Real-time pricing suggestions and weather-based farm advice powered by Gemini AI.</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout 
      user={currentUser} 
      onRoleSwitch={handleRoleSwitch} 
      onNavigate={setActiveView}
      activeView={activeView}
      locationInfo={locationInfo}
      cartCount={cartCount}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
