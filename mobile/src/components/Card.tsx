import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function Card({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.card}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0d1f18',
    borderRadius: 20,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.14)',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f0fdf4',
  },
  subtitle: {
    color: '#94a3b8',
  },
});
