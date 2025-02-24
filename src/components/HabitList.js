import React from 'react';

function HabitList({ habits, onToggle }) {
  return (
    <div className="habit-list">
      {habits.map(habit => (
        <div key={habit.id} className="habit-item">
          <input
            type="checkbox"
            checked={habit.completed}
            onChange={() => onToggle(habit.id)}
          />
          <span className="habit-name">{habit.name}</span>
          <span className="habit-streak">Streak: {habit.streak}</span>
        </div>
      ))}
    </div>
  );
}

export default HabitList;