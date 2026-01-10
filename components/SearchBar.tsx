import { View, Image, TextInput } from "react-native";
import React from "react";
import { icons } from "@/constants/icons";

const SearchBar = ({
  value,
  onPress,
  placeholder,
  onChangeText,
  autoFocus = false,
}: {
  value?: string;
  onPress?: () => void;
  placeholder: string;
  onChangeText?: (input: string) => void;
  autoFocus?: boolean;
}) => {
  return (
    <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
      <Image
        source={icons.search}
        className="size-5"
        resizeMode="contain"
        tintColor="#AB8BFF"
      />

      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        value={value || ""}
        autoFocus={autoFocus}
        onChangeText={onChangeText}
        placeholderTextColor="#AB8BFF"
        className="flex-1 ml-2 text-white"
      />
    </View>
  );
};

export default SearchBar;
