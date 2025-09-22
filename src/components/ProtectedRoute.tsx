import React, { useState, useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState('');

  const correctPassword = 'uranus123'; // change le !

  useEffect(() => {
    if (localStorage.getItem('pedagogieAuthorized') === 'true') {
      setAuthorized(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setAuthorized(true);
      localStorage.setItem('pedagogieAuthorized', 'true');
    } else {
      alert('Mot de passe incorrect !');
    }
  };

  if (!authorized) {
    return (
      <div style={{ maxWidth: 400, margin: '50px auto', textAlign: 'center' }}>
        <h2>Accès protégé</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
          />
          <button type="submit" style={{ padding: '8px 16px' }}>
            Entrer
          </button>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
