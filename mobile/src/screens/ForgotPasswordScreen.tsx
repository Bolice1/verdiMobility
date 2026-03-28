import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Card } from '../components/Card';
import { Field } from '../components/Field';
import { Screen } from '../components/Screen';
import { useAuth } from '../context/AuthProvider';

export function ForgotPasswordScreen({ navigation }: NativeStackScreenProps<any>) {
  const { api } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  return (
    <Screen>
      <Card title="Reset Password" subtitle="Enter your email to receive a setup link.">
        {status === 'success' ? (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>{message}</Text>
            <Text style={styles.mutedText}>
              Check your inbox for a link to reset your password. Once you've created a new password, you can sign in again.
            </Text>
            <Pressable
              style={styles.primary}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.primaryLabel}>Back to Login</Text>
            </Pressable>
          </View>
        ) : (
          <View>
            <Field label="Email address" autoCapitalize="none" value={email} onChangeText={setEmail} />
            {status === 'error' ? <Text style={styles.error}>{message}</Text> : null}
            <Pressable
              style={[styles.primary, status === 'submitting' && styles.disabled]}
              disabled={status === 'submitting'}
              onPress={async () => {
                setStatus('submitting');
                setMessage('');
                try {
                  const res = await api.auth.forgotPassword(email);
                  setStatus('success');
                  setMessage(res.message || 'Reset link sent successfully!');
                } catch (err) {
                  setStatus('error');
                  setMessage(err instanceof Error ? err.message : 'Failed to send rest link');
                }
              }}
            >
              <Text style={styles.primaryLabel}>
                {status === 'submitting' ? 'Sending...' : 'Send reset instructions'}
              </Text>
            </Pressable>
            <View style={styles.inline}>
              <Text style={styles.muted}>Remembered your password?</Text>
              <Pressable onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>Sign in</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  successContainer: {
    gap: 16,
    alignItems: 'center',
  },
  successText: {
    color: '#86efac',
    fontWeight: '600',
    textAlign: 'center',
  },
  mutedText: {
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 16,
  },
  primary: {
    backgroundColor: '#15803d',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
  },
  disabled: {
    opacity: 0.6,
  },
  primaryLabel: {
    color: '#f0fdf4',
    fontWeight: '700',
  },
  inline: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    justifyContent: 'center',
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
    marginBottom: 8,
  },
});
