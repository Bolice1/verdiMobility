export function StatsCard({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  tone?: 'neutral' | 'success' | 'warning';
}) {
  return (
    <div className={`stats-card stats-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
