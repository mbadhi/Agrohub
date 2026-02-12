
import React from 'react';
import { UserRole, User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onRoleSwitch: (role: UserRole) => void;
  onNavigate: (view: string) => void;
  activeView: string;
  locationInfo: { country: string; currencyCode: string; regionName: string } | null;
  cartCount: number;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onRoleSwitch, onNavigate, activeView, locationInfo, cartCount }) => {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">A</div>
              <span className="text-2xl font-bold text-stone-800 tracking-tight hidden sm:block">AgroHub</span>
            </div>

            <div className="flex items-center space-x-4">
              {locationInfo && (
                <div className="hidden lg:flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-100">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-tight">
                    {locationInfo.regionName}, {locationInfo.country} ({locationInfo.currencyCode})
                  </span>
                </div>
              )}
              
              <button 
                onClick={() => onNavigate('marketplace')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${activeView === 'marketplace' ? 'text-emerald-600' : 'text-stone-600 hover:text-emerald-600'}`}
              >
                Marketplace
              </button>
              
              {/* Cart Icon with Counter */}
              <div className="relative cursor-pointer p-2 text-stone-600 hover:text-emerald-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white min-w-[18px] text-center animate-in zoom-in duration-200">
                    {cartCount}
                  </span>
                )}
              </div>

              <div className="h-8 w-px bg-stone-200 mx-2"></div>
              
              <div className="flex items-center space-x-2">
                <select 
                  value={user.role}
                  onChange={(e) => onRoleSwitch(e.target.value as UserRole)}
                  className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value={UserRole.CUSTOMER}>Customer</option>
                  <option value={UserRole.FARMER}>Farmer</option>
                  <option value={UserRole.SHOP}>Agro-Shop</option>
                  <option value={UserRole.ADMIN}>Admin</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 ml-4">
                <img className="h-8 w-8 rounded-full border border-stone-200" src={user.avatar} alt="User" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-stone-100 border-t border-stone-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-stone-500 text-sm">
          &copy; 2024 AgroHub Digital Marketplace. {locationInfo ? `Serving ${locationInfo.country}.` : ''}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
