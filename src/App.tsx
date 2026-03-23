import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  Youtube, 
  Globe, 
  MessageSquare, 
  History,
  Sparkles,
  Loader2,
  X,
  Plus,
  ArrowRight,
  Bookmark,
  Sun,
  Moon,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for Tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Summary {
  id: string;
  topic: string;
  content: string;
  date: string;
}

const MOCK_SUMMARIES: Record<string, string> = {
  "napoleone": "Napoleone Bonaparte (1769-1821) è stato un generale e imperatore francese che ha cambiato il corso della storia europea. Nato in Corsica, scalò rapidamente i ranghi militari durante la Rivoluzione Francese. Divenne Primo Console nel 1799 e Imperatore dei Francesi nel 1804. Le sue campagne militari, note come guerre napoleoniche, estesero l'influenza francese su gran parte dell'Europa continentale. Oltre alle sue conquiste, Napoleone introdusse riforme legislative durature, come il Codice Napoleone, che ha influenzato i sistemi giuridici di molti paesi moderni. La sua egemonia terminò con la disastrosa campagna di Russia nel 1812 e la sconfitta definitiva a Waterloo nel 1815. Morì in esilio sull'isola di Sant'Elena, lasciando un'eredità complessa che spazia dal genio militare alla trasformazione delle istituzioni europee.",
  "giulio cesare": "Gaio Giulio Cesare (100 a.C. - 44 a.C.) è stato uno dei più grandi leader politici e militari della storia romana. Attraverso le sue campagne nelle Gallie, estese i confini della Repubblica Romana fino all'Atlantico e al Reno. Dopo la guerra civile contro Pompeo, divenne il dittatore indiscusso di Roma, avviando una serie di riforme sociali e politiche radicali, tra cui la creazione del calendario giuliano. Il suo assassinio alle Idi di Marzo nel 44 a.C. per mano di un gruppo di senatori guidati da Bruto e Cassio portò a un'ulteriore instabilità che culminò nella fine della Repubblica e nella nascita dell'Impero Romano sotto il suo erede Augusto.",
};

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSummary, setCurrentSummary] = useState<Summary | null>(null);
  const [history, setHistory] = useState<Summary[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const saved = localStorage.getItem('riassunti_history');
    if (saved) setHistory(JSON.parse(saved));
    
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('riassunti_history', JSON.stringify(history));
  }, [history]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      const topic = input.toLowerCase().trim();
      const content = MOCK_SUMMARIES[topic] || 
        `Ecco un riassunto dettagliato su ${input}: Questo argomento riguarda un tema di grande interesse storico e culturale. Lo studio di ${input} rivela molteplici sfaccettature che hanno influenzato lo sviluppo della società contemporanea. Analizzando i dati disponibili, possiamo osservare come l'evoluzione di questo concetto abbia portato a trasformazioni significative in vari settori. È importante notare che ${input} continua ad essere oggetto di dibattito accademico e interesse pubblico, sottolineando la sua rilevanza persistente nel tempo.`;
      
      const newSummary: Summary = {
        id: Date.now().toString(),
        topic: input,
        content: content,
        date: new Date().toLocaleDateString('it-IT')
      };

      setCurrentSummary(newSummary);
      setHistory(prev => [newSummary, ...prev]);
      setIsLoading(false);
      setInput('');
    }, 1200);
  };

  const deleteFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "BUONGIORNO";
    if (hour < 18) return "BUON POMERIGGIO";
    return "BUONASERA";
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-[#3d3d3d] selection-orange font-sans pb-20 flex flex-col">
      <main className="max-w-xl mx-auto px-6 pt-16 md:pt-24 flex-grow w-full space-y-12">
        
        {/* Header Section */}
        <header className="space-y-4 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center md:justify-start gap-3 text-orange-500/80"
          >
            {currentTime.getHours() < 18 ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="text-xs font-black uppercase tracking-[0.3em]">{getGreeting()}</span>
          </motion.div>
          
          <div className="space-y-1">
            <h1 className="text-5xl font-black tracking-tighter text-[#1a1a1a] leading-tight">
              Il tuo Flow.
            </h1>
            <p className="text-lg text-slate-400 font-medium italic">"Un passo alla volta."</p>
          </div>
        </header>

        {/* Central Search Section */}
        <section className="flex flex-col items-center justify-center space-y-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-white rounded-[3rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-slate-50 space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-[#1a1a1a]">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <h3 className="font-black text-lg">Riassumi</h3>
              </div>
            </div>

            <form onSubmit={handleSearch} className="relative group">
              <div className="relative overflow-hidden rounded-[1.5rem] bg-[#f8f9fa] border border-transparent focus-within:border-slate-100 focus-within:bg-white transition-all p-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Cosa vuoi riassumere?"
                  className="w-full bg-transparent py-4 px-5 text-base focus:outline-none placeholder:text-slate-300 font-medium"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 active:scale-95"
                >
                  {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Side-by-side App Icons (Mobile Style) */}
          <div className="flex justify-between items-center w-full px-4">
            <a 
              href="https://www.google.com" 
              target="_blank" 
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-slate-50 group-hover:scale-105 group-active:scale-95 transition-all">
                <Globe className="w-7 h-7 text-blue-500" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-500">Google</span>
            </a>
            <a 
              href="https://chatgpt.com" 
              target="_blank" 
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-slate-50 group-hover:scale-105 group-active:scale-95 transition-all">
                <MessageSquare className="w-7 h-7 text-emerald-500" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-500">ChatGPT</span>
            </a>
            <a 
              href="https://www.youtube.com" 
              target="_blank" 
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-slate-50 group-hover:scale-105 group-active:scale-95 transition-all">
                <Youtube className="w-7 h-7 text-red-500" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-red-500">YouTube</span>
            </a>
          </div>
        </section>

        {/* Current Result Card */}
        <AnimatePresence mode="wait">
          {currentSummary && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[3rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-slate-50 space-y-6 relative"
            >
              <button 
                onClick={() => setCurrentSummary(null)}
                className="absolute top-6 right-6 text-slate-200 hover:text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-orange-500">
                  <Bookmark className="w-4 h-4 fill-current" />
                  <span className="text-[10px] font-black uppercase tracking-widest">RISULTATO</span>
                </div>
                <h2 className="text-3xl font-black tracking-tighter text-[#1a1a1a] capitalize">
                  {currentSummary.topic}
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium opacity-90">
                {currentSummary.content}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History List */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center gap-2 text-slate-300">
            <History className="w-4 h-4" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">CRONOLOGIA RECENTE</h3>
          </div>
          
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {history.map((item) => (
                <SwipeableItem 
                  key={item.id} 
                  item={item} 
                  onDelete={() => deleteFromHistory(item.id)}
                  onClick={() => setCurrentSummary(item)}
                />
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Footer Date */}
        <footer className="pt-12 pb-8 flex justify-center items-center gap-2 text-slate-200">
          <Calendar className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            {currentTime.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}
          </span>
        </footer>
      </main>
    </div>
  );
};

const SwipeableItem: React.FC<{ 
  item: Summary; 
  onDelete: () => void; 
  onClick: () => void;
}> = ({ item, onDelete, onClick }) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0], [1, 0]);
  
  return (
    <div className="relative overflow-hidden rounded-[2rem]">
      <motion.div 
        style={{ opacity }}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-red-400"
      >
        <Trash2 className="w-5 h-5" />
      </motion.div>

      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60) onDelete();
        }}
        className="relative z-10 bg-white border border-slate-50 p-6 cursor-pointer hover:border-orange-100 transition-colors flex justify-between items-center group shadow-sm active:scale-[0.98]"
        onClick={onClick}
      >
        <div className="space-y-1">
          <h4 className="font-black tracking-tight text-[#1a1a1a] capitalize text-lg group-hover:text-orange-500 transition-colors">
            {item.topic}
          </h4>
          <p className="text-slate-200 text-[9px] font-black uppercase tracking-widest">{item.date}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-100 group-hover:text-orange-200 transition-colors" />
      </motion.div>
    </div>
  );
};

export default App;
