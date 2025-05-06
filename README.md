# Codeforces ID Question Tracker

This is  application for competitive programmers to track solved Codeforces problems and quickly find top users' accepted solutions for any contest problem.

## Features

- **Problem Track:**  
  Enter your Codeforces handle to view your solved problems, organized by rating.

- **Top Solution:**  
  Enter a contest ID and problem index to find accepted solutions from top Codeforces users (and your own custom list).

- **Persistent User Tracking:**  
  Your handle is remembered in the browser for up to 30 or 300 days, depending on your choice.

- **Custom Top Handles:**  
  Add your own favorite Codeforces users to the "Top Solution" search.

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to use the app.

## Usage

- On first visit, enter your Codeforces handle in the prompt.
- Use the **Problem Track** tab to search and view your solved problems.
- Use the **Top Solution** tab to find accepted solutions for any contest problem from top users or your custom list.
- Add more handles to your "Top Solution" search using the "+" button.

## Project Structure

- `src/app/page.js` – Main application logic and UI.
- `src/utils/fetchSolved.js` – Fetches solved problems for a user.
- `src/app/components/problemlist.js` – Renders the list of solved problems.
- `server.js` – Backend API for user tracking and custom handle management.



## Learn More

- [Codeforces API](https://codeforces.com/apiHelp)

---

Made for competitive programmers.