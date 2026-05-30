import React from 'react';
import { TextInput, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { Colors } from '../styles/colors';

interface OrbitInputProps {
  style?: StyleProp<TextStyle>;
  placeholderTextColor?: string;

  [key: string]: any;
}

export default function OrbitInput({
  style,
  placeholderTextColor = Colors.textMuted, 
  ...props
}: OrbitInputProps) {
  return (
    <TextInput
      placeholderTextColor={placeholderTextColor}
      style={[styles.input, style]}   
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    color: Colors.text,
    marginBottom: 16,
    fontSize: 16,
  },
});