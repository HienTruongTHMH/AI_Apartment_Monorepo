import ContractManager from '@/components/features/contracts/ContractManager';
import AuthGuard from '@/components/shared/AuthGuard';

export default function TenantContractsPage() {
  return (
    <AuthGuard requireActive={true}>
      <div className="p-6">
        <ContractManager role="tenant" />
      </div>
    </AuthGuard>
  );
}
