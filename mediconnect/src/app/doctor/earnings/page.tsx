"use client";
import Link from "next/link";
import { ArrowLeft, Wallet, TrendingUp, Calendar, ArrowDownCircle, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useApi, fetchApi } from "@/lib/api";

export default function EarningsPage() {
  const [withdrawing, setWithdrawing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: dbEarnings, loading, refetch } = useApi<any>('/earnings');
  
  const handleWithdraw = async () => {
    if (!dbEarnings || dbEarnings.balance <= 0) return;
    setWithdrawing(true);
    try {
      await fetchApi('/earnings/withdraw', {
        method: 'POST',
        body: JSON.stringify({ amount: dbEarnings.balance })
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      refetch(); // Reload balance after withdrawal
    } catch (err: any) {
      alert("Withdrawal failed: " + err.message);
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading earnings...</div>;

  return (
    <>
      <header className="section-header" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/doctor/dashboard" className="btn btn-outline" style={{ padding: 8, height: 40 }}>
            <ArrowLeft size={20} />
          </Link>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Earnings</h1>
        </div>
      </header>

      {showSuccess && (
        <div style={{ 
          position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', 
          background: 'var(--green-primary)', color: 'white', padding: '12px 24px', 
          borderRadius: 30, display: 'flex', alignItems: 'center', gap: 10, 
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)', zIndex: 1000, 
          animation: 'slideDown 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)'
        }}>
          <CheckCircle size={20} />
          <span style={{ fontWeight: 600 }}>Withdrawal successful!</span>
        </div>
      )}

      <div style={{ 
        background: 'var(--green-primary)', 
        borderRadius: 20, 
        padding: 24, 
        color: 'white',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, opacity: 0.9 }}>
            <Wallet size={20} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Total Balance</span>
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 8, letterSpacing: '-1px' }}>
            ₦{dbEarnings?.balance ? dbEarnings.balance.toLocaleString() : "0"}
          </h2>
          <div style={{ display: 'flex', gap: 12 }}>
             <button 
               onClick={handleWithdraw} 
               disabled={withdrawing}
               className="btn" 
               style={{ background: 'white', color: 'var(--green-primary)', fontWeight: 700, border: 'none', borderRadius: 20, padding: '8px 16px', fontSize: '0.85rem', minWidth: 100 }}
             >
               {withdrawing ? 'Processing...' : 'Withdraw'}
             </button>
             <button onClick={() => {
                const el = document.getElementById('transaction-list');
                el?.scrollIntoView({ behavior: 'smooth' });
             }} className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 700, border: 'none', borderRadius: 20, padding: '8px 16px', fontSize: '0.85rem' }}>
               History
             </button>
          </div>
        </div>
        <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.1 }}>
           <Wallet size={160} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <div style={{ flex: 1, background: 'white', border: '1px solid var(--border-color)', borderRadius: 16, padding: 16, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', marginBottom: 8 }}>
            <TrendsIcon />
            <span style={{ fontSize: '0.85rem' }}>This Week</span>
          </div>
          <p style={{ fontSize: '1.3rem', fontWeight: 800 }}>₦{dbEarnings?.balance ? Math.floor(dbEarnings.balance / 4).toLocaleString() : "0"}</p>
        </div>
        <div style={{ flex: 1, background: 'white', border: '1px solid var(--border-color)', borderRadius: 16, padding: 16, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', marginBottom: 8 }}>
            <Calendar size={16} />
            <span style={{ fontSize: '0.85rem' }}>This Month</span>
          </div>
          <p style={{ fontSize: '1.3rem', fontWeight: 800 }}>₦{dbEarnings?.balance ? dbEarnings.balance.toLocaleString() : "0"}</p>
        </div>
      </div>

      <h3 id="transaction-list" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>Recent Transactions</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {dbEarnings?.transactions?.length > 0 ? dbEarnings.transactions.map((tx: any) => (
          <div key={tx.id} style={{ 
            background: 'white', 
            padding: 16, 
            borderRadius: 16, 
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: 16
          }}>
            <div style={{ 
              width: 40, height: 40, borderRadius: '50%', 
              background: tx.type === 'CREDIT' ? 'var(--green-light)' : '#FEE2E2',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: tx.type === 'CREDIT' ? 'var(--green-dark)' : '#EF4444'
            }}>
               {tx.type === 'CREDIT' ? <TrendingUp size={18} /> : <ArrowDownCircle size={18} />}
            </div>
            <div style={{ flex: 1 }}>
               <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 4 }}>{tx.description}</h4>
               <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                 {new Date(tx.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
               </p>
            </div>
            <p style={{ fontSize: '1rem', fontWeight: 800, color: tx.type === 'CREDIT' ? 'var(--green-primary)' : 'var(--text-primary)' }}>
              {tx.type === 'CREDIT' ? '+' : '-'} ₦{tx.amount.toLocaleString()}
            </p>
          </div>
        )) : (
          <p style={{ color: 'var(--text-secondary)' }}>No transactions yet.</p>
        )}
      </div>
    </>
  );
}

function TrendsIcon() {
  return <TrendingUp size={16} />;
}
