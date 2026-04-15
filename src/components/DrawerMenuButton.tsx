import { Feather } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import { TVKColors } from '../theme';

type Props = {
  color?: string;
  backgroundColor?: string;
};

export default function DrawerMenuButton({
  color = TVKColors.white,
  backgroundColor = 'rgba(255,255,255,0.14)',
}: Props) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor,
      }}
    >
      <Feather name="menu" size={20} color={color} />
    </TouchableOpacity>
  );
}
