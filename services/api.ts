export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_API_KEY}`,
  },
  QUERY_PARAMS: process.env.EXPO_PUBLIC_MOVIES_QUERY_PARAMS,
};

export const fetchMovies = async ({ query }: { query?: string }) => {
  const endpoint =
    TMDB_CONFIG.BASE_URL +
    (query
      ? query === "$upcoming$"
        ? "/movie/upcoming?language=en-US"
        : query === "$popular$"
          ? "/movie/popular?language=en-US"
          : query === "$now_playing$"
            ? "/movie/now_playing?language=en-US"
            : query === "$trending_today$"
              ? "/trending/movie/day?language=en-US"
              : query === "$top_rated$"
                ? "/movie/top_rated?language=en-US"
                : `/search/movie?query=${encodeURIComponent(query)}`
      : "/discover/movie?sort_by=popularity.desc") +
    TMDB_CONFIG.QUERY_PARAMS;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    // @ts-ignore
    throw new Error(`Failed to fetch movies ${endpoint}`, response.statusText);
  }

  const data = await response.json();

  return data.results;
};

export const fetchMovieDetails = async (id: string) => {
  const endpoint =
    TMDB_CONFIG.BASE_URL + `/movie/${id}` + TMDB_CONFIG.QUERY_PARAMS;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    // @ts-ignore
    throw new Error("Failed to fetch movies", response.statusText);
  }

  const data = await response.json();

  return data;
};

export const fetchMovieVideo = async (id: string) => {
  const endpoint = TMDB_CONFIG.BASE_URL + `/movie/${id}/videos`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    // @ts-ignore
    throw new Error("Failed to fetch movies", response.statusText);
  }

  const data = await response.json();

  return data.results?.[0] || { key: "O-b2VfmmbyA" };
};

export const fetchPeople = async () => {
  const endpoint = TMDB_CONFIG.BASE_URL + `/person/popular`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    // @ts-ignore
    throw new Error("Failed to fetch people", response.statusText);
  }

  const data = await response.json();

  return data.results;
};

export const fetchPeopleDetails = async (id: string) => {
  const endpoint = TMDB_CONFIG.BASE_URL + `/person/${id}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    // @ts-ignore
    throw new Error("Failed to fetch people", response.statusText);
  }

  const data = await response.json();

  return data;
};
