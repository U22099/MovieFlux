import {
  Text,
  Image,
  View,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";

import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import TrendingCard from "@/components/TrendingCard";
import PersonCard from "@/components/PersonCard";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import useMovieLists from "@/services/useMovieLists";
import { getTrendingMovies } from "@/services/appwrite";
import { fetchPeople } from "@/services/api";
import useFetch from "@/services/useFetch";

export default function HomeScreen() {
  const router = useRouter();
  const { lists, refreshing, refreshAll, isLoading, hasError } = useMovieLists();

  const { data: trending, loading: trendingLoading, error: trendingError } = lists.trending;
  const { data: discover } = lists.discover;
  const { data: popular } = lists.popular;
  const { data: upcoming } = lists.upcoming;
  const { data: nowPlaying } = lists.nowPlaying;
  const { data: topRated } = lists.topRated;

  const { data: appTrending, loading: appTrendingLoading, error: appTrendingError } = useFetch(() =>
    getTrendingMovies()
  );

  const { data: people, loading: peopleLoading, error: peopleError } = useFetch(() => fetchPeople());

  const renderHorizontalList = (
    data?: any[],
    renderPerson: boolean = false
  ) => {
    if (!data?.length) return null;

    return (
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => (item.id ? item.id.toString() : item.movie_id.toString()) + Math.random()}
        ItemSeparatorComponent={() => <View className="w-4" />}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        renderItem={({ item, index }) =>
          renderPerson ? (
            <View className="w-32">
              <PersonCard
                person={item}
                // @ts-ignore
                onPress={() => router.push(`/person/${item.id as string}`)}
              />
            </View>
          ) : (
            <View className="w-32">
              <TrendingCard movie={item} index={index}/>
            </View>
          )
        }
      />
    );
  };

  const renderGridSection = (title: string, data?: any[]) => {
    if (!data?.length) return null;

    return (
      <View className="mt-6">
        <Text className="text-xl text-white font-bold mt-5 mb-3 px-5">
          {title}
        </Text>

        <FlatList
          data={data}
          numColumns={3}
          keyExtractor={(item) => item.id.toString() + Math.random()}
          columnWrapperStyle={{
            gap: 16,
            paddingHorizontal: 20,
            marginBottom: 16,
          }}
          renderItem={({ item }) => (
            <View className="w-[30%]">
              <MovieCard {...item} />
            </View>
          )}
        />
      </View>
    );
  };

  const isAnyLoading =
    isLoading || trendingLoading || appTrendingLoading || peopleLoading;

  const hasAnyError =
    hasError || trendingError || appTrendingError || peopleError; 

  const sections = [
     {
      key: "trending-searches",
      render: () => (
        <View className="mt-2">
          <Text className="text-xl text-white font-bold mt-5 mb-3 px-5">
            Trending Searches
          </Text>
          {renderHorizontalList(appTrending as any)}
        </View>
      ),
    },
    {
      key: "popular-actors",
      render: () => (
        <View className="mt-6">
          <Text className="text-xl text-white font-bold mt-5 mb-3 px-5">
            Popular Actors/Actress
          </Text>
          {renderHorizontalList(people, true)}
        </View>
      ),
    },
    { key: "trending", render: () => renderGridSection("Trending Today", trending) },
    { key: "upcoming", render: () => renderGridSection("Coming Soon", upcoming) },
    { key: "popular", render: () => renderGridSection("Popular", popular) },
    { key: "top-rated", render: () => renderGridSection("Top Rated", topRated) },
    { key: "now-playing", render: () => renderGridSection("Now Playing", nowPlaying) },
    { key: "discover", render: () => renderGridSection("Discover", discover) },
  ].filter((s) => s.render());

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full h-full"
        resizeMode="cover"
      />

      <FlatList
        data={sections}
        keyExtractor={(item) => item.key}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshAll}
            tintColor="#FF4444"
            title="Pull to refresh..."
            titleColor="#ddd"
          />
        }
        ListHeaderComponent={
          <>
            <View className="items-center pt-10 pb-6">
              <Image source={icons.logo} className="w-14 h-11" />
            </View>

            <View className="px-5">
              <SearchBar
                onPress={() => router.push("/search")}
                placeholder="Search movies..."
              />
            </View>

            {isAnyLoading && !refreshing ? (
              <ActivityIndicator
                size="large"
                color="#AB8BFF"
                className="mt-20"
              />
            ) : hasAnyError ? (
              <Text className="text-red-500 text-center text-lg mt-10 px-5">
                Something went wrong. Pull down to try again.
              </Text>
            ) : null}
          </>
        }
        renderItem={({ item }) => item.render()}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}