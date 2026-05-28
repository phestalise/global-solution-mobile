import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { Colors } from '../styles/colors';

export default function OrbitInput(props: any) {
  return (
    <TextInput
      placeholderTextColor={Colors.muted}
      style={styles.input}
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