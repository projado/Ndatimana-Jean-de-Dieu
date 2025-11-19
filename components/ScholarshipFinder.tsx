import React, { useState, useMemo } from 'react';
import { Search, GraduationCap, MapPin, BookOpen, Calendar, DollarSign, Filter, ExternalLink } from 'lucide-react';
import { findScholarshipsAI } from '../services/geminiService';
import { Scholarship } from '../types';
import { Button } from './Button';

export const ScholarshipFinder: React.FC = () => {
  const [formData, setFormData] = useState({
    field: '',
    level: 'Master\'s',
    country: ''
  });
  const [results, setResults] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Filter States
  const [filterType, setFilterType] = useState<string>('All');
  const [filterCountry, setFilterCountry] = useState<string>('All');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);
    setHasSearched(true);
    // Reset filters on new search
    setFilterType('All');
    setFilterCountry('All');
    
    const data = await findScholarshipsAI(formData.field, formData.level, formData.country);
    setResults(data);
    setLoading(false);
  };

  // Calculate available countries from actual results
  const availableCountries = useMemo(() => {
    const countries = new Set(results.map(r => r.country).filter(Boolean));
    return Array.from(countries).sort();
  }, [results]);

  // Filter logic
  const filteredResults = results.filter(item => {
    const matchesType = filterType === 'All' || item.fundingType === filterType;
    const matchesCountry = filterCountry === 'All' || item.country === filterCountry;
    return matchesType && matchesCountry;
  });

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Smart Scholarship Finder</h2>
        <p className="text-slate-600 dark:text-slate-400">Tell us what you want to study, and our AI will scan opportunities suitable for Rwandan students.</p>
      </div>

      {/* Search Form - Now more colorful */}
      <form onSubmit={handleSearch} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border-t-4 border-indigo-600 mb-10 relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-bl-full -z-0"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <BookOpen size={16} className="text-indigo-600 dark:text-indigo-400" /> Field of Study
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Public Health, Engineering"
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:outline-none transition-all"
              value={formData.field}
              onChange={(e) => setFormData({ ...formData, field: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <GraduationCap size={16} className="text-indigo-600 dark:text-indigo-400" /> Degree Level
            </label>
            <select
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:outline-none transition-all"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            >
              <option>Bachelor's</option>
              <option>Master's</option>
              <option>PhD</option>
              <option>Short Course</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <MapPin size={16} className="text-indigo-600 dark:text-indigo-400" /> Preferred Country
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Canada, China, UK"
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 focus:outline-none transition-all"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end relative z-10">
          <Button type="submit" isLoading={loading} className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 border-none text-white">
            <Search size={18} /> Find Scholarships
          </Button>
        </div>
      </form>

      {/* Filters Bar */}
      {results.length > 0 && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between animate-in fade-in slide-in-from-top-4 shadow-sm transition-colors duration-300">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <Filter size={18} />
            </div>
            <span>Refine Results:</span>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
             <div className="relative w-full sm:w-48">
               <select
                 value={filterType}
                 onChange={(e) => setFilterType(e.target.value)}
                 className="w-full p-2.5 pl-3 pr-8 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-white text-sm focus:ring-2 focus:ring-indigo-600 outline-none cursor-pointer hover:border-indigo-300 transition-colors"
               >
                 <option value="All">All Funding Types</option>
                 <option value="Full">Full Funding</option>
                 <option value="Partial">Partial Funding</option>
               </select>
             </div>

             <div className="relative w-full sm:w-48">
               <select
                 value={filterCountry}
                 onChange={(e) => setFilterCountry(e.target.value)}
                 className="w-full p-2.5 pl-3 pr-8 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-white text-sm focus:ring-2 focus:ring-indigo-600 outline-none cursor-pointer hover:border-indigo-300 transition-colors"
               >
                 <option value="All">All Countries</option>
                 {availableCountries.map(c => (
                   <option key={c} value={c}>{c}</option>
                 ))}
               </select>
             </div>
          </div>
        </div>
      )}

      {/* Results Grid - Colorful Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResults.map((item, idx) => {
          const isFull = item.fundingType === 'Full';
          return (
            <div key={idx} className={`rounded-xl p-6 shadow-sm hover:shadow-xl transition-all border-2 flex flex-col h-full relative overflow-hidden group ${
              isFull 
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/50 hover:border-amber-300' 
                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
            }`}>
              {/* Decorative Blob */}
              <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-20 ${isFull ? 'bg-amber-400' : 'bg-blue-400'}`}></div>

              <div className="flex justify-between items-start mb-3 relative z-10">
                <h3 className={`text-xl font-bold flex-1 mr-2 leading-tight ${isFull ? 'text-amber-900 dark:text-amber-400' : 'text-slate-800 dark:text-white'}`}>
                  {item.name}
                </h3>
              </div>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                <span className={`text-xs font-bold px-2 py-1 rounded-md border ${
                  isFull 
                    ? 'bg-white dark:bg-amber-900/50 text-amber-700 dark:text-amber-200 border-amber-200 dark:border-amber-800 shadow-sm' 
                    : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800'
                }`}>
                  {item.fundingType} Funding
                </span>
                <span className="text-xs font-bold px-2 py-1 rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <MapPin size={12} /> {item.country}
                </span>
              </div>

              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 flex-1 relative z-10">
                <div className="flex items-start gap-2">
                  <div className={`p-1 rounded-full ${isFull ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400' : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'}`}>
                    <DollarSign size={14} />
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{item.amount}</span>
                </div>
                <div className="flex items-start gap-2">
                   <div className={`p-1 rounded-full ${isFull ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400' : 'bg-orange-100 dark:bg-orange-900/50 text-orange-500 dark:text-orange-400'}`}>
                    <Calendar size={14} />
                  </div>
                  <span>Deadline: {item.deadline}</span>
                </div>
                <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-3 mt-3">
                  <p className="font-semibold text-slate-900 dark:text-white mb-1">Key Requirements:</p>
                  <ul className="list-none space-y-1.5 text-slate-500 dark:text-slate-400 text-xs">
                    {item.requirements.slice(0, 3).map((req, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2">
                         <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isFull ? 'bg-amber-500' : 'bg-blue-400'}`}></span>
                         {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              {item.link ? (
                <a 
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-4 w-full py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
                    isFull 
                      ? 'bg-amber-200 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 hover:bg-amber-300 dark:hover:bg-amber-900/60' 
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  Apply Now <ExternalLink size={14} />
                </a>
              ) : (
                <button 
                  disabled 
                  className={`mt-4 w-full py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors opacity-50 cursor-not-allowed ${
                    isFull 
                      ? 'bg-amber-200 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200' 
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200'
                  }`}
                >
                  Apply Now <ExternalLink size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {!loading && hasSearched && filteredResults.length === 0 && (
        <div className="text-center text-slate-500 dark:text-slate-400 py-16 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 border-dashed">
          <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500">
            <Search size={32} />
          </div>
          {results.length > 0 ? (
            <>
              <p className="text-lg font-medium text-slate-700 dark:text-slate-200">No matches for these filters.</p>
              <p className="text-sm mt-1">Try changing the filter settings above.</p>
            </>
          ) : (
             <p>No scholarships found. Try broadening your search terms.</p>
          )}
        </div>
      )}
    </div>
  );
};