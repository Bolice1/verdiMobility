import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

export function ResetPasswordPage() {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  if (!token) {
    return (
      <div className="auth-page">
        <Card title="Invalid Link">
          <p style={{ color: '#94a3b8', marginBottom: '1rem', textAlign: 'center' }}>
            This password reset link is invalid or has expired.
          </p>
          <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
            <Button type="button">Request a new link</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <Card title="Create New Password" subtitle="Your new password must be at least 10 characters long.">
        {status === 'success' ? (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: '#86efac' }}>{message}</p>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button type="button">Sign in now</Button>
            </Link>
          </div>
        ) : (
          <form
            className="form-grid"
            onSubmit={async (event) => {
              event.preventDefault();
              if (password !== confirmPassword) {
                setStatus('error');
                setMessage('Passwords do not match');
                return;
              }
              if (password.length < 10) {
                setStatus('error');
                setMessage('Password must be at least 10 characters');
                return;
              }
              setStatus('submitting');
              setMessage('');
              try {
                const res = await api.auth.resetPassword({ token, password });
                setStatus('success');
                setMessage(res.message || 'Password successfully updated.');
              } catch (err) {
                setStatus('error');
                setMessage(err instanceof Error ? err.message : 'Failed to reset password');
              }
            }}
          >
            <Input
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {status === 'error' && <p className="error-banner">{message}</p>}
            <Button type="submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
