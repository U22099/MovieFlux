import {
  Text,
  ScrollView,
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

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import useMovieLists from "@/services/useMovieLists";
import { getTrendingMovies } from "@/services/appwrite";
import { fetchPeople } from "@/services/api";
import useFetch from "@/services/useFetch";
import PersonCard from "@/components/PersonCard";

export default function HomeScreen() {
  const router = useRouter();
  const { lists, refreshing, refreshAll, isLoading, hasError } =
    useMovieLists();

  const {
    data: trending,
    loading: trendingLoading,
    error: trendingError,
  } = lists.trending;

  const { data: discover } = lists.discover;

  const { data: popular } = lists.popular;

  const { data: upcoming } = lists.upcoming;

  const { data: nowPlaying } = lists.nowPlaying;

  const { data: topRated } = lists.topRated;

  const {
    data: appTrending,
    loading: appTrendingLoading,
    error: appTrendingError,
  } = useFetch(() => getTrendingMovies());

  const {
    data: people,
    loading: peopleLoading,
    error: peopleError,
  } = useFetch(() => fetchPeople());

  const renderSection = (
    title: string,
    data?: any[],
    people: boolean = false,
    horizontal: boolean = true,
  ) => {
    if (!data?.length) return null;

    return (
      <View className="mt-6">
        <Text className="text-xl text-white font-bold mt-5 mb-3">{title}</Text>

        <FlatList
          data={data}
          horizontal={horizontal}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() =>
            horizontal ? <View className="w-4" /> : null
          }
          contentContainerStyle={
            horizontal ? { paddingHorizontal: 20 } : undefined
          }
          renderItem={({ item, index }) =>
            !people ? (
              <View className={`${horizontal ? "w-32" : "w-[30%]"}`}>
                <MovieCard {...item} />
              </View>
            ) : (
              <View className={`${horizontal ? "w-32" : "w-[30%]"}`}>
                <PersonCard
                  person={item}
                  onPress={() => router.push(`/person/${item.id as string}`)}
                />
              </View>
            )
          }
          {...(!horizontal && {
            numColumns: 3,
            columnWrapperStyle: {
              gap: 16,
              paddingHorizontal: 20,
              marginBottom: 16,
            },
          })}
        />
      </View>
    );
  };

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full h-full"
        resizeMode="cover"
      />

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshAll}
            tintColor="#FF4444"
            title="Pull to refresh..."
            titleColor="#ddd"
          />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="items-center pt-10 pb-6">
          <Image source={icons.logo} className="w-14 h-11" />
        </View>

        <View className="px-5">
          <SearchBar
            onPress={() => router.push("/search")}
            placeholder="Search movies..."
          />

          {(isLoading ||
            trendingLoading ||
            appTrendingLoading ||
            peopleLoading) &&
          !refreshing ? (
            <ActivityIndicator size="large" color="#FF4444" className="mt-20" />
          ) : hasError || trendingError || appTrendingError || peopleError ? (
            <Text className="text-red-500 text-center text-lg mt-10">
              Something went wrong. Pull down to try again.
            </Text>
          ) : (
            <>
              <View className="mt-2">
                <Text className="text-xl text-white font-bold mt-5 mb-3">
                  Trending Searches
                </Text>

                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View className="w-4" />}
                  data={appTrending}
                  keyExtractor={(item) =>
                    item.movie_id.toString() + Math.random()
                  }
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                />
              </View>
              {renderSection("Popular Actors/Actress", people, true, true)}
              {renderSection("Trending Today", trending)}
              {renderSection("Coming Soon", upcoming)}
              {renderSection("Popular", popular)}
              {renderSection("Top Rated", topRated)}
              {renderSection("Now Playing", nowPlaying)}
              {renderSection("Discover", discover, false, false)}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
