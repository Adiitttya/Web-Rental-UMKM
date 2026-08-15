import catalogRaw from './game-catalog.json';

export interface CatalogDevice {
  id: string;
  name: string;
  listGameCategory: 'playstation' | 'nintendo' | 'logitech';
  branch?: string;
  games: string[];
}

export const gameCatalogData: CatalogDevice[] = catalogRaw as CatalogDevice[];

export const getDevicesByCategory = (category: 'playstation' | 'nintendo' | 'logitech'): CatalogDevice[] => {
  return gameCatalogData.filter((d) => d.listGameCategory === category);
};

// Helper function to pick a game cover image or gradient style based on game title
export const getGameCover = (title: string, category: string): { image?: string; gradient: string } => {
  const lower = title.toLowerCase();
  
  if (lower.includes('forza')) {
    return { image: '/GameCover/ForzaHorizon5.jpg', gradient: 'from-amber-500 to-red-600' };
  }
  if (lower.includes('gta') || lower.includes('grand theft auto')) {
    return { image: '/GameCover/GrandTheftAutoV.jpg', gradient: 'from-emerald-600 to-teal-800' };
  }
  if (lower.includes('takes two')) {
    return { image: '/GameCover/ItTakesTwo.jpg', gradient: 'from-orange-400 to-amber-600' };
  }
  if (lower.includes('minecraft')) {
    return { image: '/GameCover/Minecraft.jpg', gradient: 'from-green-600 to-emerald-800' };
  }
  if (lower.includes('spider')) {
    return { image: '/GameCover/Spiderman.jpg', gradient: 'from-red-600 to-blue-700' };
  }
  
  // Custom themed gradients based on game title keywords
  if (lower.includes('fifa') || lower.includes('fc 2') || lower.includes('pes') || lower.includes('efootball') || lower.includes('patch')) {
    return { gradient: 'from-blue-600 via-indigo-600 to-purple-700' };
  }
  if (lower.includes('mario') || lower.includes('nintendo') || lower.includes('zelda') || lower.includes('pokemon')) {
    return { gradient: 'from-red-500 via-rose-600 to-orange-500' };
  }
  if (lower.includes('tekken') || lower.includes('mortal') || lower.includes('street fighter') || lower.includes('ufc')) {
    return { gradient: 'from-red-700 via-rose-800 to-amber-900' };
  }
  if (lower.includes('gran turismo') || lower.includes('assetto') || lower.includes('f1') || lower.includes('nascar') || lower.includes('need for speed')) {
    return { gradient: 'from-yellow-500 via-amber-600 to-red-600' };
  }
  
  // Default gradients by category
  if (category === 'nintendo') {
    return { gradient: 'from-red-600 to-rose-700' };
  } else if (category === 'logitech') {
    return { gradient: 'from-lime-500 to-emerald-600' };
  }
  return { gradient: 'from-blue-700 to-indigo-900' };
};
