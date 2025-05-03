"use client"
import { useState } from 'react';
import { fetchSolvedProblems } from '../utils/fetchSolved';
import ProblemList from '../components/problemlist';

export default function Home() {
  const [handle, setHandle] = useState('');
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await fetchSolvedProblems(handle);
      setProblems(result);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h1>Codeforces Solved Problems by Rating</h1>
      <input
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
        placeholder="Enter Codeforces handle"
        style={{ padding: '0.5rem', marginRight: '0.5rem' }}
      />
      <button onClick={handleSearch} style={{ padding: '0.5rem' }}>
        {loading ? 'Loading...' : 'Search'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {problems.length > 0 && <ProblemList problems={problems} />}
    </main>
  );
}
