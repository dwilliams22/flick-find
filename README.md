# Flick Find

Find movies you'll enjoy without the hassle.

## Overview

Flick Find is a movie discovery app that lets you browse popular films and search across thousands of titles from The Movie Database (TMDB). When you open the app, you see the most popular movies right away. Start typing and results update as you type, with no search button needed. Every search is recorded in an Appwrite database, and the five most-searched titles appear in a live "Trending Movies" section at the top of the page.

## Key Features

- **Discover popular movies:** the home page loads TMDB's most popular titles, sorted by popularity, as soon as you arrive.
- **Debounced live search:** results update 500ms after you stop typing, so the app doesn't send a request on every keystroke.
- **Movie cards:** each result shows the poster, title, rating (to one decimal place), original language, and release year, with a fallback image when a poster is missing.
- **Trending Movies:** every search is counted in Appwrite. The five most-searched terms are shown in a ranked list with their posters.
- **Search tracking:** the first time someone searches a term, a new row is created with the top result's poster and movie ID. Searching the same term again increments its count.
- **Loading and error states:** a spinner appears while movies load, and a clear message is shown if the request fails.
- **Cinematic dark UI** with a hero banner, gradient headline text, and a responsive movie grid.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS v4, Flowbite React (spinner component)
- **Movie data:** TMDB REST API (`/discover/movie` and `/search/movie`)
- **Backend / database:** Appwrite Cloud (TablesDB) for storing search counts
- **Hooks:** `react-use` for `useDebounce`
- **Tooling:** ESLint, TypeScript project references

## Technical Highlights

- Typing the Appwrite TablesDB SDK end to end by passing a `SearchMetric` row type to `listRows`, `createRow`, and `updateRow`, so the columns read and written are checked by the compiler.
- Keeping API traffic low with a debounced search input that only queries TMDB after the user pauses.
- Building a simple "trending" ranking on top of Appwrite with `Query.orderDesc('count')` and `Query.limit(5)`.
- Typing environment variables through `ImportMetaEnv` and failing early with a clear error if any Appwrite variable is missing.
- Handling Appwrite failures without breaking the page: errors are logged with their code and type, and the trending section falls back to an empty list.

## Getting Started

This is a [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org) project built with [Vite](https://vite.dev).

### Environment variables

The app talks to TMDB and Appwrite from the browser. Create a `.env.local` file in the project root:

```bash
VITE_TMDB_API_KEY=your-tmdb-read-access-token
VITE_APPWRITE_ENDPOINT=https://<region>.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-appwrite-project-id
VITE_APPWRITE_DATABASE_ID=your-appwrite-database-id
VITE_APPWRITE_TABLE_ID=your-appwrite-table-id
```

### Appwrite setup

In the Appwrite Console:

1. Create a database and a table with these columns: `searchTerm` (string), `count` (integer), `movie_id` (integer), and `poster_url` (string).
2. Under the table's **Permissions**, give the **Any** role **Read**, **Create**, and **Update** access.
3. Under **Platforms**, add a **Web** platform with `localhost` as the hostname.

### Run the development server

Install dependencies, then start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

You can start editing the page by modifying `src/App.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about the tools used in this project, take a look at the following resources:

- [Vite Documentation](https://vite.dev/guide/) - learn about Vite features and configuration.
- [Appwrite TablesDB Documentation](https://appwrite.io/docs/products/databases) - learn about Appwrite databases, tables, and queries.
- [TMDB API Documentation](https://developer.themoviedb.org/docs) - learn about the movie data endpoints.

## Deploy on Vercel

The easiest way to deploy this Vite app is with the [Vercel Platform](https://vercel.com/new). Vercel detects Vite automatically (build command `npm run build`, output directory `dist`).

Remember to:

- Add all the `VITE_*` environment variables to your Vercel project settings, then redeploy. Vite builds them into the bundle at build time.
- Add your Vercel domain (for example `flick-find.vercel.app`) as a **Web** platform in the Appwrite Console, or Appwrite will reject requests from production.

Check out the [Vite deployment guide](https://vite.dev/guide/static-deploy.html#vercel) for more details.
