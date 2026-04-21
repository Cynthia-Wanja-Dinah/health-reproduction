import { motion } from 'motion/react';
import { Shield, Lock, Info, ArrowRight, MessageCircle, MapPin, ClipboardCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const features = [
    {
      title: "Private Chat",
      desc: "Ask anything stigma-free. Support for English & Swahili.",
      icon: MessageCircle,
      path: "/chat",
      color: "bg-sage-600"
    },
    {
      title: "Clinic Finder",
      desc: "Find nearest healthcare centers for SRH services.",
      icon: MapPin,
      path: "/clinics",
      color: "bg-blue-600"
    },
    {
      title: "Contraceptive Help",
      desc: "Compare methods and find what's right for you.",
      icon: ClipboardCheck,
      path: "/recommendations",
      color: "bg-purple-600"
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-20">
      <section className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-100 text-sage-700 text-xs font-bold uppercase tracking-wider"
        >
          <Shield size={14} />
          Safe, Private & Free
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight"
        >
          Your confidential <span className="text-sage-600">health assistant</span>.
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 text-lg md:text-xl max-w-xl mx-auto"
        >
          Get accurate information on contraceptives, STIs, and maternal health without judgment.
        </motion.p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
          >
            <Link 
              to={feature.path}
              className="group glass-card p-6 flex flex-col h-full hover:shadow-lg transition-all"
            >
              <div className={`${feature.color} text-white w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500 flex-1">{feature.desc}</p>
              <div className="mt-4 flex items-center text-sage-600 font-bold text-xs">
                GET STARTED <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        ))}
      </section>

      <section className="bg-white rounded-3xl p-8 border border-sage-100 shadow-sm space-y-6">
        <div className="flex items-start gap-4">
          <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
            <Lock size={24} />
          </div>
          <div>
            <h3 className="font-bold text-xl mb-1">Total Privacy</h3>
            <p className="text-slate-500 text-sm">
              We do not store your name or ID. All data is anonymized and encrypted. Use Guest Mode to keep your identity hidden.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 border-t border-slate-50 pt-6">
          <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
            <Info size={24} />
          </div>
          <div>
            <h3 className="font-bold text-xl mb-1">Myth-Busting</h3>
            <p className="text-slate-500 text-sm">
              Ask us about common misconceptions. "Do pills make you infertile?" "Can I get pregnant on my period?" Get factual answers instantly.
            </p>
          </div>
        </div>
      </section>

      <footer className="text-center py-10 opacity-50 space-y-4">
        <p className="text-xs max-w-sm mx-auto">
          Built with care for Kenyans. Always seek professional help for clinical symptoms.
        </p>
        <div className="flex justify-center gap-4 text-[10px] font-bold tracking-tighter">
          <span className="uppercase">Terms of use</span>
          <span className="uppercase">Privacy Policy</span>
          <span className="uppercase uppercase">About</span>
        </div>
      </footer>
    </div>
  );
}
