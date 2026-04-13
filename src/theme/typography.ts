import { StyleSheet, Platform } from 'react-native';

const fontFamily = Platform.select({
  ios:     'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = StyleSheet.create({
  h1:      { fontSize: 28, fontWeight: '700', lineHeight: 36, fontFamily },
  h2:      { fontSize: 22, fontWeight: '600', lineHeight: 30, fontFamily },
  h3:      { fontSize: 18, fontWeight: '600', lineHeight: 26, fontFamily },
  h4:      { fontSize: 16, fontWeight: '600', lineHeight: 24, fontFamily },
  h5:      { fontSize: 14, fontWeight: '600', lineHeight: 22, fontFamily },
  body1:   { fontSize: 16, fontWeight: '400', lineHeight: 24, fontFamily },
  body2:   { fontSize: 14, fontWeight: '400', lineHeight: 22, fontFamily },
  caption: { fontSize: 12, fontWeight: '400', lineHeight: 18, fontFamily },
  label:   { fontSize: 11, fontWeight: '500', lineHeight: 16, fontFamily },
  button:  { fontSize: 15, fontWeight: '600', lineHeight: 20, fontFamily },
  micro:   { fontSize: 10, fontWeight: '500', lineHeight: 14, fontFamily },
});

export const spacing = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  24,
  xxxl: 32,
};

export const radius = {
  sm:   6,
  md:   10,
  lg:   14,
  xl:   18,
  xxl:  24,
  full: 9999,
};
