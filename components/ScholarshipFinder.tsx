import React, { useState } from 'react';
import { Search, GraduationCap, MapPin, BookOpen, Calendar, DollarSign } from 'lucide-react';
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);
    setHasSearched(true);
    
    const data = await findScholarshipsAI(formData.field, formData.level, formData.country);
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Smart Scholarship Finder</h2>
        <p className="text-slate-600">Tell us what you want to study, and our AI will scan opportunities suitable for Rwandan students.</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <BookOpen size={16} /> Field of Study
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Public Health, Engineering"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={formData.field}
              onChange={(e) => setFormData({ ...formData, field: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <GraduationCap size={16} /> Degree Level
            </label>
            <select
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              <MapPin size={16} /> Preferred Country
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Canada, China, UK"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border border-slate-100">
            <h3 className="text-xl font-bold text-blue-900 mb-2">{item.name}</h3>
            <div className="space-y-3 text-sm text-slate-600">
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
                <ul className="list-disc list-inside space-y-1 text-slate-500">
                  {item.requirements.slice(0, 3).map((req, rIdx) => (
                    <li key={rIdx}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && hasSearched && results.length === 0 && (
        <div className="text-center text-slate-500 py-10">
          No scholarships found specifically for those criteria. Try broadening your search terms.
        </div>
      )}
    </div>
  );
};