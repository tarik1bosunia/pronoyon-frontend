/**
 * Wallet Management Component
 * Displays wallet balance, allows top-up, and shows transaction history
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Wallet, ArrowUpCircle, ArrowDownCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  useGetWalletQuery,
  useGetWalletTransactionsQuery,
  useTopUpWalletMutation,
  useExecutePaymentMutation,
} from '@/lib/redux/services/paymentsApi';

export default function WalletManagement() {
  const [topUpDialogOpen, setTopUpDialogOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'bank'>('bkash');

  // Fetch wallet data
  const { data: wallet, isLoading: isLoadingWallet, refetch: refetchWallet } = useGetWalletQuery();

  // Fetch transactions
  const { data: transactions, isLoading: isLoadingTransactions } = useGetWalletTransactionsQuery(
    { walletId: wallet?.id || '' },
    { skip: !wallet?.id }
  );

  // Mutations
  const [topUpWallet, { isLoading: isTopUpLoading }] = useTopUpWalletMutation();
  const [executePayment, { isLoading: isExecuting }] = useExecutePaymentMutation();

  const handleTopUp = async () => {
    if (!wallet) return;

    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount < 10 || amount > 50000) {
      toast.error('Please enter a valid amount (10 - 50000 BDT)');
      return;
    }

    try {
      const result = await topUpWallet({
        walletId: wallet.id,
        data: {
          amount,
          payment_method: paymentMethod,
        },
      }).unwrap();

      if (result.success && result.bkash_url) {
        // Open bKash payment URL in new window
        const paymentWindow = window.open(result.bkash_url, '_blank', 'width=600,height=700');

        // Listen for payment completion
        const paymentId = result.payment_id;
        toast.info('Complete your payment in the opened window');

        // Set up interval to check if user returns
        const checkInterval = setInterval(() => {
          if (paymentWindow?.closed) {
            clearInterval(checkInterval);
            // Show dialog to complete payment
            handlePaymentReturn(paymentId);
          }
        }, 1000);

        setTopUpDialogOpen(false);
        setTopUpAmount('');
      }
    } catch (error: any) {
      toast.error(error?.data?.error || 'Failed to initiate payment');
    }
  };

  const handlePaymentReturn = async (paymentId: string) => {
    // Ask user if payment was completed
    const completed = window.confirm(
      'Did you complete the payment? Click OK if yes, Cancel if no.'
    );

    if (completed) {
      try {
        const result = await executePayment({ payment_id: paymentId }).unwrap();
        if (result.success) {
          toast.success(`Payment successful! New balance: ${result.new_balance} BDT`);
          refetchWallet();
        }
      } catch (error: any) {
        toast.error(error?.data?.error || 'Payment verification failed');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      completed: 'default',
      failed: 'destructive',
      refunded: 'outline',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const getTransactionIcon = (type: string) => {
    return type === 'credit' ? (
      <ArrowUpCircle className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowDownCircle className="h-4 w-4 text-red-500" />
    );
  };

  if (isLoadingWallet) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              <CardTitle>Wallet Balance</CardTitle>
            </div>
            <Dialog open={topUpDialogOpen} onOpenChange={setTopUpDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <ArrowUpCircle className="mr-2 h-4 w-4" />
                  Top Up
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Top Up Wallet</DialogTitle>
                  <DialogDescription>
                    Add money to your wallet using bKash, Nagad, Rocket, or Bank Transfer
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (BDT)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount (10 - 50000)"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      min={10}
                      max={50000}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <Select
                      value={paymentMethod}
                      onValueChange={(value: any) => setPaymentMethod(value)}
                    >
                      <SelectTrigger id="payment-method">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bkash">bKash</SelectItem>
                        <SelectItem value="nagad">Nagad</SelectItem>
                        <SelectItem value="rocket">Rocket</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setTopUpDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleTopUp} disabled={isTopUpLoading}>
                    {isTopUpLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Proceed to Payment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription>Your current wallet balance and statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-3xl font-bold">{wallet?.balance || '0.00'} BDT</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Credited</p>
              <p className="text-xl font-semibold text-green-600">
                {wallet?.total_credited || '0.00'} BDT
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-xl font-semibold text-red-600">
                {wallet?.total_debited || '0.00'} BDT
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Your wallet transactions and payment history</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingTransactions ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : transactions && transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Balance After</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTransactionIcon(transaction.transaction_type)}
                        <span className="capitalize">{transaction.transaction_type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.transaction_type === 'credit' ? '+' : '-'}
                      {transaction.amount} BDT
                    </TableCell>
                    <TableCell>{transaction.payment_method_display}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {transaction.description}
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>{transaction.balance_after} BDT</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No transactions yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
