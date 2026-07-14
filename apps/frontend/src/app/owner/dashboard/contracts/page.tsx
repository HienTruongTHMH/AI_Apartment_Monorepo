import ContractManager from '@/components/features/contracts/ContractManager';

export default function OwnerContractsPage() {
  return (
    <div className="p-6">
      <ContractManager role="owner" />
    </div>
  );
}
