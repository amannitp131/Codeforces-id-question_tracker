export async function fetchSolvedProblems(handle) {
    const res = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`);
    const data = await res.json();
    if (data.status !== "OK") throw new Error("User not found or API error");
  
    const solvedSet = new Set();
    const problems = [];
  
    data.result.forEach((submission) => {
      if (submission.verdict === "OK") {
        const problem = submission.problem;
        const key = `${problem.contestId}-${problem.index}`;
        if (!solvedSet.has(key)) {
          solvedSet.add(key);
          problems.push(problem);
        }
      }
    });
  
    return problems;
  }
  