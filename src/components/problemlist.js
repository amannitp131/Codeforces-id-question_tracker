"use client"
import { useState } from 'react';

export default function ProblemList({ problems }) {
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedparticipantType, setSelectedparticipantType] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  // Extract ratings, participantTypes, and tags from problems
  const ratings = Array.from(new Set(problems.map((p) => p.rating).filter(Boolean))).sort((a, b) => a - b);
  const participantTypes = Array.from(new Set(problems.map((p) => p.participantType).filter(Boolean)));
  const tags = Array.from(new Set(problems.flatMap((p) => p.tags || []).filter(Boolean))).sort();

  // Filtering logic
  const filtered = problems.filter((p) => {
    const ratingMatch = !selectedRating || p.rating === parseInt(selectedRating);
    const participantTypeMatch = !selectedparticipantType || p.participantType === selectedparticipantType;
    const tagMatch = !selectedTag || (p.tags && p.tags.includes(selectedTag));
    return ratingMatch && participantTypeMatch && tagMatch;
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
        <label className="font-semibold mr-2 text-white">Filter by participant type:</label>
        <select
          className="border rounded px-2 py-1 bg-black text-white border-gray-600"
          value={selectedparticipantType}
          onChange={(e) => setSelectedparticipantType(e.target.value)}
        >
          <option value="">All</option>
          {participantTypes.map((pt) => (
            <option key={pt} value={pt}>{pt}</option>
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
      {filtered.map((p) => (
        <li key={`${p.contestId}-${p.index}`}>
          <a
            href={`https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            {p.name} <span className="text-gray-300">({p.rating || 'Unrated'})</span>
          </a>
        </li>
      ))}
    </ul>
    
  </div>
  );
}