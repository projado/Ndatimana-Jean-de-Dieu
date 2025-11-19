
import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, CheckCircle, XCircle, Trophy, Calculator, X, FileText, Flag, Book, RotateCcw, ChevronLeft } from 'lucide-react';
import { generateSATPracticeSet } from '../services/geminiService';
import { SATQuestion, TestConfig } from '../types';
import { Button } from './Button';

// --- Draggable Calculator Component ---
const DraggableCalculator = ({ onClose }: { onClose: () => void }) => {
  const [position, setPosition] = useState(() => ({ 
    x: typeof window !== 'undefined' ? Math.max(20, (window.innerWidth - 600) / 2) : 100, 
    y: 100 
  }));
  const [size, setSize] = useState({ w: 600, h: 450 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  
  const dragOffset = useRef({ x: 0, y: 0 });
  const startResize = useRef({ w: 0, h: 0, x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.current.x;
        const newY = e.clientY - dragOffset.current.y;
        setPosition({ x: newX, y: newY });
      }
      if (isResizing) {
        const deltaX = e.clientX - startResize.current.x;
        const deltaY = e.clientY - startResize.current.y;
        setSize({
          w: Math.max(300, startResize.current.w + deltaX),
          h: Math.max(200, startResize.current.h + deltaY)
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleResizeDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    startResize.current = {
      w: size.w,
      h: size.h,
      x: e.clientX,
      y: e.clientY
    };
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: size.w,
        height: size.h,
        zIndex: 100,
      }}
      className="flex flex-col bg-white rounded-lg shadow-2xl border border-slate-400 overflow-hidden"
    >
      <div
        onMouseDown={handleMouseDown}
        className="bg-slate-900 text-white h-10 flex items-center justify-between px-3 cursor-move select-none flex-shrink-0"
      >
        <span className="font-bold text-sm flex items-center gap-2">
           <Calculator size={14} /> Desmos Graphing Calculator
        </span>
        <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }} 
            className="hover:bg-slate-700 p-1 rounded text-slate-300 hover:text-white transition-colors"
        >
            <X size={16} />
        </button>
      </div>
      
      <div className="flex-1 relative bg-white">
        {(isDragging || isResizing) && (
          <div className="absolute inset-0 z-50 bg-transparent"></div>
        )}
        <iframe
          src="https://www.desmos.com/calculator?embed"
          className="w-full h-full border-none"
          title="Desmos Calculator"
        />
      </div>

      <div
        onMouseDown={handleResizeDown}
        className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize z-50 flex items-end justify-end p-0.5"
      >
        <div className="w-0 h-0 border-b-[8px] border-r-[8px] border-l-[8px] border-transparent border-b-slate-400 border-r-slate-400 transform rotate-0" />
      </div>
    </div>
  );
};

export const SATPrep: React.FC = () => {
  // Setup State
  const [stage, setStage] = useState<'SETUP' | 'INSTRUCTION' | 'TEST' | 'REVIEW' | 'MODULE_RESULT' | 'FULL_RESULT' | 'POST_TEST_REVIEW'>('SETUP');
  
  // Test Config
  const [selectedTestId, setSelectedTestId] = useState(1);
  const [currentSection, setCurrentSection] = useState<'Math' | 'ReadingWriting'>('ReadingWriting');
  const [currentModule, setCurrentModule] = useState<1 | 2>(1);
  
  // Data Persistence for Review
  const [module1Data, setModule1Data] = useState<{questions: SATQuestion[], answers: Record<number, number>}>({ questions: [], answers: {} });
  const [module2Data, setModule2Data] = useState<{questions: SATQuestion[], answers: Record<number, number>}>({ questions: [], answers: {} });
  
  // Current Session State
  const [questions, setQuestions] = useState<SATQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({}); // Index -> AnswerIndex
  const [markedQuestions, setMarkedQuestions] = useState<Set<number>>(new Set());
  
  // Review Mode State (Post-Test)
  const [reviewingModule, setReviewingModule] = useState<1 | 2>(1);

  // Timer State
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showTimer, setShowTimer] = useState(true);

  // Tools State
  const [showCalculator, setShowCalculator] = useState(false);
  const [showReference, setShowReference] = useState(false);

  // --- Effects ---

  // Timer Logic
  useEffect(() => {
    let interval: any;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            handleTimeUp();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  // --- Handlers ---

  const handleTimeUp = () => {
    setTimerRunning(false);
    setStage('REVIEW'); // Auto go to review screen when time is up
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startModule = async (moduleNum: 1 | 2, difficulty?: 'Easy' | 'Hard') => {
    setLoading(true);
    const config: TestConfig = {
      testId: selectedTestId,
      section: currentSection,
      module: moduleNum,
      difficulty: difficulty
    };

    // Official Bluebook Counts
    const questionCount = currentSection === 'ReadingWriting' ? 27 : 22;
    const timePerModule = currentSection === 'ReadingWriting' ? 32 * 60 : 35 * 60;

    try {
      const qs = await generateSATPracticeSet(config, questionCount);
      setQuestions(qs);
      setTimeLeft(timePerModule);
      setCurrentQIdx(0);
      setUserAnswers({});
      setMarkedQuestions(new Set());
      setStage('INSTRUCTION');
      setCurrentModule(moduleNum);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const beginTest = () => {
    setStage('TEST');
    setTimerRunning(true);
  };

  const handleAnswer = (optIdx: number) => {
    setUserAnswers(prev => ({...prev, [currentQIdx]: optIdx}));
  };

  const toggleMark = () => {
    const newSet = new Set(markedQuestions);
    if (newSet.has(currentQIdx)) newSet.delete(currentQIdx);
    else newSet.add(currentQIdx);
    setMarkedQuestions(newSet);
  };

  const calculateScore = (qs: SATQuestion[], answers: Record<number, number>) => {
    let correct = 0;
    qs.forEach((q, i) => {
      if (answers[i] === q.correctAnswerIndex) correct++;
    });
    return { correct, total: qs.length };
  };

  const finishModule = () => {
    setTimerRunning(false);
    
    // Save Data
    if (currentModule === 1) {
      setModule1Data({ questions: [...questions], answers: {...userAnswers} });
      setStage('MODULE_RESULT');
    } else {
      setModule2Data({ questions: [...questions], answers: {...userAnswers} });
      setStage('FULL_RESULT');
    }
  };

  const nextModule = () => {
    // Adaptive Logic: If > 60% correct, go Hard. Else Easy.
    const score = calculateScore(module1Data.questions, module1Data.answers);
    const percentage = score.correct / score.total;
    const diff = percentage > 0.6 ? 'Hard' : 'Easy';
    startModule(2, diff);
  };

  const startReview = (mod: 1 | 2) => {
    setReviewingModule(mod);
    const data = mod === 1 ? module1Data : module2Data;
    setQuestions(data.questions);
    setUserAnswers(data.answers);
    setCurrentQIdx(0);
    setStage('POST_TEST_REVIEW');
  };

  // --- Components ---

  const ReferenceSheet = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden relative">
        <div className="bg-slate-100 p-3 flex justify-between items-center border-b">
          <h3 className="font-bold text-slate-700">Reference Sheet</h3>
          <button onClick={() => setShowReference(false)}><X size={20} /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
             <div className="space-y-2">
                <p className="font-serif">A = πr²</p>
                <p className="font-serif">C = 2πr</p>
                <p className="text-slate-500 text-xs">Area/Circumference of Circle</p>
             </div>
             <div className="space-y-2">
                <p className="font-serif">A = lw</p>
                <p className="text-slate-500 text-xs">Area of Rectangle</p>
             </div>
             <div className="space-y-2">
                <p className="font-serif">A = ½bh</p>
                <p className="text-slate-500 text-xs">Area of Triangle</p>
             </div>
             <div className="space-y-2">
                <p className="font-serif">c² = a² + b²</p>
                <p className="text-slate-500 text-xs">Pythagorean Theorem</p>
             </div>
             <div className="space-y-2">
                <p className="font-serif">V = lwh</p>
                <p className="text-slate-500 text-xs">Volume of Rectangular Prism</p>
             </div>
             <div className="space-y-2">
                <p className="font-serif">V = πr²h</p>
                <p className="text-slate-500 text-xs">Volume of Cylinder</p>
             </div>
             <div className="col-span-2">
                <p className="font-serif">Special Right Triangles</p>
                <div className="flex gap-8 mt-2">
                   <div>30°-60°-90°: x, x√3, 2x</div>
                   <div>45°-45°-90°: s, s, s√2</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  // --- RENDER ---

  if (stage === 'SETUP') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 font-sans">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-t-4 border-blue-600 p-10">
             <div className="inline-flex p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-6">
                <BookOpen size={40} />
             </div>
             <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Bluebook Practice Tests</h1>
             <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
                Select a full-length adaptive practice test. Just like the real Digital SAT, you'll start with Module 1, and your performance will determine the difficulty of Module 2.
             </p>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-2xl mx-auto">
                <div className="space-y-4">
                   <label className="block font-bold text-slate-700 dark:text-slate-300">Select Section</label>
                   <div className="flex gap-2">
                      <button 
                        onClick={() => setCurrentSection('ReadingWriting')}
                        className={`flex-1 py-3 rounded-lg border font-bold ${currentSection === 'ReadingWriting' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 dark:text-white'}`}
                      >
                        Reading & Writing
                      </button>
                      <button 
                        onClick={() => setCurrentSection('Math')}
                        className={`flex-1 py-3 rounded-lg border font-bold ${currentSection === 'Math' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 dark:text-white'}`}
                      >
                        Math
                      </button>
                   </div>
                </div>

                <div className="space-y-4">
                   <label className="block font-bold text-slate-700 dark:text-slate-300">Select Test</label>
                   <select 
                      value={selectedTestId}
                      onChange={(e) => setSelectedTestId(Number(e.target.value))}
                      className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                        <option key={n} value={n}>Practice Test {n}</option>
                      ))}
                   </select>
                </div>
             </div>

             <div className="mt-10">
               <Button 
                  onClick={() => startModule(1)} 
                  isLoading={loading}
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg font-bold border-none"
               >
                 {loading ? 'Generating Exam...' : 'Start Practice Test'}
               </Button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'INSTRUCTION') {
     return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
           <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-6 shadow-md">
              <span className="font-bold">Practice Test {selectedTestId}</span>
              <span className="text-sm text-slate-400">Section: {currentSection} • Module {currentModule}</span>
           </header>
           <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="max-w-2xl space-y-6">
                 <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {currentSection === 'ReadingWriting' ? 'Reading and Writing' : 'Math'} - Module {currentModule}
                 </h2>
                 <p className="text-lg text-slate-600 dark:text-slate-400">
                    {currentSection === 'ReadingWriting' 
                       ? "32 minutes • 27 questions" 
                       : "35 minutes • 22 questions"}
                 </p>
                 <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl text-left text-slate-700 dark:text-slate-300 space-y-2">
                    <p>• The clock starts when you click Next.</p>
                    <p>• You can move back and forth between questions.</p>
                    <p>• You can mark questions for review.</p>
                    {currentSection === 'Math' && <p>• A calculator and reference sheet are available.</p>}
                 </div>
                 <Button onClick={beginTest} className="bg-blue-600 hover:bg-blue-700 border-none text-white w-full py-4 text-lg">
                    Start Module
                 </Button>
              </div>
           </main>
        </div>
     );
  }

  if (stage === 'MODULE_RESULT') {
     const score = calculateScore(module1Data.questions, module1Data.answers);
     return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
           <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
              <Trophy size={48} className="text-amber-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Module 1 Complete</h2>
              <div className="my-6 py-4 bg-slate-100 dark:bg-slate-700 rounded-xl">
                 <p className="text-sm text-slate-500 dark:text-slate-400 uppercase">Accuracy</p>
                 <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                    {score.correct}<span className="text-xl text-slate-400">/{score.total}</span>
                 </p>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                 Based on your performance, we have adapted the difficulty for the next module.
              </p>
              <Button onClick={nextModule} isLoading={loading} className="w-full bg-blue-600 hover:bg-blue-700 border-none text-white">
                 Continue to Module 2
              </Button>
           </div>
        </div>
     );
  }

  // --- POST TEST REVIEW (EXPLANATION MODE) ---

  if (stage === 'POST_TEST_REVIEW') {
    const currentQ = questions[currentQIdx];
    const userSelection = userAnswers[currentQIdx];
    const isCorrect = userSelection === currentQ.correctAnswerIndex;

    return (
      <div className="h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
         {/* HEADER */}
         <header className="h-14 bg-slate-900 flex items-center justify-between px-4 text-white shrink-0 z-20">
             <div className="flex items-center gap-2">
                <Button onClick={() => setStage('FULL_RESULT')} variant="secondary" className="py-1 px-3 text-xs bg-slate-700 hover:bg-slate-600 border-none">
                  <ChevronLeft size={14} /> Exit Review
                </Button>
                <span className="font-bold ml-2">Reviewing Module {reviewingModule}</span>
             </div>
             <div className="text-sm text-slate-300">
                Question {currentQIdx + 1} of {questions.length}
             </div>
         </header>

         {/* SPLIT VIEW */}
         <div className="flex-1 flex overflow-hidden">
             {/* LEFT: Passage */}
             <div className={`w-1/2 border-r border-slate-200 dark:border-slate-700 p-8 overflow-y-auto bg-slate-50 dark:bg-slate-950 ${currentSection === 'Math' && !currentQ.passage ? 'hidden w-0' : ''}`}>
                <div className="prose dark:prose-invert max-w-none font-serif text-lg leading-8">
                    {currentQ.passage ? (
                        <p>{currentQ.passage}</p>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-400">No Reference Text</div>
                    )}
                </div>
             </div>

             {/* RIGHT: Question & Answer */}
             <div className={`flex-1 p-8 overflow-y-auto bg-white dark:bg-slate-900 ${currentSection === 'Math' && !currentQ.passage ? 'w-full' : ''}`}>
                 <div className="max-w-2xl mx-auto">
                     <div className="mb-2 flex items-center gap-2">
                       <div className="bg-slate-900 text-white px-3 py-1 rounded text-sm font-bold w-fit">ID: {currentQ.id || 'N/A'}</div>
                       <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{currentQ.topic}</span>
                     </div>
                     
                     <p className="text-xl font-medium text-slate-900 dark:text-slate-100 mb-8 leading-relaxed">
                        {currentQ.questionText}
                     </p>

                     <div className="space-y-4 mb-8">
                        {currentQ.options.map((opt, idx) => {
                           const isSelected = userSelection === idx;
                           const isCorrectOpt = idx === currentQ.correctAnswerIndex;
                           
                           let borderClass = "border-slate-300 dark:border-slate-700 opacity-50";
                           let bgClass = "";
                           let icon = null;

                           if (isCorrectOpt) {
                             borderClass = "border-green-500 ring-1 ring-green-500 opacity-100";
                             bgClass = "bg-green-50 dark:bg-green-900/20";
                             icon = <CheckCircle className="text-green-600" size={20} />;
                           } else if (isSelected && !isCorrectOpt) {
                             borderClass = "border-red-500 opacity-100";
                             bgClass = "bg-red-50 dark:bg-red-900/20";
                             icon = <XCircle className="text-red-500" size={20} />;
                           }

                           return (
                              <div 
                                 key={idx}
                                 className={`w-full text-left p-4 rounded-lg border-2 flex items-start gap-4 relative ${borderClass} ${bgClass}`}
                              >
                                 <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs font-bold shrink-0 mt-0.5 ${isCorrectOpt ? 'bg-green-600 text-white border-green-600' : 'border-slate-400 text-slate-500'}`}>
                                    {String.fromCharCode(65 + idx)}
                                 </div>
                                 <span className="text-lg text-slate-700 dark:text-slate-300 flex-1">{opt}</span>
                                 {icon}
                              </div>
                           );
                        })}
                     </div>

                     {/* EXPLANATION BOX */}
                     <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl p-6">
                        <h4 className="flex items-center gap-2 font-bold text-blue-800 dark:text-blue-300 mb-3">
                           <Book size={18} /> Official Explanation
                        </h4>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                           {currentQ.explanation}
                        </p>
                     </div>
                 </div>
             </div>
         </div>

         {/* REVIEW FOOTER NAV */}
         <footer className="h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 shrink-0 z-20">
            <Button 
               onClick={() => setCurrentQIdx(Math.max(0, currentQIdx - 1))}
               disabled={currentQIdx === 0}
               variant="outline"
               className="px-6"
            >
               Previous
            </Button>
            <div className="flex gap-1 overflow-x-auto px-4 scrollbar-hide max-w-[50%]">
                {questions.map((q, idx) => {
                    const isRight = userAnswers[idx] === q.correctAnswerIndex;
                    return (
                        <button
                           key={idx}
                           onClick={() => setCurrentQIdx(idx)}
                           className={`w-2 h-8 rounded-full transition-colors ${currentQIdx === idx ? 'bg-slate-900 dark:bg-white scale-125' : isRight ? 'bg-green-400' : 'bg-red-400'}`}
                        />
                    )
                })}
            </div>
            <Button 
               onClick={() => setCurrentQIdx(Math.min(questions.length - 1, currentQIdx + 1))}
               disabled={currentQIdx === questions.length - 1}
               className="px-6 bg-blue-600 text-white border-none"
            >
               Next
            </Button>
         </footer>
      </div>
    );
  }

  // --- ACTIVE TEST UI (BLUEBOOK REPLICA) ---

  if (stage === 'TEST' || stage === 'REVIEW') {
    const currentQ = questions[currentQIdx];
    if (!currentQ) return <div>Loading Question...</div>; // Safety
    
    return (
      <div className="h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
         
         {/* MODALS & TOOLS */}
         
         {showCalculator && (
            <DraggableCalculator onClose={() => setShowCalculator(false)} />
         )}

         {showReference && <ReferenceSheet />}

         {/* BLUEBOOK HEADER */}
         <header className="h-14 bg-slate-900 flex items-center justify-between px-4 text-white shrink-0 z-20">
            <div className="flex items-center gap-4 w-1/3">
               <span className="font-bold truncate hidden md:inline">Section: {currentSection}</span>
               <div className="bg-slate-800 px-3 py-1 rounded text-sm font-mono">
                  {timerRunning ? (showTimer ? formatTime(timeLeft) : "HIDDEN") : "00:00"}
               </div>
               <button onClick={() => setShowTimer(!showTimer)} className="text-xs text-slate-400 hover:text-white underline">
                  {showTimer ? "Hide" : "Show"}
               </button>
            </div>

            <div className="flex items-center justify-center gap-2 w-1/3">
               {currentSection === 'Math' && (
                 <>
                   <button onClick={() => setShowCalculator(true)} className="flex flex-col items-center p-1 text-slate-300 hover:text-white">
                      <Calculator size={18} />
                      <span className="text-[9px] uppercase">Calc</span>
                   </button>
                   <button onClick={() => setShowReference(true)} className="flex flex-col items-center p-1 text-slate-300 hover:text-white">
                      <FileText size={18} />
                      <span className="text-[9px] uppercase">Ref</span>
                   </button>
                 </>
               )}
               <button className="flex flex-col items-center p-1 text-slate-300 hover:text-white cursor-not-allowed opacity-50">
                  <Flag size={18} />
                  <span className="text-[9px] uppercase">Mark</span>
               </button>
               <button className="flex flex-col items-center p-1 text-slate-300 hover:text-white cursor-not-allowed opacity-50">
                  <Book size={18} />
                  <span className="text-[9px] uppercase">Help</span>
               </button>
            </div>

            <div className="w-1/3 flex justify-end gap-3">
               <button onClick={() => setStage('REVIEW')} className="px-4 py-1.5 bg-white text-slate-900 rounded font-bold text-sm hover:bg-slate-200 transition-colors">
                  Review & Submit
               </button>
            </div>
         </header>

         {/* MAIN SPLIT AREA */}
         {stage === 'TEST' && (
            <div className="flex-1 flex overflow-hidden">
               {/* LEFT PANE (Passage) - RW Only or Math Context */}
               <div className={`w-1/2 border-r border-slate-200 dark:border-slate-700 p-8 overflow-y-auto bg-slate-50 dark:bg-slate-950 ${currentSection === 'Math' && !currentQ.passage ? 'hidden w-0' : ''}`}>
                  <div className="prose dark:prose-invert max-w-none font-serif text-lg leading-8">
                     {currentQ.passage ? (
                        <p>{currentQ.passage}</p>
                     ) : (
                        <div className="flex items-center justify-center h-full text-slate-400">
                           No Reference Text
                        </div>
                     )}
                  </div>
               </div>

               {/* RIGHT PANE (Question) */}
               <div className={`flex-1 p-8 overflow-y-auto bg-white dark:bg-slate-900 ${currentSection === 'Math' && !currentQ.passage ? 'w-full' : ''}`}>
                  <div className="max-w-2xl mx-auto">
                     <div className="flex justify-between items-center mb-6">
                        <div className="bg-slate-900 text-white px-3 py-1 rounded text-sm font-bold">
                           {currentQIdx + 1}
                        </div>
                        <button 
                           onClick={toggleMark}
                           className={`flex items-center gap-2 text-sm font-bold ${markedQuestions.has(currentQIdx) ? 'text-red-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                           <Flag size={16} fill={markedQuestions.has(currentQIdx) ? "currentColor" : "none"} />
                           {markedQuestions.has(currentQIdx) ? "Marked" : "Mark for Review"}
                        </button>
                     </div>

                     <p className="text-xl font-medium text-slate-900 dark:text-slate-100 mb-8 leading-relaxed">
                        {currentQ.questionText}
                     </p>

                     <div className="space-y-4">
                        {currentQ.options.map((opt, idx) => {
                           const isSelected = userAnswers[currentQIdx] === idx;
                           return (
                              <button 
                                 key={idx}
                                 onClick={() => handleAnswer(idx)}
                                 className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-start gap-4 ${
                                    isSelected 
                                      ? 'border-blue-900 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400' 
                                      : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                 }`}
                              >
                                 <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs font-bold shrink-0 mt-0.5 ${
                                    isSelected 
                                       ? 'bg-blue-900 text-white border-blue-900 dark:bg-blue-400 dark:border-blue-400 dark:text-slate-900' 
                                       : 'border-slate-400 text-slate-500'
                                 }`}>
                                    {String.fromCharCode(65 + idx)}
                                 </div>
                                 <span className={`text-lg ${isSelected ? 'text-blue-900 dark:text-blue-100 font-semibold' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {opt}
                                 </span>
                                 {isSelected && <CheckCircle size={20} className="ml-auto text-blue-900 dark:text-blue-400" />}
                              </button>
                           );
                        })}
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* REVIEW SCREEN (Replaces Split Area) */}
         {stage === 'REVIEW' && (
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50 dark:bg-slate-950">
               <div className="max-w-5xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-8 dark:text-white">Review Your Answers</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                     {questions.map((q, idx) => {
                        const isAnswered = userAnswers[idx] !== undefined;
                        const isMarked = markedQuestions.has(idx);
                        return (
                           <button 
                              key={idx}
                              onClick={() => { setCurrentQIdx(idx); setStage('TEST'); }}
                              className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 relative hover:shadow-md transition-all ${
                                 isAnswered 
                                    ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white' 
                                    : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-500'
                              }`}
                           >
                              <div className="text-xl font-bold">{idx + 1}</div>
                              <div className="flex gap-2">
                                 {isAnswered ? <CheckCircle size={16} className="text-blue-600" /> : <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>}
                                 {isMarked && <Flag size={16} className="text-red-600" fill="currentColor"/>}
                              </div>
                           </button>
                        );
                     })}
                  </div>
                  
                  <div className="mt-12 flex justify-center gap-6">
                     <Button onClick={() => setStage('TEST')} variant="outline" className="px-8 py-3">
                        Keep Working
                     </Button>
                     <Button onClick={finishModule} className="bg-blue-600 hover:bg-blue-700 border-none text-white px-8 py-3">
                        Submit Module
                     </Button>
                  </div>
               </div>
            </div>
         )}

         {/* FOOTER NAVIGATION */}
         <footer className="h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 shrink-0 z-20">
            <div className="flex items-center gap-4">
               <div className="font-bold text-slate-700 dark:text-slate-300">
                  Question {currentQIdx + 1} of {questions.length}
               </div>
            </div>

            {/* Question Strip */}
            <div className="hidden lg:flex items-center gap-1 overflow-x-auto max-w-[50%] px-4 scrollbar-hide">
               {questions.map((_, idx) => (
                  <button 
                     key={idx}
                     onClick={() => {
                       setCurrentQIdx(idx);
                       setStage('TEST');
                     }}
                     className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-colors ${
                        currentQIdx === idx 
                           ? 'bg-blue-900 text-white' 
                           : userAnswers[idx] !== undefined 
                              ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-300' 
                              : 'bg-transparent text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                     }`}
                  >
                     {markedQuestions.has(idx) ? <Flag size={10} fill="currentColor" className="text-red-600" /> : idx + 1}
                  </button>
               ))}
            </div>

            <div className="flex items-center gap-3">
               <Button 
                  onClick={() => setCurrentQIdx(Math.max(0, currentQIdx - 1))}
                  disabled={currentQIdx === 0}
                  className="px-6 bg-blue-600 hover:bg-blue-700 text-white border-none disabled:opacity-50 disabled:bg-slate-300"
               >
                  Back
               </Button>
               <Button 
                  onClick={() => {
                     if (currentQIdx < questions.length - 1) {
                        setCurrentQIdx(currentQIdx + 1);
                     } else {
                        setStage('REVIEW');
                     }
                  }}
                  className="px-8 bg-blue-600 hover:bg-blue-700 text-white border-none"
               >
                  {currentQIdx === questions.length - 1 ? 'Review' : 'Next'}
               </Button>
            </div>
         </footer>
      </div>
    );
  }

  // --- FINAL RESULTS ---

  if (stage === 'FULL_RESULT') {
     const score1 = calculateScore(module1Data.questions, module1Data.answers);
     const score2 = calculateScore(module2Data.questions, module2Data.answers);
     
     const totalCorrect = score1.correct + score2.correct;
     const totalQuestions = score1.total + score2.total;
     
     // Simulated scoring logic (Base 200 + (Correct/Total)*600)
     const estimatedScore = Math.round(200 + (totalCorrect / (totalQuestions || 1)) * 600);

     return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
           <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden">
                 <div className="bg-blue-900 text-white p-10 text-center">
                    <h2 className="text-3xl font-bold mb-2">Practice Test Complete</h2>
                    <p className="opacity-80">You've finished both modules.</p>
                    
                    <div className="mt-8 inline-block bg-white/10 px-8 py-6 rounded-2xl backdrop-blur-sm">
                       <p className="text-sm uppercase tracking-widest opacity-70 mb-1">Estimated Section Score</p>
                       <p className="text-6xl font-extrabold">{estimatedScore}</p>
                       <p className="text-sm mt-2">Range: {estimatedScore - 30} - {estimatedScore + 30}</p>
                    </div>
                 </div>

                 <div className="p-8">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Performance Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {/* Module 1 Card */}
                       <div className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600 relative overflow-hidden group">
                          <div className="flex justify-between items-start mb-4">
                             <h4 className="font-bold text-slate-600 dark:text-slate-300">Module 1</h4>
                             <Button onClick={() => startReview(1)} variant="outline" className="text-xs py-1 px-3 h-auto">Review Answers</Button>
                          </div>
                          <div className="flex items-end gap-2">
                             <span className="text-3xl font-bold text-slate-900 dark:text-white">{score1.correct}</span>
                             <span className="text-slate-500 mb-1">/ {score1.total} Correct</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                             <div className="bg-blue-500 h-full" style={{ width: `${((score1.correct)/(score1.total || 1))*100}%` }}></div>
                          </div>
                       </div>

                       {/* Module 2 Card */}
                       <div className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-600 relative overflow-hidden group">
                          <div className="flex justify-between items-start mb-4">
                             <h4 className="font-bold text-slate-600 dark:text-slate-300">Module 2</h4>
                             <Button onClick={() => startReview(2)} variant="outline" className="text-xs py-1 px-3 h-auto">Review Answers</Button>
                          </div>
                          <div className="flex items-end gap-2">
                             <span className="text-3xl font-bold text-slate-900 dark:text-white">{score2.correct}</span>
                             <span className="text-slate-500 mb-1">/ {score2.total} Correct</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                             <div className="bg-indigo-500 h-full" style={{ width: `${(score2.correct/(score2.total || 1))*100}%` }}></div>
                          </div>
                       </div>
                    </div>

                    <div className="mt-8 flex justify-center gap-4">
                       <Button onClick={() => {
                          setStage('SETUP');
                          setModule1Data({ questions: [], answers: {} });
                          setModule2Data({ questions: [], answers: {} });
                       }} className="bg-blue-600 hover:bg-blue-700 text-white border-none px-8 py-3 flex items-center gap-2">
                          <RotateCcw size={18} /> Take Another Test
                       </Button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
     );
  }

  return <div>Loading...</div>;
};
