import { Pressable, StyleSheet, Text } from 'react-native';

import { roleLabels } from '../../../shared/constants/roles';
import { formatDate } from '../../../shared/utils/format';
import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import { useAuth } from '../context/AuthProvider';

export function ProfileScreen() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <Screen>
      <Card title="Profile">
        <Text style={styles.row}>Name: {user.name}</Text>
        <Text style={styles.row}>Email: {user.email}</Text>
        <Text style={styles.row}>Role: {roleLabels[user.role]}</Text>
        <Text style={styles.row}>Verified: {user.emailVerified ? 'Yes' : 'No'}</Text>
        <Text style={styles.row}>Created: {formatDate(user.createdAt)}</Text>
        <Pressable style={styles.primary} onPress={() => void logout()}>
          <Text style={styles.primaryLabel}>Sign out</Text>
        </Pressable>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    color: '#e2e8f0',
  },
  primary: {
    backgroundColor: '#10251d',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryLabel: {
    color: '#f0fdf4',
    fontWeight: '700',
  },
});
