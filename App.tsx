import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Book, GraduationCap, Phone, Mail, Facebook, Instagram, Award, Users, CheckCircle2, File, ChevronRight, MapPin, Plus, Minus, ArrowRight, Star, Moon, Sun, Youtube, Landmark, Video } from 'lucide-react';
import { ViewState } from './types';
import { AIConsultant } from './components/AIConsultant';
import { ScholarshipFinder } from './components/ScholarshipFinder';
import { Destinations } from './components/Destinations';
import { Testimonials } from './components/Testimonials';
import { CampusVideo } from './components/CampusVideo';
import { Button } from './components/Button';

// Custom Brand Logo Component
const BrandLogo = ({ light = false }: { light?: boolean }) => (
  <div className="flex items-center gap-3 group cursor-pointer select-none">
    <div className="relative w-11 h-11 flex-shrink-0">
      {/* Decorative background shapes representing stack of books/bricks */}
      <div className={`absolute inset-0 rounded-xl transform translate-x-1 translate-y-1 transition-transform group-hover:translate-x-2 group-hover:translate-y-2 ${light ? 'bg-red-500/30' : 'bg-indigo-200 dark:bg-indigo-900/50'}`}></div>
      
      {/* Main container */}
      <div className={`relative w-full h-full rounded-xl shadow-lg overflow-hidden flex items-center justify-center border border-white/10 ${light ? 'bg-slate-800' : 'bg-gradient-to-br from-red-900 to-indigo-900'}`}>
        
        {/* Subtle shine effect */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
        
        {/* Icon Composition */}
        <div className="relative z-10 flex flex-col items-center">
          <GraduationCap className="text-amber-400 w-6 h-6 -mb-1 drop-shadow-sm" strokeWidth={2} />
          <div className="h-1 w-6 bg-white/20 rounded-full mt-1"></div>
        </div>
      </div>

      {/* Accent badge indicating global reach */}
      <div className="absolute -top-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-0.5 shadow-sm z-20 ring-1 ring-slate-100 dark:ring-slate-700">
        <div className="bg-blue-600 rounded-full p-0.5">
           <Globe size={10} className="text-white" />
        </div>
      </div>
    </div>
    
    <div className="flex flex-col justify-center">
      <span className={`text-xl font-extrabold leading-none tracking-tighter font-sans ${light ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
        PROJADO
      </span>
      <div className="flex items-center gap-1">
        <div className={`h-[2px] w-3 rounded-full ${light ? 'bg-amber-400' : 'bg-indigo-600 dark:bg-indigo-400'}`}></div>
        <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${light ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
          Education
        </span>
      </div>
    </div>
  </div>
);

const UniversityCard = ({ name, location, domain }: { name: string, location: string, domain?: string }) => {
  const [imgError, setImgError] = useState(false);
  
  return (
    <div className="mx-4 inline-flex items-center gap-3 px-5 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 group cursor-default min-w-[240px]">
      <div className="w-12 h-12 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 p-2 group-hover:scale-105 transition-transform overflow-hidden">
        {!imgError && domain ? (
          <img 
            src={`https://logo.clearbit.com/${domain}`} 
            alt={name}
            className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
            onError={() => setImgError(true)}
          />
        ) : (
          <Landmark size={20} className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-900 dark:group-hover:text-indigo-300 transition-colors font-serif leading-tight">
          {name}
        </span>
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <MapPin size={10} className="text-indigo-400" /> {location}
        </span>
      </div>
    </div>
  );
};

// Marquee Component for "Moving Parts"
const PartnerTicker = () => {
  const partners = [
    { name: "University of Toronto", location: "Canada", domain: "utoronto.ca" },
    { name: "Manchester Uni", location: "UK", domain: "manchester.ac.uk" },
    { name: "Tsinghua University", location: "China", domain: "tsinghua.edu.cn" },
    { name: "McGill University", location: "Canada", domain: "mcgill.ca" },
    { name: "Harvard Extension", location: "USA", domain: "harvard.edu" },
    { name: "Melbourne Uni", location: "Australia", domain: "unimelb.edu.au" },
    { name: "Sorbonne Université", location: "France", domain: "sorbonne-universite.fr" },
    { name: "Beijing Normal", location: "China", domain: "bnu.edu.cn" },
    { name: "UCLA", location: "USA", domain: "ucla.edu" },
    { name: "LSE", location: "UK", domain: "lse.ac.uk" },
    { name: "RWTH Aachen", location: "Germany", domain: "rwth-aachen.de" },
    { name: "University of Rwanda", location: "Rwanda", domain: "ur.ac.rw" }
  ];

  return (
    <div className="bg-slate-100 dark:bg-slate-950 py-12 overflow-hidden border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
        <p className="text-xs font-extrabold text-slate-400 uppercase tracking-[0.2em] flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-slate-300 dark:bg-slate-700"></span>
          Trusted by Top Institutions
          <span className="h-px w-8 bg-slate-300 dark:bg-slate-700"></span>
        </p>
      </div>
      
      <div className="flex whitespace-nowrap animate-marquee">
        {[...partners, ...partners, ...partners].map((partner, idx) => (
          <UniversityCard key={idx} {...partner} />
        ))}
      </div>
      <style>{`
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const navItems = [
    { label: 'Home', view: ViewState.HOME },
    { label: 'Destinations & Visas', view: ViewState.DESTINATIONS },
    { label: 'Scholarships', view: ViewState.SCHOLARSHIPS },
    { label: 'AI Campus Preview', view: ViewState.VIDEO },
    { label: 'Contact', view: ViewState.CONTACT },
  ];

  const features = [
    {
      title: "Global Network",
      icon: Globe,
      color: "blue",
      rating: 4.9,
      reviews: "850+",
      desc: "Direct partnerships with universities in USA, Canada, China, and Europe specifically welcoming African students.",
      details: ["200+ Partner Universities", "Direct Admission Channels", "Exclusive Tuition Waivers", "Networking Events"]
    },
    {
      title: "Visa Expertise",
      icon: Book,
      color: "amber",
      rating: 4.8,
      reviews: "1.2k+",
      desc: "Specialized in Rwandan applicant profiles. From financial document preparation to mock visa interviews.",
      details: ["98% Success Rate", "Mock Interviews", "Financial Proof Guidance", "SOP Writing Support"]
    },
    {
      title: "Scholarship AI",
      icon: GraduationCap,
      color: "emerald",
      rating: 5.0,
      reviews: "3k+",
      desc: "Our proprietary AI tool scans thousands of grants to find funding opportunities tailored to your profile.",
      details: ["Full & Partial Funding", "Merit-based Grants", "Need-based Aid", "Automatic Matching"]
    }
  ];

  const renderContent = () => {
    switch (currentView) {
      case ViewState.SCHOLARSHIPS:
        return <ScholarshipFinder />;
      case ViewState.DESTINATIONS:
        return <Destinations />;
      case ViewState.VIDEO:
        return <CampusVideo />;
      case ViewState.CONTACT:
        return (
          <div className="max-w-2xl mx-auto py-16 px-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-indigo-900 dark:text-indigo-300">Start Your Journey</h2>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border-t-4 border-indigo-800 dark:border-indigo-600">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input type="text" className="w-full p-3 border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-800 dark:focus:ring-indigo-500 focus:outline-none" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input type="email" className="w-full p-3 border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-800 dark:focus:ring-indigo-500 focus:outline-none" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                  <textarea className="w-full p-3 border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg h-32 focus:ring-2 focus:ring-indigo-800 dark:focus:ring-indigo-500 focus:outline-none" placeholder="Tell us about your study goals and preferred destination..."></textarea>
                </div>
                <Button className="w-full bg-indigo-800 hover:bg-indigo-900 dark:bg-indigo-600 dark:hover:bg-indigo-700 border-none">Send Inquiry</Button>
              </div>
              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700 text-center text-slate-600 dark:text-slate-400">
                <p className="flex items-center justify-center gap-2 mb-2 font-bold text-xl text-indigo-900 dark:text-indigo-300">
                  <Phone size={24} /> +250 793 236 678
                </p>
                <p className="flex items-center justify-center gap-2 mb-2 font-bold text-xl text-indigo-900 dark:text-indigo-300">
                  <Mail size={24} /> ndaji005@gmail.com
                </p>
                <p>Kigali Heights, 4th Floor, Kigali, Rwanda</p>
              </div>
            </div>
          </div>
        );
      case ViewState.HOME:
      default:
        return (
          <>
            {/* Hero Section - Enhanced Colorful Theme */}
            <div className="relative bg-gradient-to-br from-slate-900 via-red-900 to-indigo-900 text-white py-24 lg:py-32 overflow-hidden">
              {/* Abstract Pattern */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
              
              {/* Animated blobs for "moving parts" vibe */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

              <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                  <div className="lg:w-1/2">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-semibold mb-6 border border-white/20 shadow-lg">
                      <Award size={16} className="text-amber-400" />
                      <span>#1 Education Consultant in Rwanda</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
                      Build Your Future <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-red-300 to-indigo-300">Beyond Borders.</span>
                    </h1>
                    <p className="text-xl text-slate-200 mb-8 font-light leading-relaxed max-w-lg">
                      We don't just fill forms; we craft careers. Expert visa guidance, scholarship matching, and university placement for ambitious Rwandan students.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button onClick={() => setCurrentView(ViewState.SCHOLARSHIPS)} variant="secondary" className="gap-2 bg-gradient-to-r from-amber-600 to-orange-600 border-none shadow-lg hover:shadow-amber-600/40">
                        <Users size={18} />
                        Find Scholarships
                      </Button>
                      <Button onClick={() => setCurrentView(ViewState.DESTINATIONS)} variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white hover:text-indigo-900 gap-2 backdrop-blur-sm">
                        <Globe size={18} />
                        Explore Visas
                      </Button>
                    </div>
                  </div>
                  <div className="lg:w-1/2 relative perspective-1000">
                    <div className="relative z-10 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-2xl transform rotate-1 hover:rotate-0 transition-all duration-500 border-4 border-white/20 group">
                      <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80" className="rounded-xl w-full shadow-inner group-hover:scale-[1.01] transition-transform" alt="Graduation" />
                      <div className="absolute -bottom-6 -left-6 bg-slate-900 dark:bg-black text-white p-6 rounded-xl shadow-xl hidden md:block border border-slate-800 dark:border-slate-700 hover:scale-105 transition-transform">
                        <div className="flex items-center gap-3 mb-1">
                          <CheckCircle2 className="text-emerald-400" />
                          <p className="text-3xl font-bold">98%</p>
                        </div>
                        <p className="text-sm text-slate-400 font-medium uppercase tracking-wide">Visa Success Rate</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <PartnerTicker />

            {/* Statistics Section - "Multi-colored" */}
            <div className="py-16 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
              <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div className="hover:-translate-y-1 transition-transform duration-300">
                    <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">1,200+</div>
                    <div className="text-slate-600 dark:text-slate-400 font-medium">Students Placed</div>
                  </div>
                  <div className="hover:-translate-y-1 transition-transform duration-300">
                    <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">$5M+</div>
                    <div className="text-slate-600 dark:text-slate-400 font-medium">Scholarships Secured</div>
                  </div>
                  <div className="hover:-translate-y-1 transition-transform duration-300">
                    <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">50+</div>
                    <div className="text-slate-600 dark:text-slate-400 font-medium">Global Partners</div>
                  </div>
                  <div className="hover:-translate-y-1 transition-transform duration-300">
                    <div className="text-4xl font-bold text-rose-600 dark:text-rose-400 mb-2">100%</div>
                    <div className="text-slate-600 dark:text-slate-400 font-medium">Dedicated Support</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid - Interactive & Colorful */}
            <div className="py-20 bg-white dark:bg-slate-950 transition-colors duration-300">
              <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Why Choose Projado?</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-2">Click on any feature below to explore our capabilities.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {features.map((feature, idx) => (
                    <div 
                      key={idx} 
                      className={`p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border transition-all duration-300 cursor-pointer group ${
                        activeFeature === idx 
                          ? `ring-2 ring-${feature.color}-500 border-transparent scale-105` 
                          : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xl'
                      }`}
                      onClick={() => setActiveFeature(activeFeature === idx ? null : idx)}
                    >
                      <div className="flex justify-between items-start">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                          feature.color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white' :
                          feature.color === 'amber' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white' :
                          'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white'
                        }`}>
                          <feature.icon size={28} />
                        </div>
                        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 dark:text-slate-500">
                          {activeFeature === idx ? <Minus size={16} /> : <Plus size={16} />}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">{feature.title}</h3>
                      
                      {/* Rating Display */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                             <Star 
                               key={star} 
                               size={14} 
                               className={`${star <= Math.round(feature.rating) ? `text-${feature.color}-500 fill-${feature.color}-500` : 'text-slate-300 dark:text-slate-700'}`} 
                             />
                          ))}
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{feature.rating}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-500">({feature.reviews} reviews)</span>
                      </div>

                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{feature.desc}</p>
                      
                      {/* Expandable Content */}
                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeFeature === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <ul className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
                          {feature.details.map((detail, dIdx) => (
                            <li key={dIdx} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                              <ArrowRight size={12} className={`text-${feature.color}-500`} /> {detail}
                            </li>
                          ))}
                        </ul>
                        <button className={`mt-4 text-xs font-bold uppercase tracking-wider text-${feature.color}-600 dark:text-${feature.color}-400 hover:underline`}>
                          Learn more about {feature.title}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Process Roadmap */}
            <div className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
               <div className="max-w-5xl mx-auto px-4">
                 <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">Your Roadmap to Success</h2>
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-8 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 -z-0"></div>
                    
                    {[
                      { title: "Consultation", icon: Users, desc: "Free profile assessment", color: "bg-blue-500" },
                      { title: "Application", icon: File, desc: "Docs & admission letter", color: "bg-purple-500" },
                      { title: "Visa Prep", icon: CheckCircle2, desc: "Funds & interview prep", color: "bg-amber-500" },
                      { title: "Departure", icon: Globe, desc: "Travel & settlement", color: "bg-emerald-500" }
                    ].map((step, i) => (
                      <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                        <div className={`w-16 h-16 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg mb-4 border-4 border-white dark:border-slate-800 transition-all duration-300 transform group-hover:scale-110 ${step.color}`}>
                          <step.icon size={28} />
                        </div>
                        <h3 className="font-bold text-lg mb-1 text-slate-800 dark:text-white">{step.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{step.desc}</p>
                      </div>
                    ))}
                 </div>
               </div>
            </div>
            
            {/* Testimonials Section */}
            <Testimonials />

            <Destinations />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Navigation */}
      <nav className="bg-white/90 dark:bg-slate-900/90 shadow-sm sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <div onClick={() => setCurrentView(ViewState.HOME)}>
              <BrandLogo />
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map(item => (
                <button
                  key={item.label}
                  onClick={() => setCurrentView(item.view)}
                  className={`text-sm font-bold transition-all uppercase tracking-wide flex items-center gap-1 ${
                    currentView === item.view ? 'text-red-800 dark:text-red-400' : 'text-slate-500 dark:text-slate-400 hover:text-red-800 dark:hover:text-red-400'
                  }`}
                >
                  {item.label}
                  {currentView === item.view && <div className="w-1.5 h-1.5 rounded-full bg-red-800 dark:bg-red-400 animate-pulse"></div>}
                </button>
              ))}
              
              {/* Dark Mode Toggle (Desktop) */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <Button onClick={() => setCurrentView(ViewState.CONTACT)} variant="primary" className="py-2 px-6 text-sm rounded-full bg-red-800 hover:bg-red-900 dark:bg-red-700 dark:hover:bg-red-600 shadow-red-900/20 hover:shadow-red-900/40 border-none">
                 Book Consultation
               </Button>
            </div>

            {/* Mobile Menu Buttons */}
            <div className="flex items-center gap-4 md:hidden">
               <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                className="text-slate-600 dark:text-slate-300 hover:text-red-800 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 absolute w-full shadow-xl z-50 animate-in slide-in-from-top-5">
            <div className="flex flex-col p-4 gap-4">
              {navItems.map(item => (
                <button
                  key={item.label}
                  onClick={() => {
                    setCurrentView(item.view);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left font-bold p-4 rounded-xl flex items-center justify-between ${
                    currentView === item.view ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                  <ChevronRight size={16} className="opacity-50" />
                </button>
              ))}
              <Button className="w-full bg-red-800 dark:bg-red-700 border-none" onClick={() => {
                setCurrentView(ViewState.CONTACT);
                setIsMobileMenuOpen(false);
              }}>Book Consultation</Button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {renderContent()}
      </main>

      {/* AI Chatbot */}
      <AIConsultant />

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-black text-slate-300 py-16 border-t-4 border-indigo-600 dark:border-indigo-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="mb-6">
                <BrandLogo light />
              </div>
              <p className="max-w-sm text-slate-400 leading-relaxed mb-6">
                Empowering Rwandan youth through global education. We simplify the journey from Kigali to the world's best campuses with data-driven insights and personalized mentorship.
              </p>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/projadoedu" target="_blank" rel="noopener noreferrer" className="bg-slate-800 p-2.5 rounded-full hover:bg-blue-600 hover:text-white transition-all text-slate-400"><Facebook size={20} /></a>
                <a href="https://www.instagram.com/projado1" target="_blank" rel="noopener noreferrer" className="bg-slate-800 p-2.5 rounded-full hover:bg-pink-600 hover:text-white transition-all text-slate-400"><Instagram size={20} /></a>
                <a href="https://www.youtube.com/@Ndaji_11" target="_blank" rel="noopener noreferrer" className="bg-slate-800 p-2.5 rounded-full hover:bg-red-600 hover:text-white transition-all text-slate-400"><Youtube size={20} /></a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Quick Links</h4>
              <ul className="space-y-4 text-sm">
                <li><button onClick={() => setCurrentView(ViewState.HOME)} className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ChevronRight size={12} /> Home</button></li>
                <li><button onClick={() => setCurrentView(ViewState.DESTINATIONS)} className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ChevronRight size={12} /> Visa Requirements</button></li>
                <li><button onClick={() => setCurrentView(ViewState.SCHOLARSHIPS)} className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ChevronRight size={12} /> Scholarship Search</button></li>
                <li><button onClick={() => setCurrentView(ViewState.CONTACT)} className="hover:text-indigo-400 transition-colors flex items-center gap-2"><ChevronRight size={12} /> Contact Support</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Contact Us</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm text-slate-400">
                  <Phone size={18} className="text-indigo-500 mt-1 shrink-0" />
                  <div>
                    <p className="text-white font-medium">+250 793 236 678</p>
                    <p className="text-xs">Mon-Fri, 8am - 6pm</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm text-slate-400">
                  <Mail size={18} className="text-indigo-500 mt-1 shrink-0" />
                  <div>
                    <p className="text-white font-medium">ndaji005@gmail.com</p>
                    <p className="text-xs">Response within 24h</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm text-slate-400">
                  <MapPin size={18} className="text-indigo-500 mt-1 shrink-0" />
                  <div>
                     <p className="text-white font-medium">Kigali Heights, 4th Floor</p>
                     <p className="text-xs">Kigali, Rwanda</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-sm flex flex-col md:flex-row justify-between items-center text-slate-500">
            <p>© {new Date().getFullYear()} Projado Edu. All rights reserved.</p>
            <p className="mt-2 md:mt-0 flex items-center gap-2">
              Built with <span className="text-red-500">♥</span> for Rwanda
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;