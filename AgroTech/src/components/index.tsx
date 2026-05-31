import React from 'react';
import {
  View, Text, TouchableOpacity, ActivityIndicator,
  StyleSheet, ViewStyle, TextStyle,
} from 'react-native';
import { Colors, Radius, Spacing } from '../styles/colors';
import type { RiscoNivel } from '../types';

interface RiscoProps {
  nivel: RiscoNivel | string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function RiscoIndicator({ nivel, showLabel = true, size = 'md' }: RiscoProps) {
  const map: Record<string, { color: string; label: string }> = {
    BAIXO: { color: Colors.statusLow,    label: 'BAIXO' },
    MÉDIO: { color: Colors.statusMedium, label: 'MÉDIO' },
    MEDIO: { color: Colors.statusMedium, label: 'MÉDIO' },
    ALTO:  { color: Colors.statusHigh,   label: 'ALTO'  },
  };
  const info    = map[nivel?.toUpperCase()] ?? map.BAIXO;
  const dotSize = size === 'sm' ? 8 : size === 'lg' ? 16 : 12;

  return (
    <View style={riscoStyles.row}>
      <View style={[
        riscoStyles.dot,
        { width: dotSize, height: dotSize, borderRadius: dotSize / 2, backgroundColor: info.color },
      ]} />
      {showLabel && (
        <Text style={[riscoStyles.label, { color: info.color }]}>{info.label}</Text>
      )}
    </View>
  );
}

const riscoStyles = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot:   { shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 3, elevation: 2 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
});


interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: string;
  accentColor?: string;
  style?: ViewStyle;
}

export function StatCard({ label, value, unit, accentColor = Colors.primary, style }: StatCardProps) {
  return (
    <View style={[statStyles.card, { borderLeftColor: accentColor }, style]}>
      <Text style={statStyles.label}>{label}</Text>
      <View style={statStyles.valueRow}>
        <Text style={[statStyles.value, { color: accentColor }]}>{value}</Text>
        {unit && <Text style={statStyles.unit}>{unit}</Text>}
      </View>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgSurface,
    borderRadius:    Radius.md,
    padding:         Spacing.md,
    borderLeftWidth: 3,
    flex: 1,
  },
  label:    { fontSize: 11, color: Colors.textSecondary, marginBottom: 4, letterSpacing: 0.5 },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 3 },
  value:    { fontSize: 22, fontWeight: '700' },
  unit:     { fontSize: 12, color: Colors.textSecondary, marginBottom: 2 },
});


interface HeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onBack?: () => void;
}

export function ScreenHeader({ title, subtitle, right, onBack }: HeaderProps) {
  return (
    <View style={headerStyles.container}>
      <View style={headerStyles.left}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={headerStyles.backBtn}>
            <Text style={headerStyles.backIcon}>←</Text>
          </TouchableOpacity>
        )}
        <View>
          <Text style={headerStyles.title}>{title}</Text>
          {subtitle && <Text style={headerStyles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      {right && <View>{right}</View>}
    </View>
  );
}

const headerStyles = StyleSheet.create({
  container: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingHorizontal: Spacing.lg,
    paddingTop:     Spacing.xl,
    paddingBottom:  Spacing.md,
  },
  left:     { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  backBtn:  { padding: Spacing.xs },
  backIcon: { fontSize: 20, color: Colors.textPrimary },
  title:    { fontSize: 22, fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
});


interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({ label, onPress, variant = 'primary', loading, disabled, style }: ButtonProps) {
  const isFilled = variant === 'primary';
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        btnStyles.btn,
        isFilled  ? btnStyles.filled  :
        variant === 'danger' ? btnStyles.danger : btnStyles.outline,
        (disabled || loading) && btnStyles.disabled,
        style,
      ]}
      activeOpacity={0.8}
    >
      {loading
        ? <ActivityIndicator color={isFilled ? '#000' : Colors.primary} size="small" />
        : <Text style={[btnStyles.label, !isFilled && { color: variant === 'danger' ? Colors.accentRed : Colors.primary }]}>
            {label}
          </Text>
      }
    </TouchableOpacity>
  );
}

const btnStyles = StyleSheet.create({
  btn:      { borderRadius: Radius.md, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  filled:   { backgroundColor: Colors.primary },
  outline:  { borderWidth: 1.5, borderColor: Colors.primary },
  danger:   { borderWidth: 1.5, borderColor: Colors.accentRed },
  disabled: { opacity: 0.5 },
  label:    { fontSize: 15, fontWeight: '700', color: Colors.bg, letterSpacing: 0.5 },
});

interface InputProps {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: any;
  error?: string;
  style?: ViewStyle;
}

export function InputField({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, error, style }: InputProps) {
  const [focused, setFocused] = React.useState(false);
  return (
    <View style={[inputStyles.wrapper, style]}>
      <Text style={inputStyles.label}>{label}</Text>
      <View style={[inputStyles.box, focused && inputStyles.boxFocused, !!error && inputStyles.boxError]}>
        <View

          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          <Text

          />
        </View>
        <TextInputCompat
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={inputStyles.input}
          placeholderTextColor={Colors.textMuted}
        />
      </View>
      {!!error && <Text style={inputStyles.error}>{error}</Text>}
    </View>
  );
}


import { TextInput as TextInputCompat } from 'react-native';

const inputStyles = StyleSheet.create({
  wrapper:    { marginBottom: Spacing.md },
  label:      { fontSize: 12, color: Colors.textSecondary, marginBottom: 6, letterSpacing: 0.5, fontWeight: '600' },
  box:        { backgroundColor: Colors.bgSurface, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: Spacing.md },
  boxFocused: { borderColor: Colors.primary },
  boxError:   { borderColor: Colors.accentRed },
  input:      { color: Colors.textPrimary, fontSize: 15, paddingVertical: 13 },
  error:      { fontSize: 11, color: Colors.accentRed, marginTop: 4 },
});


export function EmptyState({ message, icon = '🌾' }: { message: string; icon?: string }) {
  return (
    <View style={emptyStyles.container}>
      <Text style={emptyStyles.icon}>{icon}</Text>
      <Text style={emptyStyles.text}>{message}</Text>
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: Spacing.xl },
  icon:      { fontSize: 48 },
  text:      { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
});


export function LoadingOverlay() {
  return (
    <View style={loadStyles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={loadStyles.text}>Conectando ao satélite…</Text>
    </View>
  );
}

const loadStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, justifyContent: 'center', alignItems: 'center', gap: 16 },
  text:      { color: Colors.textSecondary, fontSize: 14 },
});