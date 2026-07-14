import PaymentManager from '@/components/features/payments/PaymentManager';
import AuthGuard from '@/components/shared/AuthGuard';

export default function TenantPaymentsPage() {
  return (
    <AuthGuard requireActive={true}>
      <div className="p-6">
        <PaymentManager role="tenant" />
      </div>
    </AuthGuard>
  );
}
