import { Client, TablesDB, Query, ID } from "react-native-appwrite";
import { Platform } from "react-native";

const ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!;
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID!;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID);

if (Platform.OS !== 'web') {
    client.setPlatform(`com.dan_22099.movieflux`);
}

const table = new TablesDB(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  if (!ENDPOINT || !PROJECT_ID) {
    console.error("Appwrite configuration missing!");
    return;
  }

  try {
    const result = await table.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.equal("searchTerm", query)],
    });

    if (result.rows.length > 0) {
      const existingMovie = result.rows[0];
      await table.updateRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: existingMovie.$id,
        data: { count: existingMovie.count + 1 },
      });
    } else {
      await table.createRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: ID.unique(),
        data: {
          searchTerm: query,
          count: 1,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          movie_id: movie.id,
          title: movie.title,
        },
      });
    }
  } catch (error) {
    console.error("Appwrite Update Error:", error);
  }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
  try {
    const result = await table.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.orderDesc("count"), Query.limit(10)],
    });
    return result.rows as unknown as TrendingMovie[];
  } catch (error) {
    console.error("Appwrite Fetch Error:", error);
    return [];
  }
}