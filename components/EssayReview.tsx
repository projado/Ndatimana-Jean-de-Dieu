
import React, { useState } from 'react';
import { FileText, AlertTriangle, CheckCircle, Sparkles, RefreshCw, BarChart3, ThumbsUp, ThumbsDown, Bot, Heart } from 'lucide-react';
import { Button } from './Button';
import { analyzeEssay } from '../services/geminiService';
import { EssayAnalysis } from '../types';

export const EssayReview: React.FC = () => {
  const [essay, setEssay] = useState('');
  const [analysis, setAnalysis] = useState<EssayAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!essay.trim() || essay.length < 100) {
      setError('Please enter at least 100 characters for a meaningful analysis.');
      return;
    }
    setError('');
    setLoading(true);
    setAnalysis(null);

    try {
      const result = await analyzeEssay(essay);
      if (result) {
        setAnalysis(result);
      } else {
        setError('Could not analyze the essay. Please try again.');
      }
    } catch (e) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
           <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full mb-4">
             <FileText size={32} />
           </div>
           <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Smart Essay Review & Detector</h2>
           <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
             Get instant feedback on your Personal Statement. Our AI checks for tone, structure, and also estimates if your essay sounds too "robotic" or AI-generated.
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Input Section */}
           <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col h-full">
              <label className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex justify-between items-center">
                <span>Paste your essay below</span>
                <span className={`text-xs ${essay.length < 100 ? 'text-red-500' : 'text-slate-400'}`}>
                   {essay.length} chars
                </span>
              </label>
              <textarea
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                placeholder="Paste your Personal Statement or Common App essay here..."
                className="flex-1 min-h-[400px] p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none text-slate-800 dark:text-slate-200 resize-none font-serif text-lg leading-relaxed"
              />
              
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleAnalyze} 
                  disabled={loading || !essay.trim()}
                  className="bg-purple-700 hover:bg-purple-800 border-none text-white w-full md:w-auto"
                >
                  {loading ? 'Analyzing...' : 'Review My Essay'}
                </Button>
              </div>
           </div>

           {/* Results Section */}
           <div className="flex flex-col gap-6">
             {loading && (
               <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 shadow-lg border border-slate-200 dark:border-slate-700 h-full flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-6"></div>
                 <h3 className="text-xl font-bold text-slate-800 dark:text-white">Analyzing Structure & Tone...</h3>
                 <p className="text-slate-500 dark:text-slate-400 mt-2">Checking for AI patterns and narrative flow.</p>
               </div>
             )}

             {!loading && !analysis && (
               <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-dashed border-slate-300 dark:border-slate-700 h-full flex flex-col items-center justify-center text-center opacity-70">
                  <BarChart3 size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Analysis results will appear here.</p>
               </div>
             )}

             {analysis && (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  {/* Scores Card */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl text-center border border-slate-100 dark:border-slate-700">
                           <p className="text-xs font-bold uppercase text-slate-500 mb-1">Overall Score</p>
                           <div className={`text-4xl font-extrabold ${
                             analysis.overallScore >= 8 ? 'text-green-500' : analysis.overallScore >= 5 ? 'text-amber-500' : 'text-red-500'
                           }`}>
                             {analysis.overallScore}/10
                           </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl text-center border border-slate-100 dark:border-slate-700">
                           <p className="text-xs font-bold uppercase text-slate-500 mb-1 flex items-center justify-center gap-1"><Bot size={12}/> AI Likelihood</p>
                           <div className={`text-4xl font-extrabold ${
                             analysis.aiProbability < 30 ? 'text-green-500' : analysis.aiProbability < 70 ? 'text-amber-500' : 'text-red-500'
                           }`}>
                             {analysis.aiProbability}%
                           </div>
                           <p className="text-[10px] text-slate-400 mt-1">Estimated Probability</p>
                        </div>
                     </div>
                     <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Tone Detected: <span className="font-normal text-purple-600 dark:text-purple-400">{analysis.tone}</span></p>
                     </div>
                  </div>

                  {/* Humanize Tip Card */}
                  {analysis.humanizeTip && (
                    <div className="bg-pink-50 dark:bg-pink-900/20 rounded-2xl p-6 shadow-sm border border-pink-100 dark:border-pink-800/50">
                       <h4 className="font-bold text-pink-700 dark:text-pink-300 flex items-center gap-2 mb-2">
                         <Heart size={18} className="fill-current" /> Humanize Your Story
                       </h4>
                       <p className="text-sm text-slate-700 dark:text-slate-300 italic">
                         "{analysis.humanizeTip}"
                       </p>
                    </div>
                  )}

                  {/* Feedback */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                     <div>
                        <h4 className="font-bold text-green-600 flex items-center gap-2 mb-3"><ThumbsUp size={18} /> Strengths</h4>
                        <ul className="space-y-2">
                           {analysis.strengths.map((s, i) => (
                             <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                               <CheckCircle size={14} className="mt-1 text-green-500 shrink-0" /> {s}
                             </li>
                           ))}
                        </ul>
                     </div>
                     
                     <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
                        <h4 className="font-bold text-amber-600 flex items-center gap-2 mb-3"><ThumbsDown size={18} /> Areas for Improvement</h4>
                        <ul className="space-y-2">
                           {analysis.weaknesses.map((w, i) => (
                             <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                               <AlertTriangle size={14} className="mt-1 text-amber-500 shrink-0" /> {w}
                             </li>
                           ))}
                        </ul>
                     </div>
                  </div>

                  {/* Suggestions & Improvement */}
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-slate-700">
                     <h4 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2"><Sparkles size={18} className="text-purple-500"/> Consultant's Advice</h4>
                     <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                        {analysis.suggestions}
                     </p>

                     <div className="bg-white dark:bg-slate-950 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase text-purple-600 dark:text-purple-400">
                           <RefreshCw size={12} /> Improvement Example
                        </div>
                        <p className="text-sm font-serif italic text-slate-700 dark:text-slate-300">
                           "{analysis.improvedSnippet}"
                        </p>
                     </div>
                  </div>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};
