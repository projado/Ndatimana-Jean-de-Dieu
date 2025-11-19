import React, { useState } from 'react';
import { Menu, X, Globe, Book, GraduationCap, Phone, Facebook, Instagram, Twitter, Award, Users, Clock, CheckCircle2, File, ChevronRight, MapPin } from 'lucide-react';
import { ViewState } from './types';
import { AIConsultant } from './components/AIConsultant';
import { ScholarshipFinder } from './components/ScholarshipFinder';
import { Destinations } from './components/Destinations';
import { Testimonials } from './components/Testimonials';
import { Button } from './components/Button';

// Custom Brand Logo Component
const BrandLogo = ({ light = false }: { light?: boolean }) => (
  <div className="flex items-center gap-3 group cursor-pointer select-none">
    <div className="relative w-11 h-11 flex-shrink-0">
      {/* Decorative background shapes representing stack of books/bricks */}
      <div className={`absolute inset-0 rounded-xl transform translate-x-1 translate-y-1 transition-transform group-hover:translate-x-2 group-hover:translate-y-2 ${light ? 'bg-red-500/30' : 'bg-red-200'}`}></div>
      
      {/* Main container */}
      <div className={`relative w-full h-full rounded-xl shadow-lg overflow-hidden flex items-center justify-center border border-white/10 ${light ? 'bg-slate-800' : 'bg-gradient-to-br from-red-900 to-red-800'}`}>
        
        {/* Subtle shine effect */}
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
        
        {/* Icon Composition */}
        <div className="relative z-10 flex flex-col items-center">
          <GraduationCap className="text-amber-400 w-6 h-6 -mb-1 drop-shadow-sm" strokeWidth={2} />
          <div className="h-1 w-6 bg-white/20 rounded-full mt-1"></div>
        </div>
      </div>

      {/* Accent badge indicating global reach */}
      <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm z-20 ring-1 ring-slate-100">
        <div className="bg-blue-600 rounded-full p-0.5">
           <Globe size={10} className="text-white" />
        </div>
      </div>
    </div>
    
    <div className="flex flex-col justify-center">
      <span className={`text-xl font-extrabold leading-none tracking-tighter font-sans ${light ? 'text-white' : 'text-slate-900'}`}>
        PROJADO
      </span>
      <div className="flex items-center gap-1">
        <div className={`h-[2px] w-3 rounded-full ${light ? 'bg-amber-400' : 'bg-red-800'}`}></div>
        <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${light ? 'text-slate-300' : 'text-slate-500'}`}>
          Education
        </span>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', view: ViewState.HOME },
    { label: 'Destinations & Visas', view: ViewState.DESTINATIONS },
    { label: 'Scholarships', view: ViewState.SCHOLARSHIPS },
    { label: 'Contact', view: ViewState.CONTACT },
  ];

  const renderContent = () => {
    switch (currentView) {
      case ViewState.SCHOLARSHIPS:
        return <ScholarshipFinder />;
      case ViewState.DESTINATIONS:
        return <Destinations />;
      case ViewState.CONTACT:
        return (
          <div className="max-w-2xl mx-auto py-16 px-4">
            <h2 className="text-3xl font-bold text-center mb-8 text-red-900">Start Your Journey</h2>
            <div className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-red-800">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input type="text" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:outline-none" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-800 focus:outline-none" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                  <textarea className="w-full p-3 border border-slate-200 rounded-lg h-32 focus:ring-2 focus:ring-red-800 focus:outline-none" placeholder="Tell us about your study goals and preferred destination..."></textarea>
                </div>
                <Button className="w-full">Send Inquiry</Button>
              </div>
              <div className="mt-8 pt-8 border-t border-slate-100 text-center text-slate-600">
                <p className="flex items-center justify-center gap-2 mb-2 font-bold text-xl text-red-900">
                  <Phone size={24} /> +250 793 236 678
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
            {/* Hero Section - Red Brick Theme */}
            <div className="relative bg-red-900 text-white py-24 lg:py-32 overflow-hidden">
              {/* Abstract Pattern */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
              <div className="absolute inset-0 opacity-30 bg-gradient-to-b from-black/40 to-red-900"></div>
              
              <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                  <div className="lg:w-1/2">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-800/50 backdrop-blur-sm rounded-full text-red-100 text-sm font-semibold mb-6 border border-red-700/50">
                      <Award size={16} className="text-amber-400" />
                      #1 Education Consultant in Rwanda
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
                      Build Your Future <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-200 to-amber-200">Beyond Borders.</span>
                    </h1>
                    <p className="text-xl text-red-100 mb-8 font-light leading-relaxed">
                      We don't just fill forms; we craft careers. Expert visa guidance, scholarship matching, and university placement for ambitious Rwandan students.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button onClick={() => setCurrentView(ViewState.SCHOLARSHIPS)} variant="secondary" className="gap-2">
                        <Users size={18} />
                        Find Scholarships
                      </Button>
                      <Button onClick={() => setCurrentView(ViewState.DESTINATIONS)} variant="outline" className="bg-transparent border-red-200 text-white hover:bg-white hover:text-red-900 gap-2">
                        <Globe size={18} />
                        Explore Visas
                      </Button>
                    </div>
                  </div>
                  <div className="lg:w-1/2 relative">
                    <div className="relative z-10 bg-white p-2 rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 border-4 border-white/20">
                      <img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80" className="rounded-xl w-full shadow-inner" alt="Graduation" />
                      <div className="absolute -bottom-6 -left-6 bg-slate-900 text-white p-6 rounded-xl shadow-xl hidden md:block border border-slate-800">
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

            {/* Statistics Section - "Huge Data" */}
            <div className="py-16 bg-slate-50 border-b border-slate-200">
              <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div>
                    <div className="text-4xl font-bold text-red-800 mb-2">1,200+</div>
                    <div className="text-slate-600 font-medium">Students Placed</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-red-800 mb-2">$5M+</div>
                    <div className="text-slate-600 font-medium">Scholarships Secured</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-red-800 mb-2">50+</div>
                    <div className="text-slate-600 font-medium">Global Partners</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-red-800 mb-2">100%</div>
                    <div className="text-slate-600 font-medium">Dedicated Support</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="py-20 bg-white">
              <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-slate-900">Why Choose Projado?</h2>
                  <p className="text-slate-500 mt-2">We handle the complexity so you can focus on your studies.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-8 bg-white rounded-2xl shadow-lg border border-slate-100 hover:border-red-200 transition-all group">
                    <div className="w-14 h-14 bg-red-100 text-red-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-800 group-hover:text-white transition-colors">
                      <Globe size={28} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900">Global Network</h3>
                    <p className="text-slate-600 leading-relaxed">Direct partnerships with universities in USA, Canada, China, and Europe specifically welcoming African students.</p>
                  </div>
                  <div className="p-8 bg-white rounded-2xl shadow-lg border border-slate-100 hover:border-red-200 transition-all group">
                    <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <Book size={28} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900">Visa Expertise</h3>
                    <p className="text-slate-600 leading-relaxed">Specialized in Rwandan applicant profiles. From financial document preparation to mock visa interviews.</p>
                  </div>
                  <div className="p-8 bg-white rounded-2xl shadow-lg border border-slate-100 hover:border-red-200 transition-all group">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <GraduationCap size={28} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900">Scholarship AI</h3>
                    <p className="text-slate-600 leading-relaxed">Our proprietary AI tool scans thousands of grants to find funding opportunities tailored to your profile.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Process Roadmap */}
            <div className="py-20 bg-slate-50">
               <div className="max-w-5xl mx-auto px-4">
                 <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Your Roadmap to Success</h2>
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-8 left-0 w-full h-1 bg-red-200 -z-0"></div>
                    
                    {[
                      { title: "Consultation", icon: Users, desc: "Free profile assessment" },
                      { title: "Application", icon: File, desc: "Docs & admission letter" },
                      { title: "Visa Prep", icon: CheckCircle2, desc: "Funds & interview prep" },
                      { title: "Departure", icon: Globe, desc: "Travel & settlement" }
                    ].map((step, i) => (
                      <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                        <div className="w-16 h-16 bg-white text-red-800 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg mb-4 border-4 border-red-50 group-hover:border-red-800 group-hover:bg-red-800 group-hover:text-white transition-all duration-300">
                          <step.icon size={28} />
                        </div>
                        <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                        <p className="text-sm text-slate-500">{step.desc}</p>
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
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40 border-b-2 border-red-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <div onClick={() => setCurrentView(ViewState.HOME)}>
              <BrandLogo />
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex gap-8">
              {navItems.map(item => (
                <button
                  key={item.label}
                  onClick={() => setCurrentView(item.view)}
                  className={`text-sm font-bold transition-all uppercase tracking-wide flex items-center gap-1 ${
                    currentView === item.view ? 'text-red-800' : 'text-slate-500 hover:text-red-800'
                  }`}
                >
                  {item.label}
                  {currentView === item.view && <div className="w-1.5 h-1.5 rounded-full bg-red-800 animate-pulse"></div>}
                </button>
              ))}
            </div>

            <div className="hidden md:block">
               <Button onClick={() => setCurrentView(ViewState.CONTACT)} variant="primary" className="py-2 px-6 text-sm rounded-full shadow-red-900/20 hover:shadow-red-900/40">
                 Book Consultation
               </Button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-slate-600 hover:text-red-800 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-xl z-50 animate-in slide-in-from-top-5">
            <div className="flex flex-col p-4 gap-4">
              {navItems.map(item => (
                <button
                  key={item.label}
                  onClick={() => {
                    setCurrentView(item.view);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left font-bold p-4 rounded-xl flex items-center justify-between ${
                    currentView === item.view ? 'bg-red-50 text-red-800' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                  <ChevronRight size={16} className="opacity-50" />
                </button>
              ))}
              <Button className="w-full bg-red-800" onClick={() => {
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
      <footer className="bg-slate-900 text-slate-300 py-16 border-t-4 border-red-800">
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
                <a href="#" className="bg-slate-800 p-2.5 rounded-full hover:bg-red-800 hover:text-white transition-all text-slate-400"><Facebook size={20} /></a>
                <a href="#" className="bg-slate-800 p-2.5 rounded-full hover:bg-red-800 hover:text-white transition-all text-slate-400"><Twitter size={20} /></a>
                <a href="#" className="bg-slate-800 p-2.5 rounded-full hover:bg-red-800 hover:text-white transition-all text-slate-400"><Instagram size={20} /></a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Quick Links</h4>
              <ul className="space-y-4 text-sm">
                <li><button onClick={() => setCurrentView(ViewState.HOME)} className="hover:text-red-400 transition-colors flex items-center gap-2"><ChevronRight size={12} /> Home</button></li>
                <li><button onClick={() => setCurrentView(ViewState.DESTINATIONS)} className="hover:text-red-400 transition-colors flex items-center gap-2"><ChevronRight size={12} /> Visa Requirements</button></li>
                <li><button onClick={() => setCurrentView(ViewState.SCHOLARSHIPS)} className="hover:text-red-400 transition-colors flex items-center gap-2"><ChevronRight size={12} /> Scholarship Search</button></li>
                <li><button onClick={() => setCurrentView(ViewState.CONTACT)} className="hover:text-red-400 transition-colors flex items-center gap-2"><ChevronRight size={12} /> Contact Support</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Contact Us</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm text-slate-400">
                  <Phone size={18} className="text-red-500 mt-1 shrink-0" />
                  <div>
                    <p className="text-white font-medium">+250 793 236 678</p>
                    <p className="text-xs">Mon-Fri, 8am - 6pm</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm text-slate-400">
                  <MapPin size={18} className="text-red-500 mt-1 shrink-0" />
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