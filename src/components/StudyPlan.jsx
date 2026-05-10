import React, { useState, useEffect } from 'react';
import { STORAGE_KEYS, getFromStorage, saveToStorage } from '../utils/storage';
import { CheckCircle, Circle, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudyPlan = () => {
  const [activeTab, setActiveTab] = useState('weekly');
  const [plans, setPlans] = useState(getFromStorage(STORAGE_KEYS.STUDY_PLAN, {
    yearly: [],
    monthly: [],
    weekly: []
  }));
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.STUDY_PLAN, plans);
  }, [plans]);

  const addPlan = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const newPlan = {
      id: Date.now(),
      text: inputValue,
      completed: false
    };
    
    setPlans({
      ...plans,
      [activeTab]: [newPlan, ...plans[activeTab]]
    });
    setInputValue('');
  };

  const togglePlan = (id) => {
    setPlans({
      ...plans,
      [activeTab]: plans[activeTab].map(p => 
        p.id === id ? { ...p, completed: !p.completed } : p
      )
    });
  };

  const deletePlan = (id) => {
    setPlans({
      ...plans,
      [activeTab]: plans[activeTab].filter(p => p.id !== id)
    });
  };

  const tabs = [
    { id: 'yearly', label: '연간 계획' },
    { id: 'monthly', label: '월간 계획' },
    { id: 'weekly', label: '주간 계획' }
  ];

  return (
    <div className="study-plan-container">
      <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem' }}>학습 계획</h2>
      
      <div className="glass-card" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              background: activeTab === tab.id ? 'var(--accent-pink)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
              boxShadow: activeTab === tab.id ? '0 4px 15px rgba(247, 168, 184, 0.4)' : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass-card" style={{ padding: '2rem', minHeight: '400px' }}>
        <form onSubmit={addPlan} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <input
            style={{ flex: 1 }}
            placeholder={`${tabs.find(t => t.id === activeTab).label}을 입력하세요...`}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
          />
          <button type="submit" style={{ background: 'var(--accent-green)', color: '#fff' }}>
            <Plus size={20} />
          </button>
        </form>

        <div className="plan-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AnimatePresence mode='popLayout'>
            {plans[activeTab].map(plan => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="plan-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.4)',
                  borderRadius: '15px',
                  border: '1px solid var(--glass-border)'
                }}
              >
                <div 
                  onClick={() => togglePlan(plan.id)}
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                  {plan.completed ? 
                    <CheckCircle color="var(--accent-green)" fill="var(--accent-green)" style={{ opacity: 0.8 }} /> : 
                    <Circle color="var(--text-muted)" />
                  }
                </div>
                <span style={{ 
                  flex: 1, 
                  textDecoration: plan.completed ? 'line-through' : 'none',
                  color: plan.completed ? 'var(--text-muted)' : 'var(--text-main)'
                }}>
                  {plan.text}
                </span>
                <Trash2 
                  size={18} 
                  color="#ff5c5c" 
                  style={{ cursor: 'pointer', opacity: 0.6 }} 
                  onClick={() => deletePlan(plan.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          {plans[activeTab].length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              등록된 계획이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyPlan;
