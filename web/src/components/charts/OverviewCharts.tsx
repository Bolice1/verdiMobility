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
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0f766e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card title="Revenue Trend" subtitle="Payment throughput over time">
        <div className="chart-box">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#166534" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
