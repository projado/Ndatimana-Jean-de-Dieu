import React, { useState, useMemo } from 'react';
import { Search, GraduationCap, MapPin, BookOpen, Calendar, DollarSign, Filter } from 'lucide-react';
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
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Smart Scholarship Finder</h2>
        <p className="text-slate-600">Tell us what you want to study, and our AI will scan opportunities suitable for Rwandan students.</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-red-800 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <BookOpen size={16} className="text-red-800" /> Field of Study
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Public Health, Engineering"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:outline-none transition-all"
              value={formData.field}
              onChange={(e) => setFormData({ ...formData, field: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <GraduationCap size={16} className="text-red-800" /> Degree Level
            </label>
            <select
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:outline-none transition-all"
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
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <MapPin size={16} className="text-red-800" /> Preferred Country
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Canada, China, UK"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:outline-none transition-all"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" isLoading={loading} className="w-full md:w-auto">
            <Search size={18} /> Find Scholarships
          </Button>
        </div>
      </form>

      {/* Filters Bar - Shown only when results exist */}
      {results.length > 0 && (
        <div className="bg-red-50/50 border border-red-100 p-4 rounded-xl mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2 text-red-900 font-semibold">
            <Filter size={20} />
            <span>Refine Results:</span>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
             <div className="relative w-full sm:w-48">
               <select
                 value={filterType}
                 onChange={(e) => setFilterType(e.target.value)}
                 className="w-full p-2.5 pl-3 pr-8 rounded-lg border border-red-200 bg-white text-slate-700 text-sm focus:ring-2 focus:ring-red-800 outline-none appearance-none cursor-pointer hover:border-red-300 transition-colors"
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
                 className="w-full p-2.5 pl-3 pr-8 rounded-lg border border-red-200 bg-white text-slate-700 text-sm focus:ring-2 focus:ring-red-800 outline-none appearance-none cursor-pointer hover:border-red-300 transition-colors"
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

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResults.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border border-slate-100 border-l-4 border-l-red-800 flex flex-col h-full">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-red-900 flex-1 mr-2">{item.name}</h3>
            </div>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${item.fundingType === 'Full' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {item.fundingType} Funding
              </span>
              <span className="text-xs font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-700 flex items-center gap-1">
                <MapPin size={12} /> {item.country}
              </span>
            </div>

            <div className="space-y-3 text-sm text-slate-600 flex-1">
              <div className="flex items-start gap-2">
                <DollarSign className="text-emerald-600 shrink-0" size={18} />
                <span className="font-medium text-emerald-700">{item.amount}</span>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="text-orange-500 shrink-0" size={18} />
                <span>Deadline: {item.deadline}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 mt-3">
                <p className="font-semibold text-slate-900 mb-1">Key Requirements:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-500 text-xs">
                  {item.requirements.slice(0, 3).map((req, rIdx) => (
                    <li key={rIdx}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && hasSearched && filteredResults.length === 0 && (
        <div className="text-center text-slate-500 py-10 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
          {results.length > 0 ? (
            <>
              <p className="text-lg font-medium text-slate-700">No matches for these filters.</p>
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