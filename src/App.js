import React, { useState, useEffect } from 'react';
import './App.css';
import HabitList from './components/HabitList';
import HabitForm from './components/HabitForm';
import Login from './components/Login';
import { auth, db } from './firebase';
import { collection, query, where, addDoc, updateDoc, doc, onSnapshot } from 'firebase/firestore';

function App() {
  const [habits, setHabits] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          console.log('User logged in:', user.email); // Debug log
          setUser(user.email);
          
          const habitsQuery = query(
            collection(db, 'habits'),
            where('userEmail', '==', user.email)
          );
          
          const unsubscribeSnapshot = onSnapshot(habitsQuery, 
            (snapshot) => {
              console.log('Snapshot received:', snapshot.size); // Debug log
              const habitsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }));
              console.log('Habits data:', habitsData); // Debug log
              setHabits(habitsData);
            },
            (error) => {
              console.error('Snapshot error:', error);
              setError(error.message);
            }
          );

          return () => {
            unsubscribeSnapshot();
            console.log('Unsubscribed from habits'); // Debug log
          };
        } else {
          console.log('User logged out'); // Debug log
          setUser(null);
          setHabits([]);
        }
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Auth error:', error);
      setError(error.message);
    }
  }, []);

  const addHabit = async (habitName) => {
    try {
      console.log('Adding habit:', habitName); // Debug log
      const newHabit = {
        name: habitName,
        completed: false,
        streak: 0,
        lastCompleted: null,
        userEmail: user,
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(collection(db, 'habits'), newHabit);
      console.log('Habit added with ID:', docRef.id); // Debug log
    } catch (error) {
      console.error('Error adding habit:', error);
      setError(error.message);
    }
  };

  const toggleHabit = async (id) => {
    try {
      console.log('Toggling habit:', id); // Debug log
      const habitRef = doc(db, 'habits', id);
      const habit = habits.find(h => h.id === id);
      
      if (!habit) {
        throw new Error('Habit not found');
      }

      const today = new Date().toDateString();
      const isCompleted = !habit.completed;
      
      await updateDoc(habitRef, {
        completed: isCompleted,
        streak: isCompleted ? habit.streak + 1 : habit.streak - 1,
        lastCompleted: isCompleted ? today : habit.lastCompleted,
        updatedAt: new Date().toISOString()
      });
      console.log('Habit updated successfully'); // Debug log
    } catch (error) {
      console.error('Error updating habit:', error);
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="App">
      <header>
        <h1>Habit Tracker</h1>
        <div className="user-info">
          <span>Welcome, {user}!</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>
      <HabitForm onAdd={addHabit} />
      <HabitList habits={habits} onToggle={toggleHabit} />
    </div>
  );
}

export default App;