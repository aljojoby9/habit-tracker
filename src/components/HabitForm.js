import React, { useState } from 'react';

function HabitForm({ onAdd }) {
  const [habitName, setHabitName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (habitName.trim()) {
      onAdd(habitName);
      setHabitName('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={habitName}
        onChange={(e) => setHabitName(e.target.value)}
        placeholder="Enter a new habit"
      />
      <button type="submit">Add Habit</button>
    </form>
  );
}

export default HabitForm;