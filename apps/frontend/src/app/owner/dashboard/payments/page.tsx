import PaymentManager from '@/components/features/payments/PaymentManager';

export default function OwnerPaymentsPage() {
  return (
    <div className="p-6">
      <PaymentManager role="owner" />
    </div>
  );
}
