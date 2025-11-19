import React from 'react';
import { CountryInfo } from '../types';
import { FileText, Clock, DollarSign, CheckCircle } from 'lucide-react';

const destinations: CountryInfo[] = [
  {
    name: "Canada",
    flagEmoji: "🇨🇦",
    image: "https://picsum.photos/600/400?random=1",
    popularDegrees: ["Computer Science", "Health Sciences", "Business"],
    avgCost: "$15,000 - $30,000 / year",
    visaDifficulty: "Moderate",
    visaType: "Study Permit",
    processingTime: "8-12 Weeks",
    proofOfFunds: "$20,635 + Tuition (CAD)"
  },
  {
    name: "United States",
    flagEmoji: "🇺🇸",
    image: "https://picsum.photos/600/400?random=2",
    popularDegrees: ["STEM", "MBA", "Liberal Arts"],
    avgCost: "$25,000 - $50,000 / year",
    visaDifficulty: "Hard",
    visaType: "F-1 Student Visa",
    processingTime: "3-5 Weeks (Interview)",
    proofOfFunds: "1 Year Full Expenses (USD)"
  },
  {
    name: "China",
    flagEmoji: "🇨🇳",
    image: "https://picsum.photos/600/400?random=3",
    popularDegrees: ["Engineering", "Medicine", "Language"],
    avgCost: "$3,000 - $7,000 / year",
    visaDifficulty: "Easy",
    visaType: "X1 Visa (>180 days)",
    processingTime: "4-7 Days",
    proofOfFunds: "~$2,500 Bank Statement"
  },
  {
    name: "United Kingdom",
    flagEmoji: "🇬🇧",
    image: "https://picsum.photos/600/400?random=4",
    popularDegrees: ["Law", "Finance", "Art & Design"],
    avgCost: "£12,000 - £25,000 / year",
    visaDifficulty: "Moderate",
    visaType: "Student Visa",
    processingTime: "3 Weeks",
    proofOfFunds: "£1,334/month (London)"
  }
];

export const Destinations: React.FC = () => {
  return (
    <div className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Popular Destinations & Visa Intel</h2>
          <p className="text-slate-600 mt-2">Comprehensive data for Rwandan applicants.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {destinations.map((country) => (
            <div key={country.name} className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row hover:shadow-2xl transition-shadow duration-300 border border-slate-100">
              <div className="md:w-2/5 h-48 md:h-auto relative">
                <img 
                  src={country.image} 
                  alt={country.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 left-0 bg-black/50 text-white px-3 py-1 rounded-br-lg backdrop-blur-sm">
                   {country.flagEmoji} {country.name}
                </div>
              </div>
              
              <div className="p-6 flex-1">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-xl font-bold text-red-900">{country.name}</h3>
                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                       country.visaDifficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                       country.visaDifficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                       'bg-red-100 text-red-800'
                     }`}>
                       {country.visaDifficulty} Visa
                   </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="bg-slate-50 p-2 rounded border border-slate-100">
                    <div className="text-slate-400 text-xs flex items-center gap-1"><FileText size={12}/> Visa Type</div>
                    <div className="font-semibold text-slate-800">{country.visaType}</div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-100">
                    <div className="text-slate-400 text-xs flex items-center gap-1"><Clock size={12}/> Timeline</div>
                    <div className="font-semibold text-slate-800">{country.processingTime}</div>
                  </div>
                  <div className="col-span-2 bg-slate-50 p-2 rounded border border-slate-100">
                     <div className="text-slate-400 text-xs flex items-center gap-1"><DollarSign size={12}/> Proof of Funds (Approx)</div>
                     <div className="font-semibold text-emerald-700">{country.proofOfFunds}</div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <p className="text-xs text-slate-400 mb-2 uppercase font-semibold tracking-wider">Popular Majors</p>
                  <div className="flex flex-wrap gap-2">
                    {country.popularDegrees.map(deg => (
                      <span key={deg} className="text-xs bg-red-50 text-red-800 px-2 py-1 rounded-md font-medium">
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