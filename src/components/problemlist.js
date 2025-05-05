"use client"
import { useState, useEffect } from 'react';
import { fetchSolvedProblems } from '../utils/fetchSolved';

export default function ProblemList({ problems }) {
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [solvedSet, setSolvedSet] = useState(new Set());

  // Fetch solved problems for the user in localStorage
  useEffect(() => {
    const handle = localStorage.getItem('codtrack');
    if (handle) {
      fetchSolvedProblems(handle)
        .then((solved) => {
          const set = new Set(solved.map(p => `${p.contestId}-${p.index}`));
          setSolvedSet(set);
        })
        .catch(() => setSolvedSet(new Set()));
    }
  }, []);

  // Extract ratings and tags from problems
  const ratings = Array.from(new Set(problems.map((p) => p.rating).filter(Boolean))).sort((a, b) => a - b);
  const tags = Array.from(new Set(problems.flatMap((p) => p.tags || []).filter(Boolean))).sort();

  // Filtering logic
  const filtered = problems.filter((p) => {
    const ratingMatch = !selectedRating || p.rating === parseInt(selectedRating);
    const tagMatch = !selectedTag || (p.tags && p.tags.includes(selectedTag));
    return ratingMatch && tagMatch;
  });

  return (
    <div className="p-6 bg-black rounded-lg shadow-md">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div>
          <label className="font-semibold mr-2 text-white">Filter by rating:</label>
          <select
            className="border rounded px-2 py-1 bg-black text-white border-gray-600"
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
          >
            <option value="">All</option>
            {ratings.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-semibold mr-2 text-white">Filter by tag:</label>
          <select
            className="border rounded px-2 py-1 bg-black text-white border-gray-600"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <option value="">All</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      <ul className="space-y-2">
        {filtered.map((p) => {
          const key = `${p.contestId}-${p.index}`;
          const isSolved = solvedSet.has(key);
          return (
            <li
              key={key}
              style={{
                background: isSolved ? '#22c55e' : '#6b7280', // green-500 or gray-500
                borderRadius: '6px',
                padding: '8px'
              }}
            >
              <a
                href={`https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white-900 font-semibold hover:underline"
              >
                {p.name} <span className="text-gray-300">({p.rating || 'Unrated'})</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}