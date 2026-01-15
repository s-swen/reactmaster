import { Client, ID, Query, TablesDB } from "appwrite"

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)

const tablesDB = new TablesDB(client)


export const updateSearchCount = async (searchTerm, movie) => {
    try {
        const result = await tablesDB.listRows({
            databaseId: DATABASE_ID,
            tableId: COLLECTION_ID,
            queries: [
                Query.equal('searchTerm', searchTerm)
            ]
        })
        if (result.rows.length > 0) {
            const row = result.rows[0]
            await tablesDB.updateRow({
                databaseId: DATABASE_ID,
                tableId: COLLECTION_ID,
                rowId: row.$id,
                data: {
                    count: row.count + 1
                }
            })
        } else {
            await tablesDB.createRow({
                databaseId: DATABASE_ID,
                tableId: COLLECTION_ID,
                rowId: ID.unique(),
                data: {
                    searchTerm,
                    count: 1,
                    movie_id: movie.id,
                    poster_url: `https://image/tmdb.org/t/p/w500${movie.poster_path}`
                }
            })
        }
    } catch (error) {
        console.error('Error updating search count:', error)    
    }
}

export const getTrendingMovies = async () => {
    try {
        const result = await tablesDB.listRows({
            databaseId: DATABASE_ID,
            tableId: COLLECTION_ID,
            queries: [
                Query.limit(5),
                Query.orderDesc('count')
            ]
        })
        return result.rows
    } catch (error) {
        console.error('Error fetching trending movies:', error)        
    }
}