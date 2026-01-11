import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "@/constants/icons";
import useFetch from "@/services/useFetch";
import { fetchMovieDetails, fetchMovieVideo } from "@/services/api";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const openYouTube = async (youtubeVideoId: string) => {
  const youtubeUrl = `vnd.youtube://www.youtube.com/watch?v=${youtubeVideoId}`;
  const webUrl = `https://www.youtube.com/watch?v=${youtubeVideoId}`;

  const supported = await Linking.canOpenURL(youtubeUrl);

  if (supported) {
    await Linking.openURL(youtubeUrl);
  } else {
    await Linking.openURL(webUrl);
  }
};

const Details = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string),
  );

  const { data: video, loading: videoLoading } = useFetch(() =>
    fetchMovieVideo(id as string),
  );

  if (loading || videoLoading)
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator color="#AB8BFF"/>
      </SafeAreaView>
    );

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />

          {movie?.adult && (
            <View className="absolute top-10 left-[80%] flex flex-row items-center justify-start gap-x-1 bg-red-500 p-3 rounded-md mt-0.5 ml-1.5">
              <Text className="text-md text-white uppercase font-extrabold">
                +18
              </Text>
            </View>
          )}

          {movie?.video && (
            <TouchableOpacity
              className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center"
              onPress={async () => await openYouTube(video?.key)}
            >
              <Image
                source={icons.play}
                className="w-6 h-7 ml-1"
                resizeMode="stretch"
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-4 left-4 bg-dark-100 px-6 py-3.5 rounded-full"
          >
            <Text className="text-white text-xl">←</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{movie?.title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]} •
            </Text>
            <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />

            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>

            <Text className="text-light-200 text-sm">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g: any) => g.name).join(" • ") || "N/A"}
          />

          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round(
                (movie?.revenue ?? 0) / 1_000_000,
              )} million`}
            />
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies
                ?.map((c: any) => c.name)
                .join(" • ") || "N/A"
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Details;
