"use client";
import React, { useState } from "react";

export default function TopsolPage() {
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
        <div
            style={{
                maxWidth: 400,
                margin: "40px auto",
                padding: 24,
                borderRadius: 8,
                boxShadow: "0 2px 16px rgba(0,0,0,0.5)",
                background: "#181a20",
                fontFamily: "sans-serif",
                color: "#e0e0e0",
                border: "1px solid #23272f",
                transition: "background 0.3s, color 0.3s"
            }}
        >
            <h2 style={{ textAlign: "center", color: "#90caf9" }}>
                Find Codeforces Solution Link 
            </h2>
            <form
                onSubmit={getSolutionLink}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12
                }}
            >
                <label>
                    Contest ID:
                    <input
                        type="text"
                        value={contestId}
                        onChange={e => setContestId(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: 6,
                            marginTop: 2,
                            background: "#23272f",
                            color: "#e0e0e0",
                            border: "1px solid #333",
                            borderRadius: 4,
                            outline: "none"
                        }}
                    />
                </label>
                <label>
                    Problem Index (e.g., A, B, C):
                    <input
                        type="text"
                        value={index}
                        onChange={e => setIndex(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: 6,
                            marginTop: 2,
                            background: "#23272f",
                            color: "#e0e0e0",
                            border: "1px solid #333",
                            borderRadius: 4,
                            outline: "none"
                        }}
                    />
                </label>
                <button
                    type="submit"
                    style={{
                        padding: "8px 0",
                        background: "#1976d2",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "background 0.2s"
                    }}
                    disabled={loading}
                >
                    {loading ? "Searching..." : "Find Solution"}
                </button>
            </form>
            {results.length > 0 && (
                <div style={{ marginTop: 20, color: "#66bb6a" }}>
                    <strong>Accepted Solutions Found:</strong>
                    <ul style={{ paddingLeft: 0, listStyle: "none" }}>
                        {results.map(({ handle, link, time, memory, lang }) => (
                            <li key={handle} style={{ marginBottom: 8 }}>
                                <span style={{ color: "#90caf9" }}>{handle}</span>:{" "}
                                <a
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: "#90caf9", wordBreak: "break-all" }}
                                >
                                    Open Solution
                                </a>
                                <span style={{ color: "#bdbdbd", marginLeft: 8 }}>
                                    [{time} ms, {memory} bytes, {lang}]
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {error && (
                <div style={{ marginTop: 20, color: "#ef5350" }}>
                    {error}
                </div>
            )}
        </div>
    );
}