/**
 * Payment Callback Page
 * Handles bKash payment return and executes payment
 */

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useExecutePaymentMutation } from '@/lib/redux/services/paymentsApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [executePayment, { isLoading }] = useExecutePaymentMutation();
  const [status, setStatus] = useState<'processing' | 'success' | 'error' | 'cancelled'>('processing');
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    const paymentID = searchParams.get('paymentID');
    const paymentStatus = searchParams.get('status');

    if (!paymentID) {
      setStatus('error');
      setMessage('Invalid payment reference');
      return;
    }

    if (paymentStatus === 'cancel') {
      setStatus('cancelled');
      setMessage('Payment was cancelled');
      toast.error('Payment cancelled');
      return;
    }

    if (paymentStatus === 'failure') {
      setStatus('error');
      setMessage('Payment failed');
      toast.error('Payment failed');
      return;
    }

    // Execute payment
    if (paymentStatus === 'success') {
      executePayment({ payment_id: paymentID })
        .unwrap()
        .then((result) => {
          setStatus('success');
          setMessage(`Payment successful! Your new balance is ${result.new_balance} BDT`);
          toast.success('Payment completed successfully!');
          
          // Redirect to wallet after 3 seconds
          setTimeout(() => {
            router.push('/user/wallet');
          }, 3000);
        })
        .catch((error) => {
          setStatus('error');
          setMessage(error?.data?.error || 'Failed to verify payment. Please contact support.');
          toast.error('Payment verification failed');
        });
    }
  }, [searchParams, router, executePayment]);

  const handleGoToWallet = () => {
    router.push('/user/wallet');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'processing' && (
              <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
            )}
            {status === 'success' && (
              <CheckCircle className="h-16 w-16 text-green-500" />
            )}
            {status === 'error' && (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
            {status === 'cancelled' && (
              <AlertCircle className="h-16 w-16 text-yellow-500" />
            )}
          </div>
          <CardTitle>
            {status === 'processing' && 'Processing Payment'}
            {status === 'success' && 'Payment Successful'}
            {status === 'error' && 'Payment Failed'}
            {status === 'cancelled' && 'Payment Cancelled'}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {status === 'processing' && (
            <p className="text-sm text-muted-foreground">
              Please wait while we verify your payment with bKash...
            </p>
          )}
          {status === 'success' && (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Redirecting to your wallet...
              </p>
              <Button onClick={handleGoToWallet}>Go to Wallet Now</Button>
            </>
          )}
          {(status === 'error' || status === 'cancelled') && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {status === 'error' 
                  ? 'If money was deducted, it will be refunded within 24 hours.'
                  : 'You can try again anytime.'}
              </p>
              <Button onClick={handleGoToWallet} variant="outline">
                Return to Wallet
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
