import AntDesign from "@expo/vector-icons/AntDesign";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useTheme } from "../hooks/useTheme";

interface DrawerMenuButtonProps {
  color?: string;
  backgroundColor?: string;
}

/**
 * Hamburger menu button that toggles the navigation drawer.
 * Layout via NativeWind; dynamic color/bg via inline style only.
 */
export default function DrawerMenuButton({
  color,
  backgroundColor,
}: DrawerMenuButtonProps) {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const resolvedColor = color ?? theme.headerText;
  const resolvedBackground = backgroundColor ?? theme.headerChrome;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      className="w-14 h-14 rounded-full items-center justify-center"
      style={{ backgroundColor: "white" }}
    >
      <AntDesign name="align-left" size={24} color="black" />
    </TouchableOpacity>
  );
}
