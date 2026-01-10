import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';

interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  known_for?: Array<{ title?: string; name?: string }>;
  popularity?: number;
}

interface PersonCardProps {
  person: Person;
  onPress?: (person: Person) => void;
}

export default function PersonCard({ person, onPress }: PersonCardProps) {
  const imageUrl = person.profile_path
    ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  const topKnown = person.known_for?.[0]?.title || 
                   person.known_for?.[0]?.name || 
                   'Unknown';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress?.(person)}
      className="w-full overflow-hidden rounded-2xl bg-gray-900/90 shadow-lg shadow-black/40"
    >
      <Image
        source={{ uri: imageUrl }}
        className="w-full h-52 rounded-t-2xl"
        resizeMode="cover"
      />

      <View className="p-3 items-center">
        <Text 
          className="text-white text-base font-bold text-center mb-1"
          numberOfLines={1}
        >
          {person.name}
        </Text>

        <Text 
          className="text-gray-400 text-sm text-center mb-1.5"
          numberOfLines={1}
        >
          {topKnown}
        </Text>

        {person.popularity && (
          <Text className="text-amber-400 text-xs font-medium">
            Popularity • {Math.round(person.popularity)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}