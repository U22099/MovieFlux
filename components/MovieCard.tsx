import {
  Text,
  TouchableOpacity,
  Image,
  View,
  ImageBackground,
} from "react-native";
import React from "react";
import { icons } from "@/constants/icons";
import { useRouter } from "expo-router";

const MovieCard = ({
  id,
  poster_path,
  title,
  vote_average,
  release_date,
  adult,
  video,
}: Movie) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      className="w-full"
      onPress={() => router.push(`/movies/${id}`)}
    >
      <View className="relative rounded-lg overflow-hidden">
        <ImageBackground
          source={{
            uri: poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : "https://placehold.co/600x400/1a1a1a/ffffff.png?text=M",
          }}
          className="w-full h-52 rounded-lg"
          resizeMode="cover"
        />

        <View className="absolute top-2 left-1 flex flex-row items-center justify-start gap-x-1 bg-dark-100 px-2 py-1 rounded-md">
          <Image source={icons.star} className="size-5" />
          <Text className="text-sm text-white uppercase font-extrabold">
            {Math.round(vote_average / 2)}
          </Text>
        </View>

        {adult && (
          <View className="absolute top-2 left-2/3 flex flex-row items-center justify-start gap-x-1 bg-red-500 p-1 rounded-md mt-0.5 ml-1.5">
            <Text className="text-xs text-white uppercase font-extrabold">
              +18
            </Text>
          </View>
        )}

        {video && (
          <View className="absolute top-3/4 left-2/3 flex flex-row items-center justify-start gap-x-1 bg-red-500 p-1 rounded-md mt-0.5 ml-1.5">
            <Text className="text-xs text-white uppercase font-extrabold">
              vid
            </Text>
          </View>
        )}
      </View>
      <Text className="text-sm text-white font-bold mt-2" numberOfLines={1}>
        {title}
      </Text>
      <View className="flex-row items-center justify-between">
        <Text className="text-xs text-light-300 font-medium mt-1">
          {release_date?.split("-")[0]}
        </Text>
        {/* <Text className="text-xs text-light-300 font-medium">
                Movie
            </Text> */}
      </View>
    </TouchableOpacity>
  );
};

export default MovieCard;
