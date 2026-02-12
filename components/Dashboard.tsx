
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { getPriceSuggestion, getWeatherAdvice } from '../services/geminiService';

interface DashboardProps {
  user: User;
  locationInfo: { country: string; currencyCode: string; regionName: string } | null;
}

const Dashboard: React.FC<DashboardProps> = ({ user, locationInfo }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);

  const region = locationInfo ? `${locationInfo.regionName}, ${locationInfo.country}` : 'Nairobi, Kenya';
  const currency = locationInfo ? locationInfo.currencyCode : 'KES';

  useEffect(() => {
    if (user.role === UserRole.FARMER) {
      handleGetAiInsights();
    }
  }, [user.role, locationInfo]);

  const handleGetAiInsights = async () => {
    setAiLoading(true);
    try {
      const [price, weather] = await Promise.all([
        getPriceSuggestion('Tomatoes', region, currency),
        getWeatherAdvice(region)
      ]);
      setAiData(price);
      setWeatherData(weather);
    } catch (err) {
      console.error("Error fetching dashboard insights:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency }).format(amount);
  };

  const renderFarmerOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <p className="text-stone-500 text-sm font-medium mb-1">Total Sales</p>
          <h3 className="text-3xl font-bold text-stone-800">{formatPrice(1240.50)}</h3>
          <span className="text-emerald-600 text-xs font-bold">+12.5% this month</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <p className="text-stone-500 text-sm font-medium mb-1">Active Orders</p>
          <h3 className="text-3xl font-bold text-stone-800">8</h3>
          <span className="text-stone-400 text-xs">3 pending delivery</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
          <p className="text-stone-500 text-sm font-medium mb-1">Customer Rating</p>
          <h3 className="text-3xl font-bold text-stone-800">4.9</h3>
          <span className="text-amber-500 text-xs">★★★★★ (42 reviews)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-emerald-900 text-emerald-50 p-6 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-emerald-500/20 p-2 rounded-lg">
                <svg className="w-6 h-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h4 className="text-lg font-bold">Smart Pricing Insight</h4>
            </div>
            {aiLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-emerald-800 rounded w-3/4"></div>
                <div className="h-4 bg-emerald-800 rounded w-1/2"></div>
              </div>
            ) : aiData ? (
              <div>
                <p className="text-2xl font-bold mb-2">{aiData.suggestedPrice}</p>
                <p className="text-emerald-200/80 text-sm mb-4">{aiData.reasoning}</p>
                <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-xs">
                  <strong>Trend:</strong> {aiData.trends}
                </div>
              </div>
            ) : (
              <p className="text-stone-300 italic">Regional market pricing estimates loading...</p>
            )}
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        </div>

        <div className="bg-stone-800 text-stone-50 p-6 rounded-3xl shadow-lg relative overflow-hidden">
           <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-stone-500/20 p-2 rounded-lg">
                <svg className="w-6 h-6 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
              </div>
              <h4 className="text-lg font-bold">Weather for {locationInfo?.regionName || 'your area'}</h4>
            </div>
            {aiLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-stone-700 rounded w-3/4"></div>
                <div className="h-4 bg-stone-700 rounded w-1/2"></div>
              </div>
            ) : weatherData ? (
              <div>
                <p className="text-sm font-medium mb-3">{weatherData.outlook}</p>
                <ul className="space-y-2">
                  {weatherData.advice.map((item: string, idx: number) => (
                    <li key={idx} className="text-xs flex items-start gap-2 text-stone-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center gap-2">
                   <span className="text-[10px] uppercase font-bold text-stone-500">Risk Level:</span>
                   <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${weatherData.riskLevel?.toLowerCase().includes('low') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                    {weatherData.riskLevel || 'Unknown'}
                   </span>
                </div>
              </div>
            ) : (
              <p className="text-stone-300 italic">Regional weather forecast loading...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Hello, {user.name}</h1>
          <p className="text-stone-600 uppercase text-xs font-bold tracking-widest mt-1">Role: {user.role}</p>
        </div>
      </div>

      <div className="border-b border-stone-200 flex space-x-8">
        {['overview', 'inventory', 'orders', 'wallet'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === tab ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-stone-400 hover:text-stone-600'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' ? (
        user.role === UserRole.FARMER ? renderFarmerOverview() :
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-100">
          <h3 className="text-xl font-bold text-stone-800">Welcome to your Dashboard</h3>
          <p className="text-stone-500 mt-2">Personalized insights for {locationInfo?.country || 'your region'}.</p>
        </div>
      ) : <div className="p-20 text-center text-stone-400 italic">Feature coming soon for {locationInfo?.country || 'your region'} market.</div>}
    </div>
  );
};

export default Dashboard;
