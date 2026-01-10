import { useState, useCallback } from "react";
import { fetchMovies } from "./api";
import useFetch from "./useFetch";

const useMovieLists = () => {
  const [refreshing, setRefreshing] = useState(false);

  const lists = {
    discover: useFetch(() => fetchMovies({})),
    trending: useFetch(() => fetchMovies({ query: "$trending_today$" })),
    popular: useFetch(() => fetchMovies({ query: "$popular$" })),
    upcoming: useFetch(() => fetchMovies({ query: "$upcoming$" })),
    nowPlaying: useFetch(() => fetchMovies({ query: "$now_playing$" })),
    topRated: useFetch(() => fetchMovies({ query: "$top_rated$" })),
  };

  const refreshAll = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all(Object.values(lists).map((list) => list.refetch()));
    } finally {
      setRefreshing(false);
    }
  }, [lists]);

  const isLoading = Object.values(lists).some((l) => l.loading);
  const hasError = Object.values(lists).some((l) => !!l.error);

  return {
    lists,
    refreshing,
    refreshAll,
    isLoading,
    hasError,
  };
};

export default useMovieLists;
