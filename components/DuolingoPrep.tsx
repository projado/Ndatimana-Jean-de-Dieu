
import React, { useState, useEffect, useRef } from 'react';
import { Bird, Check, X, Clock, Loader2, ArrowRight, Camera, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { generateDuolingoSet } from '../services/geminiService';
import { DuolingoQuestion } from '../types';

const DET_ORANGE = "bg-[#ff9600]";
const DET_BLUE = "bg-[#1cb0f6]";

export const DuolingoPrep: React.FC = () => {
  const [questions, setQuestions] = useState<DuolingoQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  
  // Interaction State
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [cTestInputs, setCTestInputs] = useState<Record<number, string>>({});
  const [writingInput, setWritingInput] = useState('');
  const [score, setScore] = useState(0);

  // C-Test processed data
  const [cTestParts, setCTestParts] = useState<(string | { index: number, hidden: string, hint: string })[]>([]);

  useEffect(() => {
    let timer: any;
    if (started && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [started, timeLeft]);

  const startPractice = async () => {
    setLoading(true);
    setStarted(false);
    setScore(0);
    setCurrentIdx(0);
    setQuestions([]);
    
    const qs = await generateDuolingoSet();
    setQuestions(qs);
    setLoading(false);
    
    // Start first question logic
    if (qs.length > 0) {
        setStarted(true);
        initQuestion(qs[0]);
    }
  };

  const initQuestion = (q: DuolingoQuestion) => {
    setTimeLeft(q.timeLimit || 60);
    setSelectedWords(new Set());
    setWritingInput('');
    setCTestInputs({});
    
    if (q.type === 'read_complete' && q.passage) {
        processCTest(q.passage);
    }
  };

  const processCTest = (passage: string) => {
    // Basic C-Test Logic: First sentence intact. Subsequent sentences: damage every 2nd word.
    const sentences = passage.match(/[^.!?]+[.!?]+/g) || [passage];
    const parts: (string | { index: number, hidden: string, hint: string })[] = [];
    let inputCounter = 0;

    sentences.forEach((sent, sIdx) => {
        if (sIdx === 0) {
            parts.push(sent + " ");
        } else {
            const words = sent.split(' ');
            words.forEach((word, wIdx) => {
                if (wIdx % 2 !== 0 && word.length > 3) {
                    // Damage word
                    const cutPoint = Math.ceil(word.length / 2);
                    const hint = word.substring(0, cutPoint);
                    const hidden = word.substring(cutPoint);
                    // Handle punctuation
                    const punctuationMatch = hidden.match(/[.,!?]+$/);
                    const punctuation = punctuationMatch ? punctuationMatch[0] : "";
                    const cleanHidden = hidden.replace(/[.,!?]+$/, "");

                    parts.push({ index: inputCounter, hidden: cleanHidden, hint });
                    if (punctuation) parts.push(punctuation + " ");
                    else parts.push(" ");
                    inputCounter++;
                } else {
                    parts.push(word + " ");
                }
            });
        }
    });
    setCTestParts(parts);
  };

  const handleNext = () => {
    // Simple Score Calculation (Mock)
    const currentQ = questions[currentIdx];
    if (currentQ.type === 'read_select') {
        const correct = currentQ.words?.filter(w => w.isReal).map(w => w.text) || [];
        const selected = Array.from(selectedWords);
        // Correct hits
        const hits = selected.filter(w => correct.includes(w)).length;
        // False alarms
        const misses = selected.filter(w => !correct.includes(w)).length;
        setScore(s => s + (hits * 10) - (misses * 5));
    } else if (currentQ.type === 'read_complete') {
        // Count correct inputs
        let hits = 0;
        cTestParts.forEach(p => {
            if (typeof p !== 'string') {
                if ((cTestInputs[p.index] || '').toLowerCase() === p.hidden.toLowerCase()) {
                    hits++;
                }
            }
        });
        setScore(s => s + (hits * 10));
    } else if (currentQ.type === 'photo_writing') {
        const wordCount = writingInput.trim().split(/\s+/).length;
        if (wordCount > 30) setScore(s => s + 50);
        else setScore(s => s + wordCount);
    }

    if (currentIdx < questions.length - 1) {
        const nextIdx = currentIdx + 1;
        setCurrentIdx(nextIdx);
        initQuestion(questions[nextIdx]);
    } else {
        setStarted(false); // End
    }
  };

  // --- Views ---

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="text-center">
              <div className="w-16 h-16 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-xl font-bold text-slate-700 dark:text-slate-300">Preparing Test Session...</p>
              <p className="text-sm text-slate-500">Generating AI prompts and images</p>
          </div>
      </div>
    );
  }

  if (!started && questions.length > 0) {
     const estimatedScore = Math.max(10, Math.min(160, Math.round((score / 150) * 160)));
     return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-800 p-12 rounded-3xl shadow-2xl max-w-md w-full text-center border border-slate-200 dark:border-slate-700">
               <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Bird size={48} />
               </div>
               <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Estimated Score</h2>
               <div className="text-6xl font-extrabold text-slate-900 dark:text-white my-6 tracking-tighter">
                   {estimatedScore} <span className="text-lg text-slate-400 font-medium">/ 160</span>
               </div>
               <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-8">
                   <div className="h-full bg-orange-500" style={{ width: `${(estimatedScore/160)*100}%` }}></div>
               </div>
               <Button onClick={startPractice} className={`${DET_BLUE} hover:brightness-110 text-white w-full py-4 rounded-xl font-bold border-b-4 border-blue-700 active:border-b-0 active:translate-y-1`}>
                   Take Another Test
               </Button>
           </div>
        </div>
     );
  }

  if (!started && questions.length === 0) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 font-sans">
           <div className="max-w-2xl w-full text-center space-y-8">
               <div className="mb-8">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
                     Practice the <span className="text-[#1cb0f6]">Duolingo English Test</span>
                  </h1>
                  <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
                     Experience the official question types: Read and Select, C-Tests, and Photo Descriptions using real AI-generated images.
                  </p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                   <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm">
                       <div className="text-2xl mb-2">📝</div>
                       <h3 className="font-bold">Adaptive</h3>
                       <p className="text-sm text-slate-500">Questions get harder as you improve</p>
                   </div>
                   <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm">
                       <div className="text-2xl mb-2">📸</div>
                       <h3 className="font-bold">AI Visuals</h3>
                       <p className="text-sm text-slate-500">Unique photo prompts every time</p>
                   </div>
                   <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-sm">
                       <div className="text-2xl mb-2">⏱️</div>
                       <h3 className="font-bold">Timed</h3>
                       <p className="text-sm text-slate-500">Official pacing and strict limits</p>
                   </div>
               </div>

               <Button 
                 onClick={startPractice}
                 className={`${DET_ORANGE} hover:brightness-110 text-white text-xl font-bold px-12 py-4 rounded-2xl border-b-[6px] border-[#cc7a00] active:border-b-0 active:translate-y-[6px] transition-all`}
               >
                 Start 10-Min Practice
               </Button>
           </div>
        </div>
      )
  }

  const currentQ = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;
  
  return (
    <div className="min-h-screen bg-[#f7f7f7] dark:bg-slate-950 font-sans flex flex-col">
       {/* Top Bar */}
       <div className="bg-white dark:bg-slate-900 h-16 border-b border-slate-200 dark:border-slate-800 flex items-center px-4 md:px-8 justify-between shrink-0">
           <div className="flex-1 max-w-2xl">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                 <div className={`${DET_ORANGE} h-full transition-all duration-500`} style={{ width: `${progress}%` }}></div>
              </div>
           </div>
           <button onClick={() => setStarted(false)} className="ml-4 font-bold text-slate-400 hover:text-slate-600 uppercase text-sm tracking-wide">
               Quit
           </button>
       </div>

       {/* Main Content */}
       <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative">
           {/* Camera Preview Simulation */}
           <div className="absolute top-4 right-4 md:right-8 w-32 h-24 bg-black rounded-lg border-2 border-slate-300 dark:border-slate-700 overflow-hidden shadow-lg hidden md:block">
               <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
                  <Camera size={24} />
                  <span className="text-[10px] mt-1">Rec</span>
               </div>
           </div>

           <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 w-full max-w-4xl p-8 md:p-12 min-h-[500px] flex flex-col">
               
               {/* Question Header */}
               <div className="flex items-start justify-between mb-8">
                   <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white leading-tight">
                      {currentQ.type === 'read_select' && "Select the real English words in this list."}
                      {currentQ.type === 'read_complete' && "Type the missing letters to complete the text below."}
                      {currentQ.type === 'photo_writing' && "Write one or more sentences that describe the image."}
                   </h3>
                   
                   {/* Timer */}
                   <div className={`flex items-center gap-2 font-mono font-bold text-xl ${timeLeft < 15 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                      <Clock size={24} />
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                   </div>
               </div>

               {/* Task Content */}
               <div className="flex-1">
                  
                  {/* Read and Select Grid */}
                  {currentQ.type === 'read_select' && currentQ.words && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {currentQ.words.map((w, i) => (
                              <button
                                  key={i}
                                  onClick={() => {
                                      const newSet = new Set(selectedWords);
                                      if (newSet.has(w.text)) newSet.delete(w.text);
                                      else newSet.add(w.text);
                                      setSelectedWords(newSet);
                                  }}
                                  className={`p-3 rounded-xl border-2 font-bold text-lg text-left transition-all ${
                                      selectedWords.has(w.text) 
                                        ? 'border-[#ff9600] text-[#ff9600] bg-[#fff5e5] dark:bg-[#ff9600]/10' 
                                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                  }`}
                              >
                                  {w.text}
                                  {selectedWords.has(w.text) && <Check size={16} className="float-right mt-1.5" />}
                              </button>
                          ))}
                      </div>
                  )}

                  {/* C-Test Paragraph */}
                  {currentQ.type === 'read_complete' && (
                      <div className="leading-loose text-lg md:text-xl text-slate-800 dark:text-slate-200 font-serif">
                          {cTestParts.map((part, i) => {
                              if (typeof part === 'string') return <span key={i}>{part}</span>;
                              return (
                                  <span key={i} className="whitespace-nowrap mx-1">
                                      <span>{part.hint}</span>
                                      <input 
                                         type="text"
                                         value={cTestInputs[part.index] || ''}
                                         onChange={(e) => setCTestInputs({...cTestInputs, [part.index]: e.target.value})}
                                         className="bg-slate-100 dark:bg-slate-800 border-b-2 border-slate-300 dark:border-slate-600 focus:border-[#1cb0f6] outline-none w-[6ch] text-center text-[#1cb0f6] font-bold rounded px-1"
                                         maxLength={part.hidden.length + 2} // allow a bit of buffer
                                      />
                                  </span>
                              )
                          })}
                      </div>
                  )}

                  {/* Photo Writing */}
                  {currentQ.type === 'photo_writing' && (
                      <div className="flex flex-col md:flex-row gap-6 md:gap-8 h-full overflow-y-auto md:overflow-visible">
                          <div className="w-full md:w-1/2 flex-shrink-0">
                              {currentQ.imageUrl ? (
                                  <img 
                                    src={currentQ.imageUrl} 
                                    alt="Write about this image" 
                                    className="w-full h-auto aspect-[4/3] object-cover rounded-xl shadow-md border border-slate-200 dark:border-slate-700" 
                                  />
                              ) : (
                                  <div className="w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 dark:border-slate-700">
                                      <Loader2 className="animate-spin mb-2 w-8 h-8 text-[#1cb0f6]" /> 
                                      <span className="text-sm font-medium">Loading Scene...</span>
                                  </div>
                              )}
                          </div>
                          <div className="w-full md:w-1/2 flex flex-col min-h-[200px]">
                              <textarea 
                                 className="flex-1 w-full p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:border-[#1cb0f6] outline-none resize-none text-lg transition-all"
                                 placeholder="Write one or more sentences that describe the image..."
                                 value={writingInput}
                                 onChange={(e) => setWritingInput(e.target.value)}
                                 autoFocus
                              />
                              <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs text-slate-400">Min. 30 words recommended</span>
                                  <div className="text-slate-400 text-sm font-medium">
                                      Word count: <span className="text-[#1cb0f6]">{writingInput.trim().split(/\s+/).filter(x => x).length}</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}
               </div>

               {/* Footer */}
               <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <Button 
                    onClick={handleNext}
                    className={`${DET_ORANGE} hover:brightness-110 text-white px-10 rounded-xl font-bold py-3.5 border-b-[5px] border-[#cc7a00] active:border-b-0 active:translate-y-[5px] uppercase tracking-wide text-sm`}
                  >
                    NEXT
                  </Button>
               </div>
           </div>
       </div>
    </div>
  );
};
