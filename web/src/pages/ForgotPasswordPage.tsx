import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

export function ForgotPasswordPage() {
  const { api } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  return (
    <div className="auth-page">
      <Card title="Reset Password" subtitle="Enter your email to receive a password reset link.">
        {status === 'success' ? (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: '#86efac' }}>{message}</p>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
              Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
            </p>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button type="button">Back to sign in</Button>
            </Link>
          </div>
        ) : (
          <form
            className="form-grid"
            onSubmit={async (event) => {
              event.preventDefault();
              setStatus('submitting');
              setMessage('');
              try {
                const res = await api.auth.forgotPassword(email);
                setStatus('success');
                setMessage(res.message || 'Reset link sent!');
              } catch (err) {
                setStatus('error');
                setMessage(err instanceof Error ? err.message : 'Failed to send reset link');
              }
            }}
          >
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {status === 'error' && <p className="error-banner">{message}</p>}
            <Button type="submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Sending...' : 'Send reset link'}
            </Button>
            <p className="auth-switch">
              Remember your password? <Link to="/login">Sign in</Link>
            </p>
          </form>
        )}
      </Card>
    </div>
  );
}
