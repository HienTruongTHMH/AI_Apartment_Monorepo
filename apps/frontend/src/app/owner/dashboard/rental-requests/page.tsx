import RentalRequestManager from '@/components/features/rental-requests/RentalRequestManager';

export default function OwnerRentalRequestsPage() {
  return (
    <div className="p-6">
      <RentalRequestManager role="owner" />
    </div>
  );
}
