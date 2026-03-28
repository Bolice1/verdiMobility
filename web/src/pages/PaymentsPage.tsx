import { useState } from 'react';

import { formatCurrency, formatDate } from '../../../shared/utils/format';
import { useAuth } from '../context/AuthContext';
import { useAsyncData } from '../hooks/useAsyncData';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

export function PaymentsPage() {
  const { api, user } = useAuth();
  const [shipmentId, setShipmentId] = useState('');
  const [selectedPaymentId, setSelectedPaymentId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('authorized');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');

  const payments = useAsyncData(() => api.payments.list({ limit: 100 }), []);

  return (
    <div className="page-stack">
      {['user', 'admin'].includes(user?.role || '') && (
        <Card title="Create Payment Workflow">
          <form
            className="form-grid form-grid-compact"
            onSubmit={async (event) => {
              event.preventDefault();
              await api.payments.create({ shipmentId });
              setShipmentId('');
              await payments.reload();
            }}
          >
            <Input label="Shipment ID" value={shipmentId} onChange={(event) => setShipmentId(event.target.value)} />
            <Button type="submit">Start payment</Button>
          </form>
        </Card>
      )}

      {user?.role === 'admin' && (
        <Card title="Admin Payment Controls">
          <div className="form-grid form-grid-compact">
            <Input label="Payment ID" value={selectedPaymentId} onChange={(event) => setSelectedPaymentId(event.target.value)} />
            <Select label="Status" value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value)}>
              <option value="authorized">Authorized</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
            <Button
              onClick={async () => {
                await api.payments.updateStatus(selectedPaymentId, { status: paymentStatus });
                await payments.reload();
              }}
            >
              Update status
            </Button>
            <Input label="Refund Amount" value={refundAmount} onChange={(event) => setRefundAmount(event.target.value)} />
            <Input label="Refund Reason" value={refundReason} onChange={(event) => setRefundReason(event.target.value)} />
            <Button
              variant="danger"
              onClick={async () => {
                await api.payments.refund(selectedPaymentId, {
                  amount: Number(refundAmount),
                  reason: refundReason,
                });
                setRefundAmount('');
                setRefundReason('');
                await payments.reload();
              }}
            >
              Process refund
            </Button>
          </div>
        </Card>
      )}

      <Card title="Transactions">
        <DataTable
          rows={payments.data?.data || []}
          columns={[
            { key: 'shipmentId', title: 'Shipment' },
            {
              key: 'amount',
              title: 'Amount',
              render: (payment) => formatCurrency(payment.amount, payment.currency),
            },
            { key: 'status', title: 'Status' },
            { key: 'paymentMethod', title: 'Method' },
            {
              key: 'createdAt',
              title: 'Created',
              render: (payment) => formatDate(payment.createdAt),
            },
          ]}
        />
      </Card>
    </div>
  );
}
