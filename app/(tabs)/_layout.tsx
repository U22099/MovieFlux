import React, { JSX } from "react";
import { Tabs } from "expo-router";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { View, ImageBackground, Image, Text } from "react-native";

const TabIcon = ({
  focused,
  icon,
  title,
}: {
  focused: boolean;
  icon: any;
  title: string;
}): JSX.Element => {
  if (focused)
    return (
      <View className="flex flex-row justify-center items-center h-16 mt-5 w-full min-w-[200px] gap-2 bg-accent">
        <Image source={icon} tintColor="#151312" className="size-6" />
        <Text className="text-secondary text-base font-bold">{title}</Text>
      </View>
    );
  else
    return (
      <View className="size-full justify-center items-center mt-5 rounded-full">
        <Image source={icon} tintColor="#A8B5DB" className="size-6" />
      </View>
    );
};

const _Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "#0F0D23",
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 42,
          height: 52,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 0,
          borderColor: "#0F0D23",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <>
              <TabIcon focused={focused} icon={icons.home} title="Home" />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <>
              <TabIcon focused={focused} icon={icons.search} title="Search" />
            </>
          ),
        }}
      />
    </Tabs>
  );
};

export default _Layout;
