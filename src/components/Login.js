import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import '../styles/Login.css';

function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      onLogin(result.user.email);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
        alert('Registration successful! Please login.');
        setIsRegistering(false);
        setCredentials({ email: '', password: '' });
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
        onLogin(userCredential.user.email);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            required
          />
          <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
        </form>
        <button className="google-btn" onClick={handleGoogleSignIn}>
          Sign in with Google
        </button>
        <button 
          className="toggle-auth"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
        </button>
      </div>
    </div>
  );
}

export default Login;