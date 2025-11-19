import React, { useState } from 'react';
import { CountryInfo, VisaDetails } from '../types';
import { FileText, Clock, DollarSign, ArrowRight, Search, MapPin, AlertCircle, CheckCircle2, Building2, Thermometer } from 'lucide-react';
import { findVisaRequirementsAI } from '../services/geminiService';
import { Button } from './Button';

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
  const [searchCountry, setSearchCountry] = useState('');
  const [visaDetails, setVisaDetails] = useState<VisaDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleVisaSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCountry.trim()) return;
    
    setLoading(true);
    setVisaDetails(null);
    setHasSearched(true);
    
    const details = await findVisaRequirementsAI(searchCountry);
    setVisaDetails(details);
    setLoading(false);
  };

  return (
    <div className="py-16 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Destinations & Visa Requirements</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Get detailed visa checklists for Rwandan citizens for any country.</p>
        </div>

        {/* Visa Checker Tool */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 md:p-10 mb-16 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
             <div className="text-center mb-8">
               <div className="inline-flex items-center justify-center p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full mb-4">
                 <FileText size={24} />
               </div>
               <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Check Visa Requirements</h3>
               <p className="text-slate-500 dark:text-slate-400">Enter a country name to generate a tailored checklist for Rwandan applicants.</p>
             </div>

             <form onSubmit={handleVisaSearch} className="flex gap-3 mb-8">
               <input 
                 type="text" 
                 value={searchCountry}
                 onChange={(e) => setSearchCountry(e.target.value)}
                 placeholder="e.g., Poland, South Korea, Germany" 
                 className="flex-1 p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-600 outline-none"
               />
               <Button type="submit" isLoading={loading} className="bg-indigo-600 hover:bg-indigo-700 border-none rounded-xl px-8">
                 Check
               </Button>
             </form>

             {loading && (
               <div className="space-y-4 animate-pulse">
                 <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mx-auto"></div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                 </div>
                 <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded"></div>
               </div>
             )}

             {visaDetails && !loading && (
               <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4">
                 <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
                   <h4 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                     <MapPin className="text-red-500" /> Visa for {visaDetails.country}
                   </h4>
                   <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-4 py-1.5 rounded-full text-sm font-bold">
                     {visaDetails.visaType}
                   </span>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-100 dark:border-slate-600 shadow-sm">
                       <div className="text-sm text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1"><DollarSign size={14}/> Application Fee</div>
                       <div className="font-bold text-slate-800 dark:text-white">{visaDetails.applicationFee}</div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-100 dark:border-slate-600 shadow-sm">
                       <div className="text-sm text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1"><Clock size={14}/> Processing Time</div>
                       <div className="font-bold text-slate-800 dark:text-white">{visaDetails.processingTime}</div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-100 dark:border-slate-600 shadow-sm">
                       <div className="text-sm text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1"><Building2 size={14}/> Embassy/VAC</div>
                       <div className="font-bold text-slate-800 dark:text-white text-sm">{visaDetails.embassyLocation}</div>
                    </div>
                 </div>

                 <div className="space-y-6">
                   <div>
                     <h5 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                       <DollarSign size={18} className="text-emerald-500" /> Financial Requirements (Proof of Funds)
                     </h5>
                     <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/50 p-4 rounded-lg text-emerald-900 dark:text-emerald-200 text-sm">
                       {visaDetails.financialRequirements}
                     </div>
                   </div>

                   <div>
                     <h5 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                       <CheckCircle2 size={18} className="text-blue-500" /> Required Documents Checklist
                     </h5>
                     <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                       {visaDetails.documents.map((doc, idx) => (
                         <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-3 rounded border border-slate-100 dark:border-slate-700">
                           <div className="mt-0.5 w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-500 flex-shrink-0"></div>
                           {doc}
                         </li>
                       ))}
                     </ul>
                   </div>

                   <div>
                     <h5 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                       <Thermometer size={18} className="text-orange-500" /> Health & Medical
                     </h5>
                     <p className="text-sm text-slate-600 dark:text-slate-300">
                       {visaDetails.healthRequirements}
                     </p>
                   </div>
                 </div>
               </div>
             )}

             {hasSearched && !loading && !visaDetails && (
                <div className="text-center text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                   Could not retrieve visa details at this moment. Please try again.
                </div>
             )}
          </div>
        </div>

        {/* Static Popular Destinations */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 pl-2 border-l-4 border-indigo-600">Popular Destinations Overview</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {destinations.map((country) => (
            <div key={country.name} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row hover:shadow-2xl transition-all duration-300 border border-slate-100 dark:border-slate-700 group">
              <div className="md:w-2/5 h-48 md:h-auto relative overflow-hidden">
                <img 
                  src={country.image} 
                  alt={country.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-0 left-0 bg-black/50 text-white px-3 py-1 rounded-br-lg backdrop-blur-sm font-bold">
                   {country.flagEmoji} {country.name}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{country.name}</h3>
                   <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                       country.visaDifficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' :
                       country.visaDifficulty === 'Moderate' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                       'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
                     }`}>
                       {country.visaDifficulty} Visa
                   </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="bg-slate-50 dark:bg-slate-700 p-2 rounded-lg border border-slate-100 dark:border-slate-600">
                    <div className="text-slate-400 dark:text-slate-400 text-xs flex items-center gap-1 mb-1"><FileText size={12}/> Visa Type</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">{country.visaType}</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700 p-2 rounded-lg border border-slate-100 dark:border-slate-600">
                    <div className="text-slate-400 dark:text-slate-400 text-xs flex items-center gap-1 mb-1"><Clock size={12}/> Timeline</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{country.processingTime}</div>
                  </div>
                  <div className="col-span-2 bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                     <div className="text-indigo-400 dark:text-indigo-300 text-xs flex items-center gap-1 mb-1"><DollarSign size={12}/> Proof of Funds (Approx)</div>
                     <div className="font-semibold text-indigo-700 dark:text-indigo-300">{country.proofOfFunds}</div>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 pt-3 mt-auto">
                  <p className="text-xs text-slate-400 mb-2 uppercase font-semibold tracking-wider">Popular Majors</p>
                  <div className="flex flex-wrap gap-2">
                    {country.popularDegrees.map(deg => (
                      <span key={deg} className="text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md font-medium hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-default">
                        {deg}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 pt-2">
                    <button 
                        onClick={() => {
                            setSearchCountry(country.name);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-sm font-bold text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex items-center gap-1 transition-colors w-full text-left"
                    >
                        View Full Requirements <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};