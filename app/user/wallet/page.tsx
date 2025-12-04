/**
 * User Wallet Page
 * Displays wallet balance and allows top-up
 */

import WalletManagement from '@/components/payments/WalletManagement';

export const metadata = {
  title: 'My Wallet - Pronoyon',
  description: 'Manage your wallet balance and top-up',
};

export default function WalletPage() {
  return (
    <div className="container max-w-7xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Wallet</h1>
        <p className="text-muted-foreground mt-2">
          Manage your wallet balance, top-up with bKash, and view transaction history
        </p>
      </div>
      
      <WalletManagement />
    </div>
  );
}
