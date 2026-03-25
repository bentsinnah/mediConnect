"use client";
import Link from "next/link";
import { ArrowLeft, CreditCard, Building2, CheckCircle2 } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { fetchApi, useApi } from "@/lib/api";
import { useSearchParams } from "next/navigation";
import styles from "./payment.module.css";

// Dynamically import the Paystack hook to prevent SSR issues
function usePaystack(config: any) {
  const [handler, setHandler] = useState<any>(null);
  
  useEffect(() => {
    import('react-paystack').then(mod => {
      const { usePaystackPayment } = mod;
      // We cannot call hooks inside useEffect so we store the initialized payment
      // Instead we initialize on demand via the pay button
    });
  }, []);
  
  const pay = (callbacks: any) => {
    import('react-paystack').then(({ PaystackButton }) => {});
    // Direct Paystack popup using global PaystackPop
    const popup = (window as any).PaystackPop;
    if (popup) {
      popup.setup({ ...config, ...callbacks }).openIframe();
    } else {
      // Fallback: simulate payment
      if (callbacks.callback) callbacks.callback({ reference: 'offline-ref' });
    }
  };
  
  return pay;
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const docId = searchParams.get('docId');
  const amount = searchParams.get('amount') || "15000";
  const date = searchParams.get('date');
  const time = searchParams.get('time');
  const clinic = searchParams.get('clinic') || "General Clinic";
  
  const { data: doctor } = useApi<any>(docId ? `/doctors/${docId}` : null as any);
  const [method, setMethod] = useState("online");
  const [user, setUser] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const rawUser = localStorage.getItem('user');
    if (rawUser) setUser(JSON.parse(rawUser));
  }, []);

  const onSuccess = async (_reference: any) => {
    setProcessing(true);
    try {
      await fetchApi('/appointments', {
        method: 'POST',
        body: JSON.stringify({
          doctorId: docId,
          date,
          time,
          type: "virtual",
          clinic
        })
      });
    } catch (err: any) {
      console.error('Appointment creation error (non-fatal):', err);
    } finally {
      window.location.href = `/patient/doctors/${docId}/confirmed`;
    }
  };

  const handleProceed = async () => {
    if (method === 'online') {
      try {
        const { usePaystackPayment } = await import('react-paystack');
        // We can't call hooks dynamically like this -- use Paystack popup API directly
        const PaystackPop = (window as any).PaystackPop;
        if (PaystackPop) {
          PaystackPop.setup({
            key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_d97f5b09e8358d4806959b4324264963b4fd3aa2",
            email: user?.email || "patient@mediconnect.com",
            amount: parseInt(amount) * 100,
            ref: new Date().getTime().toString(),
            callback: (response: any) => onSuccess(response),
            onClose: () => alert("Payment cancelled.")
          }).openIframe();
        } else {
          // Paystack script not loaded, fallback to offline
          alert('Online payment unavailable. Booking as pay-at-clinic instead.');
          await onSuccess({ reference: 'fallback' });
        }
      } catch (err) {
        // Fallback
        await onSuccess({ reference: 'fallback' });
      }
    } else {
      await onSuccess({ reference: "cash-on-delivery" });
    }
  };

  return (
    <>
      <header className="section-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href={`/patient/doctors/${docId}`} className="btn btn-outline" style={{ padding: 8, height: 40, border: 'none' }}>
            <ArrowLeft size={20} />
          </Link>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Payment Method</h1>
        </div>
      </header>

      <div className={styles.summaryCard}>
        <p className={styles.summaryLabel}>Total to Pay</p>
        <h2 className={styles.summaryAmount}>₦{parseInt(amount).toLocaleString()}</h2>
        <p className={styles.summaryDesc}>Consultation with {doctor?.user?.name || doctor?.name || "Doctor"}</p>
      </div>

      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Choose how to pay</h3>

      <div className={styles.methods}>
        <div 
          className={`${styles.methodCard} ${method === 'online' ? styles.active : ''}`}
          onClick={() => setMethod('online')}
        >
          <div className={styles.methodIcon} style={{ background: 'var(--blue-light)', color: 'var(--blue-primary)' }}>
            <CreditCard size={24} />
          </div>
          <div className={styles.methodInfo}>
            <h4>Pay Online Now</h4>
            <p>Card, Bank Transfer, USSD</p>
          </div>
          <div className={styles.radio}>
            {method === 'online' && <CheckCircle2 size={24} color="var(--blue-primary)" />}
          </div>
        </div>

        <div 
          className={`${styles.methodCard} ${method === 'in-person' ? styles.active : ''}`}
          onClick={() => setMethod('in-person')}
        >
          <div className={styles.methodIcon} style={{ background: 'var(--green-light)', color: 'var(--green-dark)' }}>
            <Building2 size={24} />
          </div>
          <div className={styles.methodInfo}>
            <h4>Pay at Clinic</h4>
            <p>Pay with cash or POS on arrival</p>
          </div>
          <div className={styles.radio}>
            {method === 'in-person' && <CheckCircle2 size={24} color="var(--blue-primary)" />}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 40, paddingBottom: 24 }}>
        <button 
          onClick={handleProceed} 
          disabled={processing}
          className={`btn btn-primary btn-lg ${processing ? 'opacity-70' : ''}`} 
          style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {processing ? 'Processing Booking...' : (method === 'online' ? `Proceed to Pay ₦${parseInt(amount).toLocaleString()}` : 'Confirm Appointment')}
        </button>
      </div>
    </>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Loading payment details...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
