import AntDesign from '@expo/vector-icons/AntDesign';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface DrawerMenuButtonProps {
  color?: string;
  backgroundColor?: string;
  action?: 'menu' | 'back' | 'auto';
}

/**
 * Header button with drawer/back behavior.
 * - `menu`: always toggles drawer
 * - `back`: goes back if possible, otherwise toggles drawer
 * - `auto`: same as back behavior with dynamic icon
 */
export default function DrawerMenuButton({
  color,
  backgroundColor,
  action = 'menu',
}: DrawerMenuButtonProps) {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const resolvedColor = color ?? theme.headerText;
  const resolvedBackground = backgroundColor ?? theme.headerChrome;
  const canGoBack = navigation.canGoBack();
  const shouldBack = action === 'back' || (action === 'auto' && canGoBack);

  const handlePress = () => {
    if (shouldBack && canGoBack) {
      navigation.goBack();
      return;
    }
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      className="w-12 h-12 rounded-full items-center justify-center"
      style={{ backgroundColor: resolvedBackground }}
      accessibilityRole="button"
      accessibilityLabel={shouldBack ? 'Go back' : 'Open menu'}
    >
      <AntDesign
        name={shouldBack ? 'arrow-left' : 'align-left'}
        size={20}
        color={resolvedColor}
      />
    </TouchableOpacity>
  );
}
