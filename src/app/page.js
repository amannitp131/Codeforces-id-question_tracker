"use client"
import { useState, useEffect } from 'react';
import { fetchSolvedProblems } from '../utils/fetchSolved';
import ProblemList from '../components/problemlist';

// --- TopSolution component ---
function TopSolution() {
    const [contestId, setContestId] = useState("");
    const [index, setIndex] = useState("");
    const [results, setResults] = useState([]); // [{handle, link}]
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handles = [
        "orzdevinwang","jiangly","tourist","Dominater069","jtnydv25","MridulAhi","IceKnight1093","arnabmanna","cerberus97","invertedwinger",
        "nishkarsh","socho"
    ];

    async function getSolutionLink(e) {
        e.preventDefault();
        setResults([]);
        setError("");
        setLoading(true);

        let foundAny = false;
        handles.forEach(async (handle) => {
            try {
                const apiUrl = `https://codeforces.com/api/user.status?handle=${handle}&count=10000`;
                const resp = await fetch(apiUrl);
                const data = await resp.json();
                if (data.status !== "OK") return;
                const submissions = data.result;
                const match = submissions.find(
                    (sub) =>
                        sub.problem.contestId == contestId &&
                        sub.problem.index.toUpperCase() === index.toUpperCase() &&
                        sub.verdict === "OK"
                );
                if (match) {
                    foundAny = true;
                    setResults(prev => [
                        ...prev,
                        {
                            handle,
                            link: `https://codeforces.com/contest/${contestId}/submission/${match.id}`,
                            time: match.timeConsumedMillis,
                            memory: match.memoryConsumedBytes,
                            lang: match.programmingLanguage
                        }
                    ]);
                }
            } catch {
                // ignore errors for individual users
            }
        });

        setTimeout(() => {
            setLoading(false);
            if (!foundAny) {
                // setError("No accepted solution found for the given Question among the provided users.");
            }
        }, handles.length * 500);
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 rounded-lg shadow-lg bg-gray-900 font-sans text-gray-100 border border-gray-800 transition-colors duration-300">
            <h2 className="text-center text-blue-300 text-2xl font-semibold mb-6">
                Find Codeforces Solution Link
            </h2>
            <form
                onSubmit={getSolutionLink}
                className="flex flex-col gap-4"
            >
                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-300">Contest ID:</span>
                    <input
                        type="text"
                        value={contestId}
                        onChange={e => setContestId(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-gray-800 text-gray-100 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-300">Problem Index (e.g., A, B, C):</span>
                    <input
                        type="text"
                        value={index}
                        onChange={e => setIndex(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-gray-800 text-gray-100 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                </label>
                <button
                    type="submit"
                    className="py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold transition disabled:opacity-60"
                    disabled={loading}
                >
                    {loading ? "Searching..." : "Find Solution"}
                </button>
            </form>
            {results.length > 0 && (
                <div className="mt-6 text-green-400">
                    <strong className="block mb-2">Accepted Solutions Found:</strong>
                    <ul className="pl-0 list-none">
                        {results.map(({ handle, link, time, memory, lang }) => (
                            <li key={handle} className="mb-2">
                                <span className="text-blue-300">{handle}</span>:{" "}
                                <a
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-300 underline break-all hover:text-blue-400"
                                >
                                    Open Solution
                                </a>
                                <span className="text-gray-400 ml-2 text-xs">
                                    [{time} ms, {memory} bytes, {lang}]
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {error && (
                <div className="mt-6 text-red-400">
                    {error}
                </div>
            )}
        </div>
    );
}
// --- end TopSolution component ---

export default function Home() {
  const [handle, setHandle] = useState('');
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('topSolution'); 

  // Enhanced prompt with "Remember for 30 days" checkbox, and expiry logic
  useEffect(() => {
    if (typeof window !== "undefined") {
      let stored = localStorage.getItem("codtrack");
      let expiry = localStorage.getItem("codtrack_expiry");
      let now = Date.now();

      if (!stored || !expiry || now > Number(expiry)) {
        // Custom modal prompt with checkbox
        let input = "";
        let remember = false;
        // Create modal elements
        const modal = document.createElement("div");
        modal.className = "fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50";
        modal.innerHTML = `
          <div class="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700 max-w-xs w-full flex flex-col gap-4">
            <label class="flex flex-col gap-2">
              <span class="text-gray-200 font-semibold">Enter your Codeforces handle:</span>
              <input id="cf_handle_input" class="px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none" />
            </label>
            <label class="flex items-center gap-2">
              <input id="cf_remember_chk" type="checkbox" class="accent-blue-600" />
              <span class="text-gray-300 text-sm">Remember for 30 days</span>
            </label>
            <button id="cf_submit_btn" class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold transition">Save</button>
          </div>
        `;
        document.body.appendChild(modal);

        return new Promise(() => {
          const inputEl = document.getElementById("cf_handle_input");
          const chkEl = document.getElementById("cf_remember_chk");
          const btnEl = document.getElementById("cf_submit_btn");

          btnEl.onclick = () => {
            input = inputEl.value.trim();
            remember = chkEl.checked;
            if (input) {
              setHandle(input);
              // Set expiry: 30 days if checked, else 300 days
              const days = remember ? 30 : 300;
              const expiryTime = Date.now() + days * 24 * 60 * 60 * 1000;
              localStorage.setItem("codtrack", input);
              localStorage.setItem("codtrack_expiry", expiryTime.toString());
              document.body.removeChild(modal);
            } else {
              inputEl.classList.add("border-red-500");
            }
          };
        });
      } else {
        setHandle(stored);
      }
    }
  }, []);

  const handleSearch = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await fetchSolvedProblems(handle);
      setProblems(result);
      // Only extend expiry if needed, do not update codtrack value
      if (typeof window !== "undefined") {
        let expiry = localStorage.getItem("codtrack_expiry");
        let now = Date.now();
        // If expiry is less than 30 days, extend to 300 days
        if (expiry && Number(expiry) - now < 30 * 24 * 60 * 60 * 1000) {
          const newExpiry = now + 300 * 24 * 60 * 60 * 1000;
          localStorage.setItem("codtrack_expiry", newExpiry.toString());
        }
        // Do NOT update localStorage.setItem("codtrack", handle);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center py-8">
      {/* <h1 className="text-2xl font-bold mb-6">Codeforces Solved Problems by Rating</h1> */}
      <div className="mb-6 flex gap-4">
        <button
          className={`px-4 py-2 rounded-t ${activeTab === 'problemTrack' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          onClick={() => setActiveTab('problemTrack')}
        >
          Problem Track
        </button>
        <button
          className={`px-4 py-2 rounded-t ${activeTab === 'topSolution' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          onClick={() => setActiveTab('topSolution')}
        >
          Top Solution
        </button>
      </div>
      <div className="w-full max-w-xl">
        {activeTab === 'problemTrack' ? (
          <>
            <div className="mb-4 flex gap-2 justify-center mt-10">
              <input
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="Search username"
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
          </>
        ) : (
          <TopSolution />
        )}
      </div>
    </main>
  );
}