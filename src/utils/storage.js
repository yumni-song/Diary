const STORAGE_KEYS = {
  TIMETABLE: 'diary_timetable',
  STUDY_PLAN: 'diary_study_plan',
  DIARY: 'diary_entries',
};

export const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getFromStorage = (key, defaultValue = null) => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : defaultValue;
};

export { STORAGE_KEYS };
