
import React from 'react';
import { Product, ProductCategory } from './types';

export const THEME = {
  primary: 'emerald-600',
  secondary: 'stone-700',
  accent: 'orange-500',
  background: 'stone-50',
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'ug-1',
    name: 'Organic Matooke (Green Bananas)',
    category: ProductCategory.CROPS,
    price: 25000,
    unit: 'bunch',
    stock: 150,
    sellerId: 'ug-f1',
    sellerName: 'Mbarara Highland Farms',
    sellerType: 'FARMER',
    sellerAvatar: 'https://images.unsplash.com/photo-1541914212534-190678d5272a?q=80&w=100&h=100&auto=format&fit=crop',
    sellerJoinDate: 'Feb 2023',
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=600&h=450&auto=format&fit=crop',
    moreImages: [
      'https://images.unsplash.com/photo-1571771894821-ad996241e24b?q=80&w=600&h=450&auto=format&fit=crop'
    ],
    rating: 4.9,
    reviewCount: 312,
    reviews: [
      { id: 'ur1', userName: 'Grace Nakato', rating: 5, comment: 'Very soft matooke, steamed perfectly.', date: 'Yesterday' }
    ],
    location: 'Mbarara, Uganda',
    country: 'Uganda',
    description: 'Authentic highland matooke grown in the fertile soils of Mbarara. Freshly harvested on order. Large bunches suitable for family meals or ceremonies.',
    dateAdded: '2024-03-10'
  },
  {
    id: 'ug-2',
    name: 'Victoria Hybrid Maize Seeds',
    category: ProductCategory.SEEDS,
    price: 12000,
    unit: '2kg pack',
    stock: 500,
    sellerId: 'ug-s1',
    sellerName: 'Bukoola Agro-Inputs',
    sellerType: 'SHOP',
    sellerAvatar: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=100&h=100&auto=format&fit=crop',
    sellerJoinDate: 'May 2020',
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?q=80&w=600&h=450&auto=format&fit=crop',
    rating: 4.6,
    reviewCount: 156,
    location: 'Kampala, Uganda',
    country: 'Uganda',
    description: 'High germination rate seeds specifically treated for pests common in Central Uganda. Drought tolerant and high yielding.',
    dateAdded: '2024-03-05'
  },
  {
    id: 'ug-3',
    name: 'Robusta Coffee Beans (Dry)',
    category: ProductCategory.CROPS,
    price: 8500,
    unit: 'kg',
    stock: 1000,
    sellerId: 'ug-f2',
    sellerName: 'Masaka Farmers Union',
    sellerType: 'FARMER',
    sellerAvatar: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=100&h=100&auto=format&fit=crop',
    sellerJoinDate: 'Jan 2021',
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&h=450&auto=format&fit=crop',
    rating: 4.8,
    reviewCount: 45,
    location: 'Masaka, Uganda',
    country: 'Uganda',
    description: 'Premium sun-dried Robusta coffee beans. Harvested from the heart of Masaka coffee belt. Excellent for grinding at home or commercial roasting.',
    dateAdded: '2024-03-12'
  },
  {
    id: '1',
    name: 'Organic Red Tomatoes',
    category: ProductCategory.CROPS,
    price: 15,
    unit: 'kg',
    stock: 200,
    sellerId: 'f1',
    sellerName: 'Green Valley Farm',
    sellerType: 'FARMER',
    sellerAvatar: 'https://images.unsplash.com/photo-1595273670150-db0a3d39074f?q=80&w=100&h=100&auto=format&fit=crop',
    sellerJoinDate: 'Jan 2022',
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=600&h=450&auto=format&fit=crop',
    moreImages: [
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=600&h=450&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1607305382125-2721ce0b122f?q=80&w=600&h=450&auto=format&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 128,
    reviews: [
      { id: 'r1', userName: 'John Mwangi', rating: 5, comment: 'Extremely fresh and tasty tomatoes! Will buy again.', date: '2 days ago' },
      { id: 'r2', userName: 'Sarah Kemunto', rating: 4, comment: 'Good quality, but a few were a bit too ripe.', date: '1 week ago' }
    ],
    location: 'Nakuru, Kenya',
    country: 'Kenya',
    description: 'Sun-ripened organic tomatoes grown without pesticides. These tomatoes are hand-picked daily to ensure maximum freshness. Perfect for salads, sauces, and soups. Our farm uses sustainable irrigation practices and natural composting to maintain soil health.',
    dateAdded: '2024-03-01'
  },
  {
    id: '2',
    name: 'High-Yield Maize Seeds',
    category: ProductCategory.SEEDS,
    price: 45,
    unit: 'bag',
    stock: 50,
    sellerId: 's1',
    sellerName: 'AgroPro Inputs',
    sellerType: 'SHOP',
    sellerAvatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=100&h=100&auto=format&fit=crop',
    sellerJoinDate: 'Mar 2021',
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?q=80&w=600&h=450&auto=format&fit=crop',
    moreImages: [
      'https://images.unsplash.com/photo-1551135049-8a33b5883817?q=80&w=600&h=450&auto=format&fit=crop'
    ],
    rating: 4.5,
    reviewCount: 84,
    reviews: [
      { id: 'r3', userName: 'Peter Omondi', rating: 5, comment: 'Great germination rate. Highly recommended.', date: '3 weeks ago' }
    ],
    location: 'Nairobi, Kenya',
    country: 'Kenya',
    description: 'Drought resistant hybrid maize seeds (H614). Specifically developed for the East African climate, these seeds offer 20% higher yields than traditional varieties and are resistant to common leaf blights.',
    dateAdded: '2024-02-15'
  },
  {
    id: '3',
    name: 'Fresh Cow Milk',
    category: ProductCategory.DAIRY,
    price: 2.5,
    unit: 'liter',
    stock: 100,
    sellerId: 'f2',
    sellerName: 'Sunset Dairy',
    sellerType: 'FARMER',
    sellerAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=100&h=100&auto=format&fit=crop',
    sellerJoinDate: 'Oct 2023',
    isVerified: false,
    image: 'https://images.unsplash.com/photo-1563636619-e910ef2a844b?q=80&w=600&h=450&auto=format&fit=crop',
    moreImages: [
      'https://images.unsplash.com/photo-1550583760-705296901b75?q=80&w=600&h=450&auto=format&fit=crop'
    ],
    rating: 4.9,
    reviewCount: 210,
    location: 'Eldoret, Kenya',
    country: 'Kenya',
    description: 'Morning fresh unpasteurized organic milk from grass-fed cows. Our cows are raised in a stress-free environment, grazing on highland pastures. No antibiotics or growth hormones used.',
    dateAdded: '2024-03-05'
  },
  {
    id: '4',
    name: 'Premium NPK Fertilizer',
    category: ProductCategory.FERTILIZER,
    price: 85,
    unit: '50kg bag',
    stock: 30,
    sellerId: 's2',
    sellerName: 'Harvest Helpers Ltd',
    sellerType: 'SHOP',
    sellerAvatar: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?q=80&w=100&h=100&auto=format&fit=crop',
    sellerJoinDate: 'May 2022',
    isVerified: true,
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=600&h=450&auto=format&fit=crop',
    rating: 4.2,
    reviewCount: 45,
    location: 'Mombasa, Kenya',
    country: 'Kenya',
    description: 'Professional grade NPK 17-17-17 for all crop stages. Provides balanced nutrition with nitrogen for growth, phosphorus for root development, and potassium for fruit quality.',
    dateAdded: '2024-01-20'
  },
  {
    id: '5',
    name: 'California Almonds',
    category: ProductCategory.CROPS,
    price: 12,
    unit: 'lb',
    stock: 500,
    sellerId: 'f3',
    sellerName: 'Golden State Orchard',
    sellerType: 'FARMER',
    sellerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&h=100&auto=format&fit=crop',
    sellerJoinDate: 'Aug 2021',
    isVerified: false,
    image: 'https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?q=80&w=600&h=450&auto=format&fit=crop',
    rating: 4.7,
    reviewCount: 15,
    location: 'Fresno, USA',
    country: 'United States',
    description: 'High quality raw almonds from Central Valley.',
    dateAdded: '2024-03-08'
  }
];
