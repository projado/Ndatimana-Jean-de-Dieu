
import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, CheckCircle, XCircle, Trophy, Calculator, X, FileText, Flag, Book, RotateCcw, ChevronLeft, ArrowRight, Clock, AlertTriangle, Maximize2, Image as ImageIcon, Loader2, Keyboard, TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { generateSATPracticeSet, generateDiagram } from '../services/geminiService';
import { SATQuestion, TestConfig } from '../types';
import { Button } from './Button';

// --- Draggable Calculator Component ---
const DraggableCalculator = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) => {
  const [position, setPosition] = useState(() => ({ 
    x: typeof window !== 'undefined' ? Math.max(20, (window.innerWidth - 600) / 2) : 100, 
    y: 100 
  }));
  const [size, setSize] = useState({ w: 600, h: 450 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  
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

  if (!isOpen) return null;

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
      className="flex flex-col bg-white rounded-lg shadow-2xl border border-slate-400 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
    >
      <div
        onMouseDown={handleMouseDown}
        className="bg-slate-900 text-white h-10 flex items-center justify-between px-3 cursor-move select-none flex-shrink-0 relative"
      >
        <div className="flex items-center gap-3">
           <span className="font-bold text-sm flex items-center gap-2">
              <Calculator size={14} /> Desmos Graphing Calculator
           </span>
           <button 
             onClick={(e) => { e.stopPropagation(); setShowShortcuts(!showShortcuts); }}
             className="text-slate-400 hover:text-white transition-colors p-1"
             title="Keyboard Shortcuts"
           >
             <Keyboard size={14} />
           </button>
        </div>
        
        <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }} 
            className="hover:bg-slate-700 p-1 rounded text-slate-300 hover:text-white transition-colors"
        >
            <X size={16} />
        </button>

        {showShortcuts && (
          <div 
            className="absolute top-full left-0 mt-1 ml-2 w-48 bg-slate-800 text-slate-200 text-xs p-3 rounded-lg shadow-xl z-50 border border-slate-700"
            onMouseDown={(e) => e.stopPropagation()}
          >
             <p className="font-bold mb-2 text-white border-b border-slate-700 pb-1">Keyboard Shortcuts</p>
             <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span>Toggle Visibility</span> 
                  <kbd className="bg-slate-700 px-1.5 py-0.5 rounded font-mono text-[10px] border border-slate-600">C</kbd>
                </li>
                <li className="flex justify-between items-center">
                  <span>Close Window</span> 
                  <kbd className="bg-slate-700 px-1.5 py-0.5 rounded font-mono text-[10px] border border-slate-600">Esc</kbd>
                </li>
             </ul>
          </div>
        )}
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
        className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-50 flex items-end justify-end p-0.5 group"
      >
        <Maximize2 size={12} className="text-slate-400 group-hover:text-slate-600 transform rotate-90" />
      </div>
    </div>
  );
};

type TestStage = 'SETUP' | 'INSTRUCTION' | 'TEST' | 'MODULE_RESULT' | 'SECTION_BREAK' | 'FULL_RESULT' | 'POST_TEST_REVIEW';
type TestMode = 'SECTION' | 'FULL_MOCK';

interface ModuleState {
  questions: SATQuestion[];
  userAnswers: Record<number, number>;
  markedQuestions: Set<number>;
  completed: boolean;
}

interface SectionState {
  module1: ModuleState;
  module2: ModuleState;
}

const FormattedText = ({ text }: { text: string }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold text-slate-900 dark:text-slate-100">{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

export const SATPrep: React.FC = () => {
  // --- Global Test State ---
  const [stage, setStage] = useState<TestStage>('SETUP');
  const [testMode, setTestMode] = useState<TestMode>('SECTION');
  
  // Configuration
  const [currentSection, setCurrentSection] = useState<'Math' | 'ReadingWriting'>('ReadingWriting');
  const [currentModule, setCurrentModule] = useState<1 | 2>(1);
  const [selectedTestId, setSelectedTestId] = useState(1);

  // Data Store
  const [rwData, setRwData] = useState<SectionState>({
    module1: { questions: [], userAnswers: {}, markedQuestions: new Set(), completed: false },
    module2: { questions: [], userAnswers: {}, markedQuestions: new Set(), completed: false }
  });
  const [mathData, setMathData] = useState<SectionState>({
    module1: { questions: [], userAnswers: {}, markedQuestions: new Set(), completed: false },
    module2: { questions: [], userAnswers: {}, markedQuestions: new Set(), completed: false }
  });

  // Active Session State
  const [activeQuestions, setActiveQuestions] = useState<SATQuestion[]>([]);
  const [activeAnswers, setActiveAnswers] = useState<Record<number, number>>({});
  const [activeMarks, setActiveMarks] = useState<Set<number>>(new Set());
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [prefetchedQuestions, setPrefetchedQuestions] = useState<SATQuestion[] | null>(null);

  // Timer
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showTimer, setShowTimer] = useState(true);

  // Tools
  const [showCalculator, setShowCalculator] = useState(false);
  const [showReference, setShowReference] = useState(false);

  // Review State
  const [reviewSection, setReviewSection] = useState<'ReadingWriting' | 'Math'>('ReadingWriting');
  const [reviewModule, setReviewModule] = useState<1 | 2>(1);
  
  // Diagram State
  const [diagramUrl, setDiagramUrl] = useState<string | null>(null);
  const [isGeneratingDiagram, setIsGeneratingDiagram] = useState(false);

  // --- Logic ---

  useEffect(() => {
     const handleGlobalKeyDown = (e: KeyboardEvent) => {
        if (stage !== 'TEST') return;
        if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
        if (e.key.toLowerCase() === 'c') {
           setShowCalculator(prev => !prev);
        }
     };
     window.addEventListener('keydown', handleGlobalKeyDown);
     return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [stage]);

  // Prefetching Logic for Background Generation during Break
  useEffect(() => {
    if (stage === 'SECTION_BREAK' && testMode === 'FULL_MOCK') {
      const prefetch = async () => {
        try {
          const questions = await generateSATPracticeSet({
            testId: selectedTestId,
            section: 'Math',
            module: 1,
            difficulty: 'Easy'
          }, 0);
          setPrefetchedQuestions(questions);
        } catch (e) {
          console.error("Prefetch failed", e);
        }
      };
      prefetch();
    }
  }, [stage, testMode]);

  useEffect(() => {
    let interval: any;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setTimerRunning(false);
            handleFinishModule(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const initTest = async (mode: TestMode, section: 'Math' | 'ReadingWriting') => {
    setTestMode(mode);
    setCurrentSection(section);
    
    // Reset all data
    setRwData({
      module1: { questions: [], userAnswers: {}, markedQuestions: new Set(), completed: false },
      module2: { questions: [], userAnswers: {}, markedQuestions: new Set(), completed: false }
    });
    setMathData({
      module1: { questions: [], userAnswers: {}, markedQuestions: new Set(), completed: false },
      module2: { questions: [], userAnswers: {}, markedQuestions: new Set(), completed: false }
    });
    setPrefetchedQuestions(null);

    await generateModule(section, 1);
  };

  const generateModule = async (section: 'Math' | 'ReadingWriting', moduleNum: 1 | 2) => {
    setLoading(true);
    setCurrentSection(section);
    setCurrentModule(moduleNum);
    
    try {
      let questions: SATQuestion[] = [];

      // Check if we have prefetched data for Math Module 1
      if (section === 'Math' && moduleNum === 1 && prefetchedQuestions) {
         questions = prefetchedQuestions;
         setPrefetchedQuestions(null); // clear it
      } else {
        // If Mod 2, determine difficulty based on Mod 1 performance
        let targetDifficulty: 'Easy' | 'Hard' = 'Easy';
        if (moduleNum === 2) {
          const prevData = section === 'ReadingWriting' ? rwData.module1 : mathData.module1;
          const score = calculateScore(prevData.questions, prevData.userAnswers);
          // Adaptive Logic: >60% correct -> Hard Module
          targetDifficulty = (score.correct / Math.max(1, score.total)) > 0.6 ? 'Hard' : 'Easy';
        }

        questions = await generateSATPracticeSet({
          testId: selectedTestId,
          section,
          module: moduleNum,
          difficulty: targetDifficulty
        }, 0);
      }

      setActiveQuestions(questions);
      setActiveAnswers({});
      setActiveMarks(new Set());
      setCurrentQIdx(0);
      
      // Time: RW = 32m, Math = 35m
      const time = section === 'ReadingWriting' ? 32 * 60 : 35 * 60;
      setTimeLeft(time);
      
      setStage('INSTRUCTION');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const startModuleTimer = () => {
    setStage('TEST');
    setTimerRunning(true);
  };

  const handleFinishModule = (autoSubmit = false) => {
    setTimerRunning(false);
    
    // Save current data
    const currentData = {
      questions: activeQuestions,
      userAnswers: activeAnswers,
      markedQuestions: activeMarks,
      completed: true
    };

    if (currentSection === 'ReadingWriting') {
      setRwData(prev => ({
        ...prev,
        [currentModule === 1 ? 'module1' : 'module2']: currentData
      }));
    } else {
      setMathData(prev => ({
        ...prev,
        [currentModule === 1 ? 'module1' : 'module2']: currentData
      }));
    }

    // Transition Logic
    if (currentModule === 1) {
      // M1 -> M2
      generateModule(currentSection, 2);
    } else {
      // M2 Finished
      if (testMode === 'FULL_MOCK' && currentSection === 'ReadingWriting') {
        // RW -> Break -> Math
        setStage('SECTION_BREAK');
      } else {
        // Finished Test
        setStage('FULL_RESULT');
      }
    }
  };

  const startNextSection = () => {
    generateModule('Math', 1);
  };

  const calculateScore = (qs: SATQuestion[], answers: Record<number, number>) => {
    if (!qs || qs.length === 0) return { correct: 0, total: 0 };
    let correct = 0;
    qs.forEach((q, i) => {
      if (answers[i] === q.correctAnswerIndex) correct++;
    });
    return { correct, total: qs.length };
  };

  const openReview = (section: 'ReadingWriting' | 'Math', mod: 1 | 2) => {
    const data = section === 'ReadingWriting' ? rwData : mathData;
    const modData = mod === 1 ? data.module1 : data.module2;
    
    setActiveQuestions(modData.questions);
    setActiveAnswers(modData.userAnswers);
    setReviewSection(section);
    setReviewModule(mod);
    setCurrentQIdx(0);
    setDiagramUrl(null);
    setStage('POST_TEST_REVIEW');
  };

  const handleGenerateDiagram = async (prompt: string) => {
    setIsGeneratingDiagram(true);
    const url = await generateDiagram(prompt);
    setDiagramUrl(url);
    setIsGeneratingDiagram(false);
  };

  const ReferenceSheet = () => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden relative">
        <div className="bg-slate-100 p-3 flex justify-between items-center border-b">
          <h3 className="font-bold text-slate-700">Reference Sheet</h3>
          <button onClick={() => setShowReference(false)}><X size={20} /></button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border p-4 rounded">
                 <h4 className="font-bold border-b mb-2">Geometry</h4>
                 <ul className="text-sm space-y-2">
                    <li>Area of Circle: A = πr²</li>
                    <li>Circumference: C = 2πr</li>
                    <li>Area of Rectangle: A = lw</li>
                    <li>Area of Triangle: A = ½bh</li>
                    <li>Volume of Rect. Prism: V = lwh</li>
                    <li>Volume of Cylinder: V = πr²h</li>
                    <li>Pythagorean Theorem: a² + b² = c²</li>
                 </ul>
              </div>
              <div className="border p-4 rounded">
                 <h4 className="font-bold border-b mb-2">Special Right Triangles</h4>
                 <ul className="text-sm space-y-2">
                    <li>x, x, x√2 (45-45-90)</li>
                    <li>x, x√3, 2x (30-60-90)</li>
                 </ul>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  // --- Views ---

  if (stage === 'SETUP') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 font-sans">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-t-4 border-blue-600 p-8 md:p-12">
             <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
                   <BookOpen size={32} />
                </div>
                <div>
                   <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Bluebook™ Practice</h1>
                   <p className="text-slate-500 dark:text-slate-400">Official Digital SAT Simulation (Fast Track Engine)</p>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                  onClick={() => initTest('FULL_MOCK', 'ReadingWriting')}
                  disabled={loading}
                  className="flex flex-col items-start p-6 rounded-xl border-2 border-blue-100 dark:border-blue-900/50 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group text-left relative overflow-hidden"
                >
                   <div className="bg-blue-600 text-white p-2 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                      {loading ? <Loader2 className="animate-spin" size={24} /> : <Trophy size={24} />}
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Full Length Mock</h3>
                   <p className="text-sm text-slate-600 dark:text-slate-400">
                      Experience the complete test. R&W (64m) + Math (70m). Includes Adaptive Modules.
                   </p>
                </button>

                <button 
                  onClick={() => initTest('SECTION', 'Math')}
                  disabled={loading}
                  className="flex flex-col items-start p-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group text-left"
                >
                   <div className="bg-indigo-600 text-white p-2 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                      {loading ? <Loader2 className="animate-spin" size={24} /> : <Calculator size={24} />}
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Math Section Only</h3>
                   <p className="text-sm text-slate-600 dark:text-slate-400">
                      Practice the Math modules specifically. 22 Questions per module.
                   </p>
                </button>
             </div>

             {loading && (
                <div className="mt-8 flex items-center justify-center gap-3 text-slate-500 animate-pulse">
                   <Zap className="text-yellow-500 fill-yellow-500" size={18} />
                   <span>Turbo-generating your unique exam paper (Parallel Engine Active)...</span>
                </div>
             )}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'INSTRUCTION') {
     let adaptiveStatus: 'Harder' | 'Easier' | null = null;
     if (currentModule === 2) {
        const prevData = currentSection === 'ReadingWriting' ? rwData.module1 : mathData.module1;
        if (prevData.completed) {
          const score = calculateScore(prevData.questions, prevData.userAnswers);
          adaptiveStatus = (score.correct / Math.max(1, score.total)) > 0.6 ? 'Harder' : 'Easier';
        }
     }

     return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
           <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-6 shadow-md">
              <span className="font-bold">Projado SAT Prep</span>
              <span className="text-sm text-slate-400 font-mono">
                 {currentSection === 'ReadingWriting' ? 'R&W' : 'Math'} • Module {currentModule}
              </span>
           </header>
           <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="max-w-xl w-full bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700">
                 <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock size={32} />
                 </div>
                 <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    {currentSection === 'ReadingWriting' ? 'Reading & Writing' : 'Math'}
                 </h2>
                 <p className="text-xl text-slate-500 dark:text-slate-400 mb-4 font-medium">
                    Module {currentModule}
                 </p>

                 {currentModule === 2 && adaptiveStatus && (
                   <div className={`mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold animate-in fade-in slide-in-from-bottom-2 ${
                      adaptiveStatus === 'Harder' 
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' 
                        : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                   }`}>
                     {adaptiveStatus === 'Harder' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                     <span>Adaptive Pool: {adaptiveStatus} Difficulty</span>
                   </div>
                 )}
                 
                 <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl text-left space-y-3 mb-8 border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 pb-2">
                       <span>Time Allotted</span>
                       <span>{currentSection === 'ReadingWriting' ? '32 Minutes' : '35 Minutes'}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-700 dark:text-slate-300">
                       <span>Questions</span>
                       <span>{activeQuestions.length} Questions</span>
                    </div>
                 </div>

                 <Button onClick={startModuleTimer} className="w-full bg-blue-600 hover:bg-blue-700 border-none text-white py-4 text-lg shadow-xl shadow-blue-900/20">
                    Start Module Now
                 </Button>
              </div>
           </main>
        </div>
     );
  }

  if (stage === 'SECTION_BREAK') {
     return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
           <div className="max-w-2xl text-center space-y-6 animate-in fade-in">
              <h1 className="text-5xl font-bold mb-4">Break Time</h1>
              <p className="text-2xl text-slate-300">
                 You have completed the Reading & Writing section.
              </p>
              <div className="p-8 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 my-8">
                 <p className="text-lg mb-4">Next Up: <strong>Math Section</strong></p>
                 <ul className="text-left space-y-2 text-slate-300 text-sm mx-auto max-w-xs">
                    <li>• 2 Modules</li>
                    <li>• 35 Minutes per module</li>
                    <li>• Calculator Allowed (Press C)</li>
                 </ul>
              </div>
              <Button onClick={startNextSection} disabled={loading} className="bg-white text-slate-900 hover:bg-slate-200 border-none px-10 py-4 text-lg font-bold">
                 {loading ? <><Loader2 className="animate-spin mr-2"/> Preparing Math...</> : "Start Math Section"}
              </Button>
              {prefetchedQuestions && !loading && (
                 <p className="text-xs text-emerald-400 animate-pulse">Math Section Ready to Start Instantly</p>
              )}
           </div>
        </div>
     );
  }

  if (stage === 'TEST') {
    const currentQ = activeQuestions[currentQIdx];
    if (!currentQ) return <div className="p-10 text-center">Loading...</div>;

    return (
      <div className="h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans overflow-hidden selection:bg-blue-100 selection:text-blue-900">
         <DraggableCalculator isOpen={showCalculator} onClose={() => setShowCalculator(false)} />
         {showReference && <ReferenceSheet />}

         <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 shrink-0 z-20">
            <div className="flex items-center gap-4 w-1/3">
               <div className="flex flex-col">
                  <span className="font-bold text-sm leading-tight">{currentSection === 'ReadingWriting' ? 'Reading & Writing' : 'Math'}</span>
                  <span className="text-xs text-slate-500">Module {currentModule}</span>
               </div>
               
               {showTimer ? (
                  <div className={`bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md font-mono font-bold text-lg min-w-[80px] text-center ${timeLeft < 300 ? 'text-red-500' : ''}`}>
                     {formatTime(timeLeft)}
                  </div>
               ) : (
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Timer Hidden</div>
               )}
               
               <button onClick={() => setShowTimer(!showTimer)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                  {showTimer ? 'Hide' : 'Show'}
               </button>
            </div>

            <div className="flex items-center justify-center gap-4 w-1/3">
               {currentSection === 'Math' && (
                 <>
                   <button onClick={() => setShowCalculator(!showCalculator)} className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${showCalculator ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}>
                      <Calculator size={20} />
                      <span className="hidden md:inline">Calculator <span className="text-[10px] opacity-70 bg-slate-100 dark:bg-slate-800 px-1 rounded">(C)</span></span>
                   </button>
                   <button onClick={() => setShowReference(!showReference)} className="flex flex-col items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                      <FileText size={20} />
                      Reference
                   </button>
                 </>
               )}
            </div>

            <div className="w-1/3 flex justify-end">
               <button 
                 onClick={() => handleFinishModule()} 
                 className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
               >
                  Next Module
               </button>
            </div>
         </header>

         <div className="flex-1 flex overflow-hidden relative">
             <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 z-10">
                <div 
                   className="h-full bg-blue-600 transition-all duration-300" 
                   style={{ width: `${((currentQIdx + 1) / activeQuestions.length) * 100}%` }}
                />
             </div>

             <div className={`w-1/2 border-r border-slate-200 dark:border-slate-700 p-8 overflow-y-auto bg-slate-50 dark:bg-slate-950 ${currentSection === 'Math' && !currentQ.passage ? 'hidden w-0' : ''}`}>
                <div className="max-w-xl mx-auto prose dark:prose-invert font-serif text-lg leading-loose">
                   <FormattedText text={currentQ.passage || ''} />
                </div>
             </div>

             <div className={`flex-1 p-8 overflow-y-auto bg-white dark:bg-slate-900 ${currentSection === 'Math' && !currentQ.passage ? 'w-full' : ''}`}>
                <div className="max-w-2xl mx-auto pt-4">
                   <div className="flex justify-between items-start mb-6">
                      <div className="bg-slate-900 text-white px-3 py-1 rounded text-sm font-bold">
                         {currentQIdx + 1}
                      </div>
                      <button 
                         onClick={() => {
                            const newSet = new Set(activeMarks);
                            if (newSet.has(currentQIdx)) newSet.delete(currentQIdx);
                            else newSet.add(currentQIdx);
                            setActiveMarks(newSet);
                         }}
                         className={`flex items-center gap-2 text-sm font-bold px-3 py-1 rounded transition-colors ${activeMarks.has(currentQIdx) ? 'bg-red-100 text-red-600' : 'text-slate-400 hover:bg-slate-100'}`}
                      >
                         <Flag size={16} fill={activeMarks.has(currentQIdx) ? "currentColor" : "none"} />
                         {activeMarks.has(currentQIdx) ? "Marked" : "Mark"}
                      </button>
                   </div>

                   <div className="text-xl font-medium text-slate-900 dark:text-slate-100 mb-10 leading-relaxed">
                      <FormattedText text={currentQ.questionText} />
                   </div>

                   <div className="space-y-3">
                      {currentQ.options.map((opt, idx) => {
                         const isSelected = activeAnswers[currentQIdx] === idx;
                         return (
                            <button 
                               key={idx}
                               onClick={() => setActiveAnswers(prev => ({...prev, [currentQIdx]: idx}))}
                               className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-start gap-4 group ${
                                  isSelected 
                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-sm' 
                                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                               }`}
                            >
                               <div className={`w-7 h-7 rounded-full flex items-center justify-center border font-bold shrink-0 transition-colors ${
                                  isSelected 
                                     ? 'bg-blue-600 text-white border-blue-600' 
                                     : 'border-slate-300 text-slate-500 group-hover:border-slate-400'
                               }`}>
                                  {String.fromCharCode(65 + idx)}
                               </div>
                               <span className={`text-lg pt-0.5 ${isSelected ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-700 dark:text-slate-300'}`}>
                                  <FormattedText text={opt} />
                               </span>
                            </button>
                         );
                      })}
                   </div>
                </div>
             </div>
         </div>

         <footer className="h-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 shrink-0 z-20">
            <div className="text-sm font-bold text-slate-500">
               Question {currentQIdx + 1} of {activeQuestions.length}
            </div>

            <div className="hidden md:flex gap-1 overflow-x-auto max-w-[50%] no-scrollbar">
               {activeQuestions.map((_, i) => (
                  <button
                     key={i}
                     onClick={() => setCurrentQIdx(i)}
                     className={`w-2 h-8 rounded-full transition-all flex-shrink-0 ${
                        currentQIdx === i ? 'bg-blue-600 scale-110' : 
                        activeAnswers[i] !== undefined ? 'bg-slate-300 dark:bg-slate-600' : 'bg-slate-100 dark:bg-slate-800'
                     } ${activeMarks.has(i) ? 'ring-2 ring-red-400 ring-offset-1' : ''}`}
                  />
               ))}
            </div>

            <div className="flex gap-3">
               <Button 
                  onClick={() => setCurrentQIdx(Math.max(0, currentQIdx - 1))}
                  disabled={currentQIdx === 0}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-900 border-none px-6"
               >
                  Back
               </Button>
               <Button 
                  onClick={() => setCurrentQIdx(Math.min(activeQuestions.length - 1, currentQIdx + 1))}
                  disabled={currentQIdx === activeQuestions.length - 1}
                  className="bg-blue-600 hover:bg-blue-700 text-white border-none px-6"
               >
                  Next
               </Button>
            </div>
         </footer>
      </div>
    );
  }

  if (stage === 'POST_TEST_REVIEW') {
    const currentQ = activeQuestions[currentQIdx];
    const userAns = activeAnswers[currentQIdx];
    const isCorrect = userAns === currentQ.correctAnswerIndex;

    return (
      <div className="h-screen flex flex-col bg-white dark:bg-slate-900 font-sans">
        <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-6 shadow-md shrink-0 z-20">
           <div className="flex items-center gap-4">
              <Button onClick={() => setStage('FULL_RESULT')} className="bg-slate-800 hover:bg-slate-700 border-none text-xs py-2">
                 <ChevronLeft size={16} /> Back to Score
              </Button>
              <div>
                 <h2 className="font-bold text-lg leading-none">{reviewSection === 'ReadingWriting' ? 'Reading & Writing' : 'Math'} Review</h2>
                 <p className="text-xs text-slate-400">Module {reviewModule}</p>
              </div>
           </div>
           <div className={`px-4 py-1 rounded font-bold flex items-center gap-2 ${isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {isCorrect ? <CheckCircle size={16}/> : <XCircle size={16}/>}
              {isCorrect ? 'Correct' : 'Incorrect'}
           </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
           <div className={`w-1/2 border-r border-slate-200 dark:border-slate-700 p-8 overflow-y-auto bg-slate-50 dark:bg-slate-950 ${reviewSection === 'Math' && !currentQ.passage ? 'hidden w-0' : ''}`}>
              <div className="prose dark:prose-invert max-w-none font-serif text-lg"><FormattedText text={currentQ.passage || ''} /></div>
           </div>

           <div className={`flex-1 p-8 overflow-y-auto ${reviewSection === 'Math' && !currentQ.passage ? 'w-full' : ''}`}>
              <div className="max-w-3xl mx-auto">
                 <p className="text-xl font-medium text-slate-900 dark:text-white mb-8"><FormattedText text={currentQ.questionText} /></p>
                 
                 <div className="space-y-3 mb-8">
                    {currentQ.options.map((opt, idx) => {
                       const isSelected = userAns === idx;
                       const isAnswer = idx === currentQ.correctAnswerIndex;
                       
                       let style = "border-slate-200 opacity-50";
                       if (isAnswer) style = "border-green-500 bg-green-50 dark:bg-green-900/20 opacity-100 ring-1 ring-green-500";
                       else if (isSelected && !isAnswer) style = "border-red-500 bg-red-50 dark:bg-red-900/20 opacity-100";
                       
                       return (
                          <div key={idx} className={`p-4 rounded-lg border-2 flex gap-4 items-center ${style}`}>
                             <div className="font-bold">{String.fromCharCode(65 + idx)}</div>
                             <div className="flex-1"><FormattedText text={opt} /></div>
                             {isAnswer && <CheckCircle className="text-green-600" size={20} />}
                             {isSelected && !isAnswer && <XCircle className="text-red-500" size={20} />}
                          </div>
                       )
                    })}
                 </div>

                 <div className="bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 p-6 rounded-r-xl">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                        <BookOpen size={18} /> Detailed Explanation
                      </h3>
                      
                      {currentQ.visualAidPrompt && (
                        <Button 
                          onClick={() => handleGenerateDiagram(currentQ.visualAidPrompt!)}
                          disabled={isGeneratingDiagram || !!diagramUrl}
                          className="text-xs py-1 px-3 bg-indigo-600 hover:bg-indigo-700 border-none text-white flex items-center gap-2"
                        >
                          {isGeneratingDiagram ? <Loader2 size={12} className="animate-spin" /> : <ImageIcon size={12} />}
                          {diagramUrl ? "Visual Generated" : "Generate Visual Aid"}
                        </Button>
                      )}
                    </div>

                    {diagramUrl && (
                      <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm animate-in fade-in">
                        <div className="flex justify-center">
                          <img src={diagramUrl} alt="Explanation Diagram" className="max-h-64 rounded border border-slate-100 dark:border-slate-700" />
                        </div>
                      </div>
                    )}
                    
                    <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line space-y-4">
                       <FormattedText text={currentQ.explanation} />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <footer className="h-16 border-t border-slate-200 dark:border-slate-700 flex items-center justify-center gap-4 bg-white dark:bg-slate-900 shrink-0">
           <Button 
             onClick={() => {
               setCurrentQIdx(Math.max(0, currentQIdx - 1));
               setDiagramUrl(null);
             }} 
             disabled={currentQIdx === 0} 
             variant="outline"
           >
             Previous
           </Button>
           <span className="text-sm font-mono">{currentQIdx + 1} / {activeQuestions.length}</span>
           <Button 
             onClick={() => {
               setCurrentQIdx(Math.min(activeQuestions.length - 1, currentQIdx + 1));
               setDiagramUrl(null);
             }} 
             disabled={currentQIdx === activeQuestions.length - 1} 
             variant="outline"
           >
             Next
           </Button>
        </footer>
      </div>
    );
  }

  if (stage === 'FULL_RESULT') {
     const rwScore1 = calculateScore(rwData.module1.questions, rwData.module1.userAnswers);
     const rwScore2 = calculateScore(rwData.module2.questions, rwData.module2.userAnswers);
     const mathScore1 = calculateScore(mathData.module1.questions, mathData.module1.userAnswers);
     const mathScore2 = calculateScore(mathData.module2.questions, mathData.module2.userAnswers);

     const totalQs = rwScore1.total + rwScore2.total + mathScore1.total + mathScore2.total;
     const totalCorrect = rwScore1.correct + rwScore2.correct + mathScore1.correct + mathScore2.correct;
     const estimatedScore = totalQs > 0 ? Math.round(400 + (totalCorrect/totalQs) * 1200) : 0;

     return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4">
           <div className="max-w-5xl mx-auto">
              <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden mb-8">
                 <div className="bg-slate-900 text-white p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-900 to-indigo-900 opacity-50"></div>
                    <div className="relative z-10">
                       <h2 className="text-4xl font-bold mb-2">Practice Complete</h2>
                       <p className="text-slate-400 mb-8">Great job finishing the exam.</p>
                       <div className="inline-block bg-white/10 p-8 rounded-2xl backdrop-blur-md border border-white/20">
                          <div className="text-xs uppercase tracking-widest text-slate-400 mb-2">Total Score Estimate</div>
                          <div className="text-7xl font-extrabold tracking-tighter">{estimatedScore}</div>
                          <div className="text-sm text-slate-400 mt-2">Range: {Math.max(400, estimatedScore - 30)} - {Math.min(1600, estimatedScore + 30)}</div>
                       </div>
                    </div>
                 </div>

                 <div className="p-8 md:p-12">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Section Breakdown</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <h4 className="font-bold text-slate-500 uppercase tracking-wider text-sm">Reading & Writing</h4>
                          {(['module1', 'module2'] as const).map((mod, i) => {
                             const data = rwData[mod];
                             if (!data.completed) return null;
                             const score = calculateScore(data.questions, data.userAnswers);
                             return (
                                <div key={mod} className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-slate-600 flex justify-between items-center">
                                   <div>
                                      <div className="font-bold text-slate-800 dark:text-white">Module {i + 1}</div>
                                      <div className="text-sm text-slate-500">{score.correct} / {score.total} Correct</div>
                                   </div>
                                   <Button onClick={() => openReview('ReadingWriting', (i + 1) as 1|2)} variant="outline" className="text-xs h-8">Review</Button>
                                </div>
                             )
                          })}
                       </div>

                       <div className="space-y-4">
                          <h4 className="font-bold text-slate-500 uppercase tracking-wider text-sm">Math</h4>
                          {(['module1', 'module2'] as const).map((mod, i) => {
                             const data = mathData[mod];
                             if (!data.completed) return null;
                             const score = calculateScore(data.questions, data.userAnswers);
                             return (
                                <div key={mod} className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-200 dark:border-slate-600 flex justify-between items-center">
                                   <div>
                                      <div className="font-bold text-slate-800 dark:text-white">Module {i + 1}</div>
                                      <div className="text-sm text-slate-500">{score.correct} / {score.total} Correct</div>
                                   </div>
                                   <Button onClick={() => openReview('Math', (i + 1) as 1|2)} variant="outline" className="text-xs h-8">Review</Button>
                                </div>
                             )
                          })}
                       </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 flex justify-center">
                       <Button onClick={() => setStage('SETUP')} className="bg-slate-900 text-white px-8 py-4 text-lg border-none hover:bg-slate-800">
                          Back to Dashboard
                       </Button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
     );
  }

  return <div>Loading application...</div>;
};
