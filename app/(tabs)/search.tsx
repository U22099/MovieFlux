import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { updateSearchCount } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

export default function Search() {
  const [query, setQuery] = useState<string>("");
  const {
    data: movies,
    loading,
    error,
    refetch: loadMovies,
    reset,
  } = useFetch(() => fetchMovies({ query }), false);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim()) {
        await loadMovies();
      } else reset();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    if (movies?.length > 0 && query.trim().length > 1)
      updateSearchCount(query, movies[0]);
  }, [movies]);

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString() + Math.random()}
        renderItem={({ item }) => (
        <View className="w-[30%]"> 
        <MovieCard {...item} />
        </view>)}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 16,
          marginVertical: 16,
        }}
        className="px-5"
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <Image
              source={icons.logo}
              className="w-12 h-10 mt-10 mb-2 mx-auto"
            />
            <View className="flex-1 mt-2 mb-4">
              <SearchBar
                value={query}
                autoFocus={true}
                onChangeText={(input: string) => setQuery(input)}
                placeholder="Search for movies"
              />
            </View>
            {loading ? (
              <ActivityIndicator
                size="large"
                color="#0000FF"
                className="mb-2 self-center"
              />
            ) : error ? (
              <Text className="text-red-500 self-center text-lg mb-2">
                Error: {error?.message}
              </Text>
            ) : (
              !loading &&
              !error &&
              query.trim() &&
              movies?.length && (
                <Text className="text-xl text-white font-bold mb-2">
                  Search Results for{" "}
                  <Text className="text-accent">{query}</Text>
                </Text>
              )
            )}
          </>
        }
        ListEmptyComponent={
          <>
            !loading && !error && (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500 mx-auto">
                {query.trim() ? "No movies found" : "Search for a movie"}
              </Text>
            </View>
            )
          </>
        }
      />
    </View>
  );
}
