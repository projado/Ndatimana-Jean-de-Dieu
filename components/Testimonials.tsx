import React from 'react';
import { Quote, MapPin } from 'lucide-react';

const testimonials = [
  {
    name: "Ineza Grace",
    uni: "University of Toronto, Canada",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
    quote: "Projado simplified the complex Canadian visa process. I was worried about proof of funds, but their consultant guided me through every document required for the SDS stream.",
    course: "MSc Public Health"
  },
  {
    name: "David Nshimiyimana",
    uni: "Tsinghua University, China",
    image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=200&q=80",
    quote: "I never thought I could get a full scholarship. Projado's AI finder matched me with a Belt and Road scholarship I hadn't even heard of! Now I'm studying in Beijing.",
    course: "Civil Engineering"
  },
  {
    name: "Divine Uwase",
    uni: "University of Manchester, UK",
    image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=200&q=80",
    quote: "From IELTS prep in Kigali to finding accommodation in Manchester, the team was there. It felt like having a big brother guiding you through the UK student visa maze.",
    course: "BSc Computer Science"
  }
];

export const Testimonials: React.FC = () => {
  return (
    <div className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-red-50 text-red-800 rounded-full text-sm font-semibold mb-4 border border-red-100">
             Student Stories
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Voices from the Diaspora</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Hear from Rwandan students we've helped place in top universities across the globe.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-slate-50 p-8 rounded-2xl relative hover:-translate-y-2 transition-transform duration-300 border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-red-900/5 group">
              {/* Quote Icon */}
              <div className="absolute top-8 right-8 text-red-100 group-hover:text-red-200 transition-colors">
                <Quote size={48} />
              </div>

              {/* Profile */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-800 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <img src={t.image} alt={t.name} className="w-16 h-16 rounded-full object-cover border-2 border-white relative z-10 shadow-md" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{t.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                    <MapPin size={10} className="text-red-500" />
                    {t.uni}
                  </div>
                </div>
              </div>

              {/* Quote Body */}
              <p className="text-slate-600 italic mb-6 relative z-10 leading-relaxed">"{t.quote}"</p>

              {/* Tag */}
              <div className="inline-block bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-red-800 border border-red-100 shadow-sm">
                {t.course}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};