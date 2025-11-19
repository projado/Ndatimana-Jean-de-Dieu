import React, { useState } from 'react';
import { Menu, X, Globe, Book, GraduationCap, Phone, Facebook, Instagram, Twitter } from 'lucide-react';
import { ViewState } from './types';
import { AIConsultant } from './components/AIConsultant';
import { ScholarshipFinder } from './components/ScholarshipFinder';
import { Destinations } from './components/Destinations';
import { Button } from './components/Button';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', view: ViewState.HOME },
    { label: 'Destinations', view: ViewState.DESTINATIONS },
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
            <h2 className="text-3xl font-bold text-center mb-8">Get In Touch</h2>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input type="text" className="w-full p-3 border border-slate-200 rounded-lg" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" className="w-full p-3 border border-slate-200 rounded-lg" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                  <textarea className="w-full p-3 border border-slate-200 rounded-lg h-32" placeholder="How can we help you?"></textarea>
                </div>
                <Button className="w-full">Send Message</Button>
              </div>
              <div className="mt-8 pt-8 border-t border-slate-100 text-center text-slate-600">
                <p className="flex items-center justify-center gap-2 mb-2"><Phone size={18} /> +250 788 123 456</p>
                <p>Kigali Heights, 4th Floor, Kigali, Rwanda</p>
              </div>
            </div>
          </div>
        );
      case ViewState.HOME:
      default:
        return (
          <>
            {/* Hero Section */}
            <div className="relative bg-blue-900 text-white py-24 lg:py-32 overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                 <img src="https://picsum.photos/1200/800?blur=4" className="w-full h-full object-cover" alt="Background" />
              </div>
              <div className="max-w-6xl mx-auto px-4 relative z-10">
                <div className="max-w-3xl">
                  <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    From Rwanda to the <span className="text-blue-300">World</span>.
                  </h1>
                  <p className="text-xl lg:text-2xl text-blue-100 mb-8 font-light">
                    Projado Edu is your trusted partner for university applications, scholarships, and visa guidance. 
                    Turning dreams into degrees.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button onClick={() => setCurrentView(ViewState.SCHOLARSHIPS)} variant="secondary">
                      Find Scholarships
                    </Button>
                    <Button onClick={() => setCurrentView(ViewState.DESTINATIONS)} variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 hover:border-white">
                      Explore Countries
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="py-20 bg-white">
              <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                      <Globe size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Global Network</h3>
                    <p className="text-slate-600">Direct partnerships with universities in USA, Canada, China, and Europe specifically welcoming African students.</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                      <Book size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Expert Guidance</h3>
                    <p className="text-slate-600">From TOEFL/IELTS preparation to Visa interview coaching. We know the Rwandan context.</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                      <GraduationCap size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Scholarship Support</h3>
                    <p className="text-slate-600">Our AI-powered tools help you identify funding opportunities tailored to your profile.</p>
                  </div>
                </div>
              </div>
            </div>

            <Destinations />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setCurrentView(ViewState.HOME)}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                P
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">Projado<span className="text-blue-600">Edu</span></span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex gap-8">
              {navItems.map(item => (
                <button
                  key={item.label}
                  onClick={() => setCurrentView(item.view)}
                  className={`text-sm font-medium transition-colors ${
                    currentView === item.view ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="hidden md:block">
               <Button onClick={() => setCurrentView(ViewState.CONTACT)} variant="primary" className="py-2 px-4 text-sm">
                 Apply Now
               </Button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-slate-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-lg">
            <div className="flex flex-col p-4 gap-4">
              {navItems.map(item => (
                <button
                  key={item.label}
                  onClick={() => {
                    setCurrentView(item.view);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left font-medium p-2 rounded-lg ${
                    currentView === item.view ? 'bg-blue-50 text-blue-600' : 'text-slate-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <Button className="w-full" onClick={() => {
                setCurrentView(ViewState.CONTACT);
                setIsMobileMenuOpen(false);
              }}>Apply Now</Button>
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
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">ProjadoEdu</h3>
              <p className="max-w-sm text-slate-400">
                Empowering Rwandan youth through global education. We simplify the journey from Kigali to the world's best campuses.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => setCurrentView(ViewState.HOME)} className="hover:text-white">Home</button></li>
                <li><button onClick={() => setCurrentView(ViewState.DESTINATIONS)} className="hover:text-white">Destinations</button></li>
                <li><button onClick={() => setCurrentView(ViewState.SCHOLARSHIPS)} className="hover:text-white">Scholarships</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="hover:text-white"><Facebook size={20} /></a>
                <a href="#" className="hover:text-white"><Twitter size={20} /></a>
                <a href="#" className="hover:text-white"><Instagram size={20} /></a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-sm text-center">
            © {new Date().getFullYear()} Projado Edu. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;