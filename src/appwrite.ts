import { AppwriteException, Client, ID, Query, TablesDB } from 'appwrite'
import type { Movie, SearchMetric } from './types'

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID

if (!PROJECT_ID || !ENDPOINT || !DATABASE_ID || !TABLE_ID) {
  throw new Error(
    'Missing Appwrite env vars: VITE_APPWRITE_PROJECT_ID, VITE_APPWRITE_ENDPOINT, VITE_APPWRITE_DATABASE_ID, VITE_APPWRITE_TABLE_ID',
  )
}

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID)

const tablesDB = new TablesDB(client)

const logAppwriteError = (context: string, error: unknown) => {
  if (error instanceof AppwriteException) {
    console.error(`${context}: [${error.code}] ${error.type} - ${error.message}`)
  } else {
    console.error(`${context}:`, error)
  }
}

export const updateSearchCount = async (searchTerm: string, movie: Movie): Promise<void> => {
  const term = searchTerm.trim()
  if (!term) return

  try {
    const result = await tablesDB.listRows<SearchMetric>({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.equal('searchTerm', term), Query.limit(1)],
    })

    const row = result.rows[0]

    if (row) {
      await tablesDB.updateRow<SearchMetric>({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: row.$id,
        data: { count: row.count + 1 },
      })
    } else {
      await tablesDB.createRow<SearchMetric>({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: ID.unique(),
        data: {
          searchTerm: term,
          count: 1,
          movie_id: movie.id,
          poster_url: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
            : '/no-movie.png',
        },
      })
    }
  } catch (error) {
    logAppwriteError('Error updating search count', error)
  }
}

export const getTrendingMovies = async (): Promise<SearchMetric[]> => {
  try {
    const result = await tablesDB.listRows<SearchMetric>({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.limit(5), Query.orderDesc('count')],
    })

    return result.rows
  } catch (error) {
    logAppwriteError('Error fetching trending movies', error)
    return []
  }
}
