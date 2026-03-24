import React, { useEffect, useState } from 'react';
import {
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
  Calendar,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SummaryItem {
  id: string;
  topic: string;
  content: string;
  date: string;
}

const MOCK_SUMMARIES: Record<string, string> = {
  napoleone:
    'Napoleone Bonaparte (1769-1821) è stato un generale e imperatore francese. Divenne famoso dopo la Rivoluzione francese, conquistò gran parte dell’Europa e introdusse importanti riforme amministrative e giuridiche, come il Codice Napoleonico.',
  'giulio cesare':
    'Gaio Giulio Cesare (100 a.C. - 44 a.C.) fu uno dei più grandi leader politici e militari di Roma. Conquistò la Gallia, consolidò il suo potere e contribuì alla fine della Repubblica romana.',
  diritto:
    'Il diritto è l’insieme delle regole che disciplinano la convivenza civile. Si divide in vari rami, come diritto privato, pubblico, penale e amministrativo.',
  cheratocono:
    'Il cheratocono è una patologia della cornea che provoca assottigliamento e deformazione conica, causando visione distorta e astigmatismo irregolare.',
};

const STORAGE_KEY = 'riassumi-smart-history';

function getTodayLabel() {
  return new Date().toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'BUONGIORNO';
  if (hour < 18) return 'BUON POMERIGGIO';
  return 'BUONASERA';
}

function findMockSummary(text: string) {
  const lower = text.toLowerCase();
  const key = Object.keys(MOCK_SUMMARIES).find((k) => lower.includes(k));
  if (!key) return null;
  return {
    topic: key,
    content: MOCK_SUMMARIES[key],
  };
}

export default function App() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSummary, setCurrentSummary] = useState<SummaryItem | null>(null);
  const [history, setHistory] = useState<SummaryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: SummaryItem[] = JSON.parse(saved);
        setHistory(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const handleSummarize = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setCurrentSummary(null);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mock = findMockSummary(trimmed);
    const content =
      mock?.content ??
      `Riassunto di "${trimmed}": questo argomento riguarda i concetti principali, i punti più importanti e una spiegazione semplice per aiutarti a studiare più velocemente. Puoi approfondire cercandolo su Google, YouTube o ChatGPT con i pulsanti rapidi qui sotto.`;

    const newItem: SummaryItem = {
      id: Date.now().toString(),
      topic: trimmed,
      content,
      date: new Date().toLocaleString('it-IT'),
    };

    setCurrentSummary(newItem);
    setHistory((prev) => [newItem, ...prev]);
    setInput('');
    setIsLoading(false);
  };

  const handleDelete = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    if (currentSummary?.id === id) {
      setCurrentSummary(null);
    }
  };

  const handleSaveCurrent = () => {
    if (!currentSummary) return;
    setSavedCount((prev) => prev + 1);
  };

  const openGoogle = () => {
    const query = encodeURIComponent(currentSummary?.topic || input || 'argomento studio');
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  };

  const openYouTube = () => {
    const query = encodeURIComponent(currentSummary?.topic || input || 'argomento studio');
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  };

  const openChatGPT = () => {
    window.open('https://chat.openai.com/', '_blank');
  };

  const bg = darkMode ? '#0f172a' : '#f4f2ee';
  const card = darkMode ? '#111827' : '#ffffff';
  const text = darkMode ? '#f8fafc' : '#111827';
  const sub = darkMode ? '#cbd5e1' : '#94a3b8';
  const border = darkMode ? '#1f2937' : '#e5e7eb';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: bg,
        color: text,
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        padding: '24px 16px 48px',
      }}
    >
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 28,
          }}
        >
          <div>
            <div
              style={{
                color: '#fb923c',
                fontWeight: 700,
                letterSpacing: '0.22em',
                fontSize: 14,
                marginBottom: 10,
              }}
            >
              {getGreeting()}
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 58,
                lineHeight: 1,
                fontWeight: 800,
                letterSpacing: '-0.04em',
              }}
            >
              Il tuo Flow.
            </h1>
            <p
              style={{
                marginTop: 14,
                marginBottom: 0,
                fontSize: 18,
                color: sub,
                fontStyle: 'italic',
              }}
            >
              “Oggi è un nuovo inizio.”
            </p>
          </div>

          <button
            onClick={() => setDarkMode((v) => !v)}
            style={{
              border: `1px solid ${border}`,
              background: card,
              color: text,
              width: 52,
              height: 52,
              borderRadius: 18,
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
            }}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: card,
            borderRadius: 34,
            padding: 26,
            boxShadow: darkMode
              ? '0 10px 30px rgba(0,0,0,0.25)'
              : '0 8px 24px rgba(15,23,42,0.08)',
            border: `1px solid ${border}`,
            marginBottom: 22,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16,
              marginBottom: 18,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Sparkles size={26} color="#6366f1" />
              <div style={{ fontSize: 22, fontWeight: 800 }}>Focus di oggi</div>
            </div>

            <div
              style={{
                color: '#cbd5e1',
                fontWeight: 800,
                letterSpacing: '0.12em',
                fontSize: 14,
              }}
            >
              {history.length}/{savedCount} COMPLETATI
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSummarize();
              }}
              placeholder="Cosa vuoi realizzare?"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                borderRadius: 18,
                padding: '18px 20px',
                background: darkMode ? '#1f2937' : '#f8fafc',
                color: text,
                fontSize: 18,
              }}
            />
            <button
              onClick={handleSummarize}
              style={{
                width: 62,
                height: 62,
                border: 'none',
                borderRadius: 18,
                background: '#f97316',
                color: '#fff',
                cursor: 'pointer',
                boxShadow: '0 10px 24px rgba(249,115,22,0.28)',
              }}
            >
              {isLoading ? <Loader2 className="spin" size={22} /> : <Plus size={26} />}
            </button>
          </div>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20,
            marginBottom: 24,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            style={{
              background: darkMode ? '#111827' : '#eef4ff',
              borderRadius: 34,
              padding: 28,
              minHeight: 240,
              border: `1px solid ${border}`,
            }}
          >
            <div style={{ color: '#3b82f6', marginBottom: 18 }}>
              <Bookmark size={40} />
            </div>
            <div
              style={{
                color: '#60a5fa',
                fontWeight: 800,
                letterSpacing: '0.12em',
                marginBottom: 14,
              }}
            >
              SALVATI
            </div>
            <div style={{ fontSize: 54, fontWeight: 800, color: '#2563eb', lineHeight: 1 }}>
              {savedCount}
            </div>
            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
              <button
                onClick={() => setSavedCount((v) => Math.max(0, v - 1))}
                style={smallBtn('#fff', '#3b82f6')}
              >
                <X size={20} />
              </button>
              <button onClick={() => setSavedCount((v) => v + 1)} style={smallBtn('#3b82f6', '#fff')}>
                <Plus size={20} />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: darkMode ? '#111827' : '#eefbf3',
              borderRadius: 34,
              padding: 28,
              minHeight: 240,
              border: `1px solid ${border}`,
            }}
          >
            <div style={{ color: '#10b981', marginBottom: 18 }}>
              <ArrowRight size={40} />
            </div>
            <div
              style={{
                color: '#10b981',
                fontWeight: 800,
                letterSpacing: '0.12em',
                marginBottom: 14,
              }}
            >
              AVVIO
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: '#059669',
                lineHeight: 1.15,
                maxWidth: 220,
              }}
            >
              Parti da un minuto
            </div>
            <button
              onClick={handleSummarize}
              style={{
                marginTop: 26,
                border: 'none',
                background: '#fff',
                color: '#111827',
                padding: '14px 26px',
                borderRadius: 999,
                cursor: 'pointer',
                fontWeight: 800,
                letterSpacing: '0.1em',
                boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
              }}
            >
              INIZIA
            </button>
          </motion.div>
        </div>

        <AnimatePresence>
          {currentSummary && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
              style={{
                background: card,
                borderRadius: 30,
                padding: 24,
                boxShadow: darkMode
                  ? '0 10px 30px rgba(0,0,0,0.25)'
                  : '0 8px 24px rgba(15,23,42,0.08)',
                border: `1px solid ${border}`,
                marginBottom: 22,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 16,
                  flexWrap: 'wrap',
                  marginBottom: 16,
                }}
              >
                <div>
                  <div style={{ fontSize: 12, color: sub, letterSpacing: '0.12em', fontWeight: 800 }}>
                    RIASSUNTO
                  </div>
                  <h2 style={{ margin: '8px 0 4px', fontSize: 28 }}>{currentSummary.topic}</h2>
                  <div style={{ color: sub, fontSize: 14 }}>{currentSummary.date}</div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={handleSaveCurrent} style={iconBtn(card, text, border)}>
                    <Bookmark size={18} />
                  </button>
                  <button onClick={() => setCurrentSummary(null)} style={iconBtn(card, text, border)}>
                    <X size={18} />
                  </button>
                </div>
              </div>

              <p
                style={{
                  fontSize: 17,
                  lineHeight: 1.7,
                  color: text,
                  marginTop: 0,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {currentSummary.content}
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  flexWrap: 'wrap',
                  marginTop: 18,
                }}
              >
                <button onClick={openGoogle} style={actionBtn('#eff6ff', '#2563eb')}>
                  <Globe size={18} />
                  Google
                </button>
                <button onClick={openYouTube} style={actionBtn('#fff7ed', '#ea580c')}>
                  <Youtube size={18} />
                  YouTube
                </button>
                <button onClick={openChatGPT} style={actionBtn('#f0fdf4', '#16a34a')}>
                  <MessageSquare size={18} />
                  ChatGPT
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          style={{
            background: card,
            borderRadius: 30,
            padding: 24,
            boxShadow: darkMode
              ? '0 10px 30px rgba(0,0,0,0.25)'
              : '0 8px 24px rgba(15,23,42,0.08)',
            border: `1px solid ${border}`,
            marginBottom: 32,
          }}
        >
          <button
            onClick={() => setShowHistory((v) => !v)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'transparent',
              border: 'none',
              color: text,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <History size={22} color="#8b5cf6" />
              <span style={{ fontSize: 22, fontWeight: 800 }}>Cronologia</span>
            </div>
            <span style={{ color: sub, fontWeight: 700 }}>{showHistory ? 'NASCONDI' : 'MOSTRA'}</span>
          </button>

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 18 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                style={{ overflow: 'hidden' }}
              >
                {history.length === 0 ? (
                  <div
                    style={{
                      padding: 18,
                      borderRadius: 20,
                      background: darkMode ? '#0f172a' : '#f8fafc',
                      color: sub,
                    }}
                  >
                    Nessun riassunto salvato per ora.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 12 }}>
                    {history.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 14,
                          alignItems: 'flex-start',
                          padding: 18,
                          borderRadius: 20,
                          background: darkMode ? '#0f172a' : '#f8fafc',
                          border: `1px solid ${border}`,
                        }}
                      >
                        <div
                          style={{ cursor: 'pointer', flex: 1 }}
                          onClick={() => setCurrentSummary(item)}
                        >
                          <div style={{ fontWeight: 800, marginBottom: 6 }}>{item.topic}</div>
                          <div
                            style={{
                              color: sub,
                              fontSize: 14,
                              marginBottom: 8,
                            }}
                          >
                            {item.date}
                          </div>
                          <div style={{ color: text, lineHeight: 1.5 }}>
                            {item.content.slice(0, 120)}...
                          </div>
                        </div>

                        <button
                          onClick={() => handleDelete(item.id)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            color: '#ef4444',
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div
          style={{
            textAlign: 'center',
            color: '#c4c4c4',
            paddingTop: 8,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              fontWeight: 800,
              letterSpacing: '0.12em',
              marginBottom: 12,
            }}
          >
            <Calendar size={18} />
            {getTodayLabel().toUpperCase()}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>
            CUSTODISCI IL TUO TEMPO, OGNI GIORNO.
          </div>
        </div>
      </div>
    </div>
  );
}

function smallBtn(background: string, color: string): React.CSSProperties {
  return {
    width: 58,
    height: 58,
    borderRadius: 999,
    border: 'none',
    background,
    color,
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
  };
}

function iconBtn(background: string, color: string, border: string): React.CSSProperties {
  return {
    width: 44,
    height: 44,
    borderRadius: 14,
    border: `1px solid ${border}`,
    background,
    color,
    cursor: 'pointer',
  };
}

function actionBtn(background: string, color: string): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    border: 'none',
    background,
    color,
    padding: '12px 16px',
    borderRadius: 14,
    cursor: 'pointer',
    fontWeight: 700,
  };
}