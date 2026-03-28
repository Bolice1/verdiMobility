import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { getPasswordRuleStatus, isStrongPassword, isValidEmail } from '../../../shared/utils/validation';
import { Card } from '../components/Card';
import { Field } from '../components/Field';
import { Screen } from '../components/Screen';
import { useAuth } from '../context/AuthProvider';

export function RegisterScreen({ navigation }: NativeStackScreenProps<any>) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const rules = useMemo(() => getPasswordRuleStatus(password), [password]);

  return (
    <Screen>
      <Card title="Create account" subtitle="Secure mobile access for shippers and drivers">
        <Field label="Name" value={name} onChangeText={setName} />
        <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <Text style={styles.rules}>
          Lowercase {rules.lowercase ? 'ok' : 'required'} · Uppercase {rules.uppercase ? 'ok' : 'required'} · Number {rules.number ? 'ok' : 'required'} · Symbol {rules.symbol ? 'ok' : 'required'}
        </Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable
          style={styles.primary}
          onPress={async () => {
            if (!isValidEmail(email)) {
              setError('Enter a valid email address.');
              return;
            }
            if (!isStrongPassword(password)) {
              setError('Password does not meet security policy.');
              return;
            }
            setError('');
            try {
              await register({
                name: name.trim(),
                email: email.trim(),
                password,
                role: 'user',
              });
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Failed to register');
            }
          }}
        >
          <Text style={styles.primaryLabel}>Create account</Text>
        </Pressable>
        <View style={styles.inline}>
          <Text style={styles.muted}>Already registered?</Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Login</Text>
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
  rules: {
    color: '#cbd5e1',
  },
  error: {
    color: '#fecdd3',
  },
});
