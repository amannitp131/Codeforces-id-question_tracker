import { useState } from 'react';

export default function TopSolutions({ contestId, index }) {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const fetchTopSolutions = async () => {
    setLoading(true);
    const users = ['tourist', 'Benq', 'Um_nik', 'Radewoosh', 'Petr'];
    const foundSolutions = [];

    for (const handle of users) {
      try {
        const res = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`);
        const data = await res.json();
        if (data.status === 'OK') {
          const accepted = data.result.find(
            (s) =>
              s.verdict === 'OK' &&
              s.problem.contestId == contestId &&
              s.problem.index === index
          );
          if (accepted) {
            foundSolutions.push({
              handle,
              language: accepted.programmingLanguage,
              timeConsumedMs: accepted.timeConsumedMillis,
              memoryConsumedBytes: accepted.memoryConsumedBytes,
              submissionId: accepted.id,
              link: `https://codeforces.com/contest/${contestId}/submission/${accepted.id}`,
            });
          }
        }
      } catch (err) {
        // Ignore errors for individual users
      }
      if (foundSolutions.length >= 5) break;
    }

    setSolutions(foundSolutions);
    setLoading(false);
    setShow(true);
  };

  return (
    <div className="inline-block ml-2">
      <button
        className="text-xs text-blue-300 underline hover:text-blue-500"
        onClick={fetchTopSolutions}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Top Solutions'}
      </button>
      {show && (
        <div className="bg-gray-900 text-white p-2 mt-2 rounded shadow-lg z-10">
          {solutions.length === 0 && <div>No top solutions found.</div>}
          <ul>
            {solutions.map((sol) => (
              <li key={sol.submissionId} className="mb-1">
                <a
                  href={sol.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {sol.handle}
                </a>{' '}
                <span className="text-xs text-gray-400">
                  [{sol.language}, {sol.timeConsumedMs}ms, {Math.round(sol.memoryConsumedBytes / 1024)}KB]
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}