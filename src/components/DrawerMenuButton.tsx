import { Feather } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { TVKColors } from '../theme';

interface DrawerMenuButtonProps {
  color?: string;
  backgroundColor?: string;
}

/**
 * Hamburger menu button that toggles the navigation drawer.
 * Layout via NativeWind; dynamic color/bg via inline style only.
 */
export default function DrawerMenuButton({
  color = TVKColors.white,
  backgroundColor = 'rgba(255,255,255,0.14)',
}: DrawerMenuButtonProps) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      className="w-10 h-10 rounded-full items-center justify-center"
      style={{ backgroundColor }}
    >
      <Feather name="menu" size={20} color={color} />
    </TouchableOpacity>
  );
}
