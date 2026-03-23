import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  Share2, 
  Youtube, 
  Globe, 
  MessageSquare, 
  History,
  Sparkles,
  Loader2,
  X
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

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('riassunti_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('riassunti_history', JSON.stringify(history));
  }, [history]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    // Simulate API call
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
    }, 1500);
  };

  const deleteFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-2"
          >
            Riassumi
          </motion.h1>
          <p className="text-slate-400 text-lg">L'eleganza del sapere in poche righe.</p>
        </header>

        {/* Search Section */}
        <section className="mb-12">
          <form onSubmit={handleSearch} className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Cerca un argomento (es: Napoleone)..."
              className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-5 px-6 pl-14 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-500 glass-morphism"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-500/20"
            >
              {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
              <span>{isLoading ? 'Analisi...' : 'Riassumi'}</span>
            </button>
          </form>
        </section>

        {/* Current Result */}
        <AnimatePresence mode="wait">
          {currentSummary && (
            <motion.div
              key={currentSummary.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-12 p-8 rounded-3xl glass-morphism relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-500" />
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-white capitalize">{currentSummary.topic}</h2>
                <button 
                  onClick={() => setCurrentSummary(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              
              <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-relaxed mb-8">
                {currentSummary.content}
              </div>

              <div className="flex flex-wrap gap-4 pt-6 border-t border-white/10">
                <a
                  href={`https://www.google.com/search?q=${currentSummary.topic}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-all border border-white/5"
                >
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>Google</span>
                </a>
                <a
                  href={`https://www.youtube.com/results?search_query=${currentSummary.topic}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-all border border-white/5"
                >
                  <Youtube className="w-4 h-4 text-red-400" />
                  <span>YouTube</span>
                </a>
                <a
                  href={`https://chatgpt.com/?q=Parlami+di+${currentSummary.topic}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-all border border-white/5"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>ChatGPT</span>
                </a>
                <button
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-all border border-white/5 ml-auto"
                >
                  <Share2 className="w-4 h-4 text-slate-400" />
                  <span>Condividi</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History / Saved */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <History className="text-blue-400 w-6 h-6" />
            <h3 className="text-xl font-semibold">Cronologia Salvata</h3>
          </div>
          
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl">
              Nessun riassunto salvato ancora.
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
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
          )}
        </section>
      </div>
    </div>
  );
};

// Component for swipe-to-delete effect
const SwipeableItem: React.FC<{ 
  item: Summary; 
  onDelete: () => void; 
  onClick: () => void;
}> = ({ item, onDelete, onClick }) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0], [0, 1]);
  const scale = useTransform(x, [-100, 0], [0.8, 1]);
  
  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Delete background */}
      <div className="absolute inset-0 bg-red-500/20 flex items-center justify-end px-6 rounded-2xl">
        <Trash2 className="text-red-500" />
      </div>

      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60) {
            onDelete();
          }
        }}
        className="relative z-10 bg-slate-800/80 border border-slate-700/50 p-5 cursor-pointer hover:bg-slate-800 transition-colors rounded-2xl glass-morphism flex justify-between items-center"
        onClick={onClick}
      >
        <div>
          <h4 className="font-bold text-white capitalize text-lg">{item.topic}</h4>
          <p className="text-slate-400 text-sm">{item.date}</p>
        </div>
        <div className="flex gap-2">
          <p className="text-slate-500 text-sm line-clamp-1 max-w-[200px] md:max-w-md italic">
            {item.content}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default App;
