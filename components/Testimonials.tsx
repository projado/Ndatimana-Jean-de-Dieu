import React from 'react';
import { Quote, MapPin } from 'lucide-react';

const testimonials = [
  {
    name: "Ineza Grace",
    uni: "University of Toronto, Canada",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
    quote: "The Canadian SDS visa stream seemed like a mountain I couldn't climb alone. I was overwhelmed by the GIC requirements and the strict financial documentation. Projado didn't just give me a checklist; they sat down with my parents to structure our proof of funds perfectly. They even helped me book my medical exam in time for the September intake. Now I'm thriving in Toronto, and it all started with that first consultation.",
    course: "MSc Public Health"
  },
  {
    name: "David Nshimiyimana",
    uni: "Tsinghua University, China",
    image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=200&q=80",
    quote: "I had almost given up on studying abroad due to costs. I never imagined I'd be studying Civil Engineering in Beijing on a fully funded Belt and Road scholarship! Projado's team identified this opportunity when I was only looking at Europe. They helped me with the physical examination forms and the JW202 visa form. The pre-departure orientation about life in China—from WeChat to VPNs—was a lifesaver.",
    course: "Civil Engineering"
  },
  {
    name: "Divine Uwase",
    uni: "University of Manchester, UK",
    image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=200&q=80",
    quote: "My CAS letter was delayed, and I was panicking about missing my flight. The Projado team directly contacted the University of Manchester's admissions office on my behalf to expedite the process. Beyond the paperwork, their 'Life in UK' workshop prepared me for everything from opening a bank account to navigating the National Rail. It felt less like hiring a consultant and more like having a knowledgeable big brother.",
    course: "BSc Computer Science"
  },
  {
    name: "Jean-Paul Mugisha",
    uni: "Georgia Tech, USA",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    quote: "Everyone warned me about the F1 visa interview rejection rates. Projado conducted three mock interviews with me, refining my answers until I was confident. When the consular officer asked about my intent to return to Rwanda, I knew exactly what to say. I'm now researching AI in Atlanta, and I owe my confidence to their rigorous preparation strategies regarding home ties.",
    course: "MSc Computer Science"
  },
  {
    name: "Sandrine Iribagiza",
    uni: "RWTH Aachen, Germany",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    quote: "Germany offers free tuition, but the bureaucracy is tough. I was confused about the Blocked Account (Sperrkonto) and health insurance requirements. Projado guided me through the Expatrio setup and university enrollment. They even connected me with a Rwandan alumni group in Aachen before I left Kigali, so I had friends waiting for me when I landed.",
    course: "Mechanical Engineering"
  },
  {
    name: "Eric Habimana",
    uni: "University of Melbourne, Australia",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    quote: "I wanted a destination with good post-study work rights. Projado analyzed my profile and suggested Australia. They helped me navigate the GTE (Genuine Temporary Entrant) statement, which is the trickiest part of the Aussie visa. Their expertise turned a complex 20-page application into a streamlined success. The coffee culture in Melbourne is just a bonus!",
    course: "Master of Public Policy"
  },
  {
    name: "Alice Mutesi",
    uni: "Sciences Po, France",
    image: "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&w=200&q=80",
    quote: "The 'Etudes en France' procedure is notoriously complex, especially when coordinating with Campus France in Kigali. Projado's guidance was invaluable. They helped me secure a housing certificate which is mandatory for the visa, and guided me through the CAF application for housing aid once I arrived in Paris. I'm now studying International Development with a full Eiffel Excellence Scholarship.",
    course: "Master in International Development"
  },
  {
    name: "Patrick Ndayisaba",
    uni: "KAIST, South Korea",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    quote: "I was targeting a tech-heavy curriculum and Projado suggested South Korea. I was worried about the language barrier, but they connected me with the Global Korea Scholarship (GKS) program which includes a year of language training. Their team helped me draft a compelling personal statement that highlighted my coding projects in Rwanda, which was key to my acceptance at KAIST.",
    course: "Computer Science"
  }
];

export const Testimonials: React.FC = () => {
  return (
    <div className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden transition-colors duration-300">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 dark:bg-red-900/20 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-50 dark:bg-amber-900/20 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-sm font-semibold mb-4 border border-red-100 dark:border-red-900/50">
             Student Stories
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Voices from the Diaspora</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Hear from Rwandan students we've helped place in top universities across the globe.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl relative hover:-translate-y-2 transition-transform duration-300 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg hover:shadow-red-900/5 group flex flex-col h-full">
              {/* Quote Icon */}
              <div className="absolute top-8 right-8 text-red-100 dark:text-red-900/30 group-hover:text-red-200 dark:group-hover:text-red-800/50 transition-colors">
                <Quote size={48} />
              </div>

              {/* Profile */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-red-800 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <img src={t.image} alt={t.name} className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-slate-600 relative z-10 shadow-md" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">{t.name}</h4>
                  <div className="flex flex-wrap items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                    <MapPin size={10} className="text-red-500 shrink-0" />
                    <span className="truncate max-w-[150px]">{t.uni}</span>
                  </div>
                </div>
              </div>

              {/* Quote Body */}
              <p className="text-slate-600 dark:text-slate-300 italic mb-6 relative z-10 leading-relaxed flex-grow text-sm">"{t.quote}"</p>

              {/* Tag */}
              <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
                 <div className="inline-block bg-white dark:bg-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold text-red-800 dark:text-red-300 border border-red-100 dark:border-red-900/50 shadow-sm">
                    {t.course}
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};