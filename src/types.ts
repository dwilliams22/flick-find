import type { Models } from 'appwrite'

// Movie shape returned by the TMDB search/discover endpoints
export type Movie = {
  id: number
  title: string
  vote_average: number
  poster_path: string | null
  release_date: string
  original_language: string
}

export type MovieListResponse = {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

// Columns stored in the Appwrite search-metrics table
export type SearchMetric = Models.Row & {
  searchTerm: string
  count: number
  movie_id: number
  poster_url: string
}
