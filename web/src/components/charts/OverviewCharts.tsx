import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card } from '../ui/Card';

export function OverviewCharts({
  shipments,
  revenue,
}: {
  shipments: Array<{ date: string; count: number }>;
  revenue: Array<{ date: string; revenue: number }>;
}) {
  return (
    <div className="chart-grid">
      <Card title="Shipment Volume" subtitle="Daily shipment activity">
        <div className="chart-box">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={shipments}>
              <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="var(--chart-axis)" />
              <YAxis stroke="var(--chart-axis)" />
              <Tooltip
                contentStyle={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  color: 'var(--foreground)',
                }}
              />
              <Bar dataKey="count" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card title="Revenue Trend" subtitle="Payment throughput over time">
        <div className="chart-box">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenue}>
              <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="var(--chart-axis)" />
              <YAxis stroke="var(--chart-axis)" />
              <Tooltip
                contentStyle={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  color: 'var(--foreground)',
                }}
              />
              <Line type="monotone" dataKey="revenue" stroke="var(--chart-2)" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
