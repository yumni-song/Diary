import React, { useState } from 'react';
import Timetable from './components/Timetable';
import StudyPlan from './components/StudyPlan';
import Diary from './components/Diary';
import { Calendar, CheckSquare, BookOpen, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {

  return (
    <div className="container">
      <header style={{ 
        padding: '2rem 0', 
        textAlign: 'center', 
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.8rem', 
            background: 'var(--glass-bg)',
            padding: '0.5rem 1.2rem',
            borderRadius: '50px',
            marginBottom: '1rem',
            border: '1px solid var(--glass-border)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
          }}
        >
          <GraduationCap size={24} color="var(--accent-pink)" />
          <span style={{ fontWeight: '800', letterSpacing: '1px', fontSize: '0.9rem', color: 'var(--text-main)' }}>
            UNIVERSITY DIARY
          </span>
        </motion.div>
        <motion.h1 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-main)' }}
        >
          나만의 꿈꾸는 다이어리
        </motion.h1>
      </header>

      <main className="dashboard-grid">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="dashboard-main"
        >
          <Timetable />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="dashboard-sidebar"
        >
          <StudyPlan />
          <Diary />
        </motion.div>
      </main>

      <footer style={{ 
        marginTop: '5rem', 
        textAlign: 'center', 
        padding: '2rem', 
        color: 'var(--text-muted)',
        fontSize: '0.9rem'
      }}>
        © 2026 Dreamy University Diary. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
