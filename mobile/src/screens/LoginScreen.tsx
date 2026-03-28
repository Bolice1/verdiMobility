import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Card } from '../components/Card';
import { Field } from '../components/Field';
import { Screen } from '../components/Screen';
import { useAuth } from '../context/AuthProvider';

export function LoginScreen({ navigation }: NativeStackScreenProps<any>) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  return (
    <Screen>
      <Card title="verdiMobility" subtitle="Driver and shipper access">
        <Field label="Email" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <Field label="Password" secureTextEntry value={password} onChangeText={setPassword} />
        <View style={styles.forgotPasswordContainer}>
          <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotPasswordLink}>Forgot password?</Text>
          </Pressable>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable
          style={styles.primary}
          onPress={async () => {
            setError('');
            try {
              await login(email, password);
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Failed to login');
            }
          }}
        >
          <Text style={styles.primaryLabel}>Sign in</Text>
        </Pressable>
        <View style={styles.inline}>
          <Text style={styles.muted}>Need an account?</Text>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Register</Text>
          </Pressable>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: '#15803d',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryLabel: {
    color: '#f0fdf4',
    fontWeight: '700',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  forgotPasswordLink: {
    color: '#94a3b8',
    fontSize: 14,
  },
  inline: {
    flexDirection: 'row',
    gap: 8,
  },
  muted: {
    color: '#94a3b8',
  },
  link: {
    color: '#86efac',
    fontWeight: '700',
  },
  error: {
    color: '#fecdd3',
  },
});
