import React, { useState, useEffect } from 'react';
import { STORAGE_KEYS, getFromStorage, saveToStorage } from '../utils/storage';
import { Plus, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DAYS = ['월', '화', '수', '목', '금'];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 9); // 09 to 22

const COLORS = [
  '#e2f0e0', // soft green
  '#f7e1e6', // soft pink
  '#dcd0ff', // soft purple
  '#fdfd96', // soft yellow
  '#b4e3eb', // soft blue
  '#ffe5b4', // soft orange
];

const Timetable = () => {
  const [subjects, setSubjects] = useState(getFromStorage(STORAGE_KEYS.TIMETABLE, []));
  const [isAdding, setIsAdding] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  
  const [newSubject, setNewSubject] = useState({
    name: '',
    classroom: '',
    professor: '',
    day: '월',
    startHour: 9,
    duration: 1,
    color: COLORS[0],
  });

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TIMETABLE, subjects);
  }, [subjects]);

  const addSubject = (e) => {
    e.preventDefault();
    setSubjects([...subjects, { ...newSubject, id: Date.now() }]);
    setIsAdding(false);
    setNewSubject({
      name: '',
      classroom: '',
      professor: '',
      day: '월',
      startHour: 9,
      duration: 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  };

  const deleteSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
    setSelectedSubject(null);
  };

  return (
    <div className="timetable-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>강의 시간표</h2>
        <button 
          onClick={() => setIsAdding(true)}
          style={{ background: 'var(--accent-green)', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={20} /> 과목 추가
        </button>
      </div>

      <div className="glass-card timetable-grid" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr>
              <th style={{ width: '60px' }}></th>
              {DAYS.map(day => (
                <th key={day} style={{ padding: '1rem', color: 'var(--text-muted)' }}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map(hour => (
              <tr key={hour}>
                <td style={{ textAlign: 'center', padding: '1rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {hour.toString().padStart(2, '0')}:00
                </td>
                {DAYS.map(day => {
                  const subject = subjects.find(s => s.day === day && s.startHour === hour);
                  const isOccupied = subjects.some(s => s.day === day && hour >= s.startHour && hour < s.startHour + s.duration);
                  
                  if (subject) {
                    return (
                      <td 
                        key={day + hour} 
                        rowSpan={subject.duration}
                        onClick={() => setSelectedSubject(subject)}
                        style={{ padding: '2px' }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="subject-block"
                          style={{ 
                            background: subject.color,
                            height: '100%',
                            borderRadius: '12px',
                            padding: '0.8rem',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                            border: '1px solid rgba(255,255,255,0.5)'
                          }}
                        >
                          <strong style={{ fontSize: '0.9rem', marginBottom: '0.2rem' }}>{subject.name}</strong>
                          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{subject.classroom}</span>
                        </motion.div>
                      </td>
                    );
                  }
                  
                  if (isOccupied) return null;
                  
                  return <td key={day + hour} style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', borderRight: '1px solid rgba(255,255,255,0.1)' }}></td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="modal-overlay" onClick={() => setIsAdding(false)}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="glass-card modal-content" 
              onClick={e => e.stopPropagation()}
              style={{ padding: '2rem', maxWidth: '400px', width: '90%' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3>새 과목 추가</h3>
                <X style={{ cursor: 'pointer' }} onClick={() => setIsAdding(false)} />
              </div>
              <form onSubmit={addSubject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input 
                  placeholder="과목명" 
                  value={newSubject.name} 
                  onChange={e => setNewSubject({...newSubject, name: e.target.value})} 
                  required 
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    placeholder="강의실" 
                    style={{ flex: 1 }}
                    value={newSubject.classroom} 
                    onChange={e => setNewSubject({...newSubject, classroom: e.target.value})} 
                  />
                  <input 
                    placeholder="교수명" 
                    style={{ flex: 1 }}
                    value={newSubject.professor} 
                    onChange={e => setNewSubject({...newSubject, professor: e.target.value})} 
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select value={newSubject.day} onChange={e => setNewSubject({...newSubject, day: e.target.value})}>
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select value={newSubject.startHour} onChange={e => setNewSubject({...newSubject, startHour: parseInt(e.target.value)})}>
                    {HOURS.map(h => <option key={h} value={h}>{h}:00</option>)}
                  </select>
                  <select value={newSubject.duration} onChange={e => setNewSubject({...newSubject, duration: parseInt(e.target.value)})}>
                    {[1,2,3,4].map(d => <option key={d} value={d}>{d}시간</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {COLORS.map(c => (
                    <div 
                      key={c} 
                      onClick={() => setNewSubject({...newSubject, color: c})}
                      style={{ 
                        width: '30px', 
                        height: '30px', 
                        borderRadius: '50%', 
                        background: c, 
                        cursor: 'pointer',
                        border: newSubject.color === c ? '2px solid var(--text-main)' : '2px solid transparent'
                      }}
                    />
                  ))}
                </div>
                <button type="submit" style={{ background: 'var(--accent-pink)', color: '#fff', marginTop: '1rem' }}>저장하기</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedSubject && (
          <div className="modal-overlay" onClick={() => setSelectedSubject(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card modal-content" 
              onClick={e => e.stopPropagation()}
              style={{ padding: '2rem', maxWidth: '350px', width: '90%', textAlign: 'center' }}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <X style={{ cursor: 'pointer' }} onClick={() => setSelectedSubject(null)} />
              </div>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: selectedSubject.color, 
                borderRadius: '50%', 
                margin: '0 auto 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Info size={30} color="#fff" />
              </div>
              <h2 style={{ marginBottom: '0.5rem' }}>{selectedSubject.name}</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{selectedSubject.classroom}</p>
              <p style={{ marginBottom: '2rem' }}><strong>{selectedSubject.professor}</strong> 교수님</p>
              <button 
                onClick={() => deleteSubject(selectedSubject.id)}
                style={{ background: 'rgba(255, 0, 0, 0.1)', color: '#ff5c5c', width: '100%' }}
              >
                삭제하기
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.2);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .subject-block {
          transition: transform 0.2s;
        }
      `}</style>
    </div>
  );
};

export default Timetable;
