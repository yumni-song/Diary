import React, { useState, useEffect } from 'react';
import { STORAGE_KEYS, getFromStorage, saveToStorage } from '../utils/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Smile, Trash2 } from 'lucide-react';

const MOODS = [
  { emoji: '😊', label: '행복' },
  { emoji: '🥰', label: '사랑' },
  { emoji: '🤩', label: '신남' },
  { emoji: '😴', label: '피곤' },
  { emoji: '😢', label: '슬픔' },
  { emoji: '🤔', label: '생각' },
  { emoji: '😡', label: '화남' },
];

const Diary = () => {
  const [entries, setEntries] = useState(getFromStorage(STORAGE_KEYS.DIARY, []));
  const [currentEntry, setCurrentEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    mood: '😊',
    content: ''
  });

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.DIARY, entries);
  }, [entries]);

  const saveEntry = (e) => {
    e.preventDefault();
    if (!currentEntry.content.trim()) return;

    const existingIndex = entries.findIndex(e => e.date === currentEntry.date);
    if (existingIndex > -1) {
      const newEntries = [...entries];
      newEntries[existingIndex] = { ...currentEntry, id: entries[existingIndex].id };
      setEntries(newEntries);
    } else {
      setEntries([{ ...currentEntry, id: Date.now() }, ...entries]);
    }
    
    alert('일기가 저장되었습니다! ✨');
  };

  const deleteEntry = (id) => {
    if (window.confirm('일기를 삭제할까요?')) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  const editEntry = (entry) => {
    setCurrentEntry(entry);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="diary-container">
      <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem' }}>오늘의 일기</h2>
      
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '3rem' }}>
        <form onSubmit={saveEntry} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
              <Calendar size={20} color="var(--text-muted)" />
              <input 
                type="date" 
                value={currentEntry.date} 
                onChange={e => setCurrentEntry({...currentEntry, date: e.target.value})}
                style={{ flex: 1 }}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {MOODS.map(m => (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => setCurrentEntry({...currentEntry, mood: m.emoji})}
                  style={{
                    padding: '0.5rem',
                    background: currentEntry.mood === m.emoji ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
                    fontSize: '1.2rem',
                    borderRadius: '50%',
                    width: '45px',
                    height: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: currentEntry.mood === m.emoji ? '1px solid var(--accent-pink)' : '1px solid transparent'
                  }}
                  title={m.label}
                >
                  {m.emoji}
                </button>
              ))}
            </div>
          </div>
          
          <textarea
            placeholder="오늘 하루는 어땠나요?"
            style={{ minHeight: '200px', resize: 'vertical', lineHeight: '1.6' }}
            value={currentEntry.content}
            onChange={e => setCurrentEntry({...currentEntry, content: e.target.value})}
          />
          
          <button 
            type="submit" 
            style={{ 
              background: 'var(--accent-pink)', 
              color: '#fff', 
              fontSize: '1.1rem',
              boxShadow: '0 4px 15px rgba(247, 168, 184, 0.4)'
            }}
          >
            기록하기
          </button>
        </form>
      </div>

      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Smile size={24} /> 지난 기록들
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <AnimatePresence>
          {entries.map(entry => (
            <motion.div
              key={entry.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card"
              style={{ padding: '1.5rem', cursor: 'pointer' }}
              onClick={() => editEntry(entry)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontWeight: '800', color: 'var(--text-muted)' }}>{entry.date}</span>
                <span style={{ fontSize: '1.5rem' }}>{entry.mood}</span>
              </div>
              <p style={{ 
                lineHeight: '1.5', 
                overflow: 'hidden', 
                display: '-webkit-box', 
                WebkitLineClamp: 3, 
                WebkitBoxOrient: 'vertical',
                marginBottom: '1rem'
              }}>
                {entry.content}
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Trash2 
                  size={18} 
                  color="#ff5c5c" 
                  style={{ cursor: 'pointer', opacity: 0.6 }} 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteEntry(entry.id);
                  }}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {entries.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            첫 번째 일기를 작성해보세요!
          </div>
        )}
      </div>
    </div>
  );
};

export default Diary;
