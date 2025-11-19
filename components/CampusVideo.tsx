import React, { useState, useEffect } from 'react';
import { Video, Loader2, Sparkles, AlertCircle, Play } from 'lucide-react';
import { Button } from './Button';
import { generateCampusVideo } from '../services/geminiService';

export const CampusVideo: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Check if API key is available
  const checkKey = async () => {
    if ((window as any).aistudio) {
      const has = await (window as any).aistudio.hasSelectedApiKey();
      setHasKey(has);
    } else {
      // In development or other environments, assume key is available via env
      setHasKey(true);
    }
  };

  useEffect(() => {
    checkKey();
  }, []);

  const handleConnect = async () => {
    if ((window as any).aistudio) {
      await (window as any).aistudio.openSelectKey();
      await checkKey();
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    setVideoUrl(null);
    
    const loadingMessages = [
      "Initializing AI video engine...",
      "Designing the campus architecture...",
      "Adding atmospheric details...",
      "Rendering student life...",
      "Polishing final video frames...",
      "Almost there..."
    ];
    
    let msgIdx = 0;
    setStatusMessage(loadingMessages[0]);
    
    const msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingMessages.length;
      setStatusMessage(loadingMessages[msgIdx]);
    }, 4000);

    try {
      const url = await generateCampusVideo(prompt);
      
      if (url) {
        setVideoUrl(url);
      } else {
        setError("Unable to generate video at this time. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      if (err.toString().includes("Requested entity was not found") || err.status === 404) {
        setHasKey(false);
        setError("API Key session expired. Please reconnect your Google Account.");
      } else {
        setError("An error occurred: " + (err.message || "Unknown error"));
      }
    } finally {
      clearInterval(msgInterval);
      setLoading(false);
    }
  };

  return (
    <div className="py-16 bg-gradient-to-b from-white to-indigo-50 dark:from-slate-900 dark:to-black transition-colors duration-300 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full mb-4">
            <Video size={32} />
          </div>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">AI Campus Preview</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Visualize your dream university. Describe the campus, and our AI will generate a short cinematic preview of what your future could look like.
          </p>
        </div>

        {!hasKey ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center shadow-xl border border-slate-200 dark:border-slate-700">
             <Sparkles className="w-16 h-16 text-amber-400 mx-auto mb-6" />
             <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Unlock AI Video Generation</h3>
             <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
               To generate high-quality videos using the Veo model, you need to connect your Google Cloud project billing or select an API key.
             </p>
             <div className="flex flex-col gap-4 items-center">
               <Button onClick={handleConnect} className="bg-indigo-600 hover:bg-indigo-700 border-none px-8 py-4 text-lg">
                 Connect Google Account
               </Button>
               <a 
                 href="https://ai.google.dev/gemini-api/docs/billing" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
               >
                 Learn more about billing & API keys
               </a>
             </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden relative">
            {/* Abstract BG */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            
            <div className="p-8 md:p-12">
              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Describe the scene you want to see
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A futuristic glass library at a university in Singapore with students studying on a sunny day..."
                  className="w-full p-4 h-32 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none text-slate-900 dark:text-white resize-none text-lg"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 rounded-xl flex items-center gap-3">
                  <AlertCircle size={20} />
                  <p>{error}</p>
                </div>
              )}

              {!loading && !videoUrl && (
                <div className="flex justify-end">
                  <Button 
                    onClick={handleGenerate} 
                    disabled={!prompt.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 border-none px-8 py-3 text-lg gap-3"
                  >
                    <Sparkles size={20} /> Generate Preview
                  </Button>
                </div>
              )}

              {loading && (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                     <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                     <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                     <Video className="absolute inset-0 m-auto text-indigo-600" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Generating Video</h3>
                  <p className="text-indigo-600 dark:text-indigo-400 animate-pulse">{statusMessage}</p>
                  <p className="text-xs text-slate-400 mt-4">This typically takes 1-2 minutes</p>
                </div>
              )}

              {videoUrl && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
                  <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg relative group">
                    <video 
                      src={videoUrl} 
                      controls 
                      autoPlay 
                      loop 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="mt-6 flex justify-between items-center">
                     <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                       Generated with Veo • {prompt.substring(0, 50)}...
                     </p>
                     <Button 
                       variant="outline" 
                       onClick={() => setVideoUrl(null)}
                       className="text-sm"
                     >
                       Generate Another
                     </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};