import React from 'react';
import { CountryInfo } from '../types';

const destinations: CountryInfo[] = [
  {
    name: "Canada",
    flagEmoji: "🇨🇦",
    image: "https://picsum.photos/600/400?random=1",
    popularDegrees: ["Computer Science", "Health Sciences", "Business"],
    avgCost: "$15,000 - $30,000 / year",
    visaDifficulty: "Moderate"
  },
  {
    name: "United States",
    flagEmoji: "🇺🇸",
    image: "https://picsum.photos/600/400?random=2",
    popularDegrees: ["STEM", "MBA", "Liberal Arts"],
    avgCost: "$25,000 - $50,000 / year",
    visaDifficulty: "Hard"
  },
  {
    name: "China",
    flagEmoji: "🇨🇳",
    image: "https://picsum.photos/600/400?random=3",
    popularDegrees: ["Engineering", "Medicine", "Language"],
    avgCost: "$3,000 - $7,000 / year",
    visaDifficulty: "Easy"
  },
  {
    name: "United Kingdom",
    flagEmoji: "🇬🇧",
    image: "https://picsum.photos/600/400?random=4",
    popularDegrees: ["Law", "Finance", "Art & Design"],
    avgCost: "£12,000 - £25,000 / year",
    visaDifficulty: "Moderate"
  }
];

export const Destinations: React.FC = () => {
  return (
    <div className="py-16 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Popular Destinations for Rwandans</h2>
          <p className="text-slate-600 mt-2">Explore top countries where our students thrive.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map((country) => (
            <div key={country.name} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:-translate-y-2 transition-transform duration-300 group">
              <div className="h-40 overflow-hidden relative">
                <img 
                  src={country.image} 
                  alt={country.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2 text-3xl filter drop-shadow-md">
                  {country.flagEmoji}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-slate-900 mb-3">{country.name}</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Avg Cost:</span>
                    <span className="font-medium text-slate-700">{country.avgCost}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-slate-500">Visa Process:</span>
                     <span className={`font-medium px-2 py-0.5 rounded text-xs ${
                       country.visaDifficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                       country.visaDifficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                       'bg-red-100 text-red-800'
                     }`}>
                       {country.visaDifficulty}
                     </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400 mb-2 uppercase font-semibold tracking-wider">Popular Degrees</p>
                  <div className="flex flex-wrap gap-2">
                    {country.popularDegrees.map(deg => (
                      <span key={deg} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                        {deg}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};