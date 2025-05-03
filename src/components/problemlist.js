"use client"
import { useState } from 'react';

export default function ProblemList({ problems }) {
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedParticipantType, setSelectedParticipantType] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  // Extract ratings, participantTypes, and tags from problems
  const ratings = Array.from(new Set(problems.map((p) => p.rating).filter(Boolean))).sort((a, b) => a - b);
  const participantTypes = Array.from(new Set(problems.map((p) => p.participantType).filter(Boolean)));
  const tags = Array.from(new Set(problems.flatMap((p) => p.tags || []).filter(Boolean))).sort();

  // Filtering logic
  const filtered = problems.filter((p) => {
    const ratingMatch = !selectedRating || p.rating === parseInt(selectedRating);
    const participantTypeMatch = !selectedParticipantType || p.participantType === selectedParticipantType;
    const tagMatch = !selectedTag || (p.tags && p.tags.includes(selectedTag));
    return ratingMatch && participantTypeMatch && tagMatch;
  });

  return (
    <div>
      <label><strong>Filter by rating: </strong></label>
      <select value={selectedRating} onChange={(e) => setSelectedRating(e.target.value)}>
        <option value="">All</option>
        {ratings.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>

      <label style={{ marginLeft: '1rem' }}><strong>Filter by participant type: </strong></label>
      <select value={selectedParticipantType} onChange={(e) => setSelectedParticipantType(e.target.value)}>
        <option value="">All</option>
        {participantTypes.map((pt) => (
          <option key={pt} value={pt}>{pt}</option>
        ))}
      </select>

      <label style={{ marginLeft: '1rem' }}><strong>Filter by tag: </strong></label>
      <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
        <option value="">All</option>
        {tags.map((tag) => (
          <option key={tag} value={tag}>{tag}</option>
        ))}
      </select>

      <ul style={{ marginTop: '1rem' }}>
        {filtered.map((p) => (
          <li key={`${p.contestId}-${p.index}`}>
            <a
              href={`https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {p.name} ({p.rating || 'Unrated'})
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}