"use client"
import { useState } from 'react';
import { fetchSolvedProblems } from '../utils/fetchSolved';
import ProblemList from '../components/problemlist';
import TopSolutions from '../components/TopSolutions';

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
    <main className="min-h-screen bg-black text-white flex flex-col items-center py-8">
      <h1 className="text-2xl font-bold mb-6">Codeforces Solved Problems by Rating</h1>
      <div className="mb-4 flex gap-2">
        <input
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="Enter Codeforces handle"
          className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          {loading ? 'Loading...' : 'Search'}
        </button>
      </div>
      {error && <p className="text-red-400 mb-4">{error}</p>}
      {problems.length > 0 && <ProblemList problems={problems} />}
    </main>
  );
}