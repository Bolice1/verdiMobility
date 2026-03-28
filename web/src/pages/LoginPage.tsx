import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="auth-page">
      <Card title="Welcome back" subtitle="Sign in to access your logistics workspace.">
        <form
          className="form-grid"
          onSubmit={async (event) => {
            event.preventDefault();
            setSubmitting(true);
            setError('');
            try {
              await login(email, password);
              navigate('/dashboard');
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Unable to sign in');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          {error && <p className="error-banner">{error}</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign in'}
          </Button>
          <p className="auth-switch">
            Need an account? <Link to="/register">Create one</Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
