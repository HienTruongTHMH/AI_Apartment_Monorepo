import RentalRequestManager from '@/components/features/rental-requests/RentalRequestManager';

export default function TenantRentalRequestsPage() {
  return (
    <div className="p-6">
      <RentalRequestManager role="tenant" />
    </div>
  );
}
