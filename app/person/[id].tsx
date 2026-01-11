import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchPeopleDetails } from "@/services/api";
import useFetch from "@/services/useFetch";

const { width } = Dimensions.get("window");

export default function PersonDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: person, loading: loading } = useFetch(() =>
    fetchPeopleDetails(id as string),
  );

  if (loading)
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator color="#AB8BFF"/>
      </SafeAreaView>
    );

  if (!person) {
    return (
      <SafeAreaView className="flex-1 bg-primary items-center justify-center">
        <Text className="text-white text-xl">Person not found</Text>
      </SafeAreaView>
    );
  }

  const birthDate = new Date(person.birthday);
  const age = new Date().getFullYear() - birthDate.getFullYear();

  const profileUrl = person.profile_path
    ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView className="flex-1">
        <View className="relative">
          <Image
            source={{ uri: profileUrl }}
            className="w-full h-96 object-cover"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/40 to-primary" />

          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-4 left-4 bg-dark-100 px-6 py-3.5 rounded-full"
          >
            <Text className="text-white text-xl">←</Text>
          </TouchableOpacity>

          <View className="absolute bottom-6 left-5 right-5">
            <Text className="text-white text-4xl font-bold mb-1">
              {person.name}
            </Text>
            <Text className="text-gray-300 text-lg">
              {person.known_for_department} • Age {age}
            </Text>
          </View>
        </View>

        {/* Basic Info */}
        <View className="px-5 py-6">
          <View className="flex-row flex-wrap gap-4 mb-6">
            <View className="bg-gray-800/60 px-4 py-2 rounded-full">
              <Text className="text-gray-300">
                Born:{" "}
                {birthDate.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>
            <View className="bg-gray-800/60 px-4 py-2 rounded-full">
              <Text className="text-gray-300">{person.place_of_birth}</Text>
            </View>
            <View className="bg-amber-600/30 px-4 py-2 rounded-full">
              <Text className="text-amber-300 font-medium">
                Popularity: {Math.round(person.popularity)}
              </Text>
            </View>
          </View>

          {/* Biography */}
          <Text className="text-white text-lg font-semibold mb-3">
            Biography
          </Text>
          <Text className="text-gray-300 leading-6 text-base">
            {person.biography}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
