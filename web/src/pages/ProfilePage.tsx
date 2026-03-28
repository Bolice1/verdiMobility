import { formatDate } from '../../../shared/utils/format';
import { roleLabels } from '../../../shared/constants/roles';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

export function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="page-stack">
      <Card title="Profile & Settings" subtitle="Account identity, role assignment, and verification.">
        <div className="profile-grid">
          <div>
            <span>Name</span>
            <strong>{user.name}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>
          <div>
            <span>Role</span>
            <strong>{roleLabels[user.role]}</strong>
          </div>
          <div>
            <span>Email verified</span>
            <strong>{user.emailVerified ? 'Verified' : 'Pending'}</strong>
          </div>
          <div>
            <span>Created</span>
            <strong>{formatDate(user.createdAt)}</strong>
          </div>
          <div>
            <span>Company ID</span>
            <strong>{user.companyId || 'N/A'}</strong>
          </div>
        </div>
      </Card>
    </div>
  );
}
