import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getPasswordRuleStatus, isStrongPassword, isValidEmail } from '../../../shared/utils/validation';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'user' | 'company' | 'driver',
    companyName: '',
    companyEmail: '',
    licenseNumber: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const passwordRules = useMemo(() => getPasswordRuleStatus(form.password), [form.password]);

  return (
    <div className="auth-page">
      <Card title="Create account" subtitle="Launch secure fleet coordination in minutes.">
        <form
          className="form-grid"
          onSubmit={async (event) => {
            event.preventDefault();
            setError('');
            if (!isValidEmail(form.email)) {
              setError('Enter a valid email address.');
              return;
            }
            if (!isStrongPassword(form.password)) {
              setError('Password must meet the enterprise security policy.');
              return;
            }
            setSubmitting(true);
            try {
              await register({
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
                role: form.role,
                companyName:
                  form.role === 'company' ? form.companyName.trim() || undefined : undefined,
                companyEmail:
                  form.role === 'company' ? form.companyEmail.trim() || undefined : undefined,
                licenseNumber:
                  form.role === 'driver' ? form.licenseNumber.trim() || undefined : undefined,
              });
              navigate('/dashboard');
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Unable to register');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <Input label="Full name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          <Input label="Email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          <Input
            label="Password"
            type="password"
            helper={`Lowercase ${passwordRules.lowercase ? 'ok' : 'required'} • Uppercase ${passwordRules.uppercase ? 'ok' : 'required'} • Number ${passwordRules.number ? 'ok' : 'required'} • Symbol ${passwordRules.symbol ? 'ok' : 'required'}`}
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          />
          <Select label="Role" value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value as typeof current.role }))}>
            <option value="user">User</option>
            <option value="company">Company</option>
            <option value="driver">Driver</option>
          </Select>
          {form.role === 'company' && (
            <>
              <Input label="Company name" value={form.companyName} onChange={(event) => setForm((current) => ({ ...current, companyName: event.target.value }))} />
              <Input label="Company email" type="email" value={form.companyEmail} onChange={(event) => setForm((current) => ({ ...current, companyEmail: event.target.value }))} />
            </>
          )}
          {form.role === 'driver' && (
            <Input label="License number" value={form.licenseNumber} onChange={(event) => setForm((current) => ({ ...current, licenseNumber: event.target.value }))} />
          )}
          {error && <p className="error-banner">{error}</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Creating account...' : 'Create account'}
          </Button>
          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
