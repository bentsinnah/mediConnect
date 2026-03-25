"use client";
import Link from "next/link";
import { ArrowLeft, Download, Plus, Moon, Activity, Thermometer, Droplet } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { healthTips } from "@/lib/data/health-metrics";
import { useApi, fetchApi } from "@/lib/api";
import Avatar from "@/components/Avatar";
import styles from "./health.module.css";

const CustomChart = ({ data, lines, yDomain }: { data: any, lines: {key: string, color: string}[], yDomain: [number, number] }) => (
  <div style={{ width: '100%', height: 160, marginTop: 16 }}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#E5E7EB" />
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} domain={yDomain} />
        {lines.map(line => (
          <Line 
            key={line.key}
            type="monotone" 
            dataKey={line.key} 
            stroke={line.color} 
            strokeWidth={2} 
            dot={{ r: 3, fill: 'white', stroke: line.color, strokeWidth: 2 }}
            activeDot={{ r: 5 }} 
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default function HealthDashboardPage() {
  const { data: dbHealth, loading } = useApi<any>('/health');
  
  const rawMetrics = Array.isArray(dbHealth) ? dbHealth : (dbHealth?.rawMetrics || []);
  
  const getChartData = (type: string) => {
    const records = rawMetrics.filter((m: any) => m.type === type).slice(-7);
    if (records.length === 0) return [{ day: 'Today', value: 0 }];
    return records.map((r: any) => ({
      day: new Date(r.recordedAt).toLocaleDateString('en-US', { weekday: 'short' }),
      value: r.value
    }));
  };

  const getBpData = () => {
    const sys = rawMetrics.filter((m: any) => m.type === 'BP_SYSTOLIC').slice(-7);
    const dia = rawMetrics.filter((m: any) => m.type === 'BP_DIASTOLIC').slice(-7);
    if (sys.length === 0) return [{ day: 'Today', systolic: 0, diastolic: 0 }];
    return sys.map((s: any, i: number) => ({
      day: new Date(s.recordedAt).toLocaleDateString('en-US', { weekday: 'short' }),
      systolic: s.value,
      diastolic: dia[i]?.value || 0
    }));
  };

  const waterRecords = rawMetrics.filter((m: any) => m.type === 'WATER');
  const latestWater = waterRecords.length > 0 ? waterRecords[waterRecords.length - 1].value : 0;
  
  const sleepRecords = rawMetrics.filter((m: any) => m.type === 'SLEEP');
  const latestSleep = sleepRecords.length > 0 ? sleepRecords[sleepRecords.length - 1].value : 0;

  const getTrend = (type: string, invertGood = false) => {
    const r = rawMetrics.filter((m: any) => m.type === type);
    if (r.length < 2) return null;
    const diff = r[r.length - 1].value - r[r.length - 2].value;
    if (diff === 0) return { text: "No change", format: "badge-gray" };
    const isUp = diff > 0;
    const isGood = invertGood ? !isUp : isUp;
    return { text: `${isUp ? '+' : ''}${diff.toFixed(1)}`, format: isGood ? "badge-green" : "badge-red" };
  };

  const getBpTrend = () => {
    const s = rawMetrics.filter((m: any) => m.type === 'BP_SYSTOLIC');
    if (s.length < 2) return null;
    const diff = s[s.length - 1].value - s[s.length - 2].value;
    if (diff === 0) return { text: "Stable", format: "badge-blue" };
    return { text: `${diff > 0 ? '+' : ''}${diff} mmHg`, format: diff > 0 ? "badge-red" : "badge-green" }; // Lower BP is generally better here for demo
  };

  const { data: fetchConsults } = useApi<any[]>('/consultations');
  const pastConsults = fetchConsults || [];

  const { data: aiTips, loading: loadingTips } = useApi<string[]>('/health/tips');
  const displayTips = aiTips && Array.isArray(aiTips) && aiTips.length > 0 ? aiTips : healthTips.slice(0, 5);

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading health dashboard...</div>;

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/patient/dashboard" className={styles.backBtn}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className={styles.title}>Health Dashboard</h1>
        </div>
        <button className={styles.downloadBtn}>
          <Download size={20} />
        </button>
      </header>
      
      <div className={styles.assessmentCard}>
        <div className={styles.assessmentHeader}>
          <div className={styles.titleWrap}>
            <Activity size={20} color="var(--blue-primary)" />
            <h2>Consultation Timeline</h2>
          </div>
          <span className="badge badge-blue">{pastConsults.length} total</span>
        </div>
        
        {pastConsults.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: 16 }}>
            {pastConsults.slice(0, 3).map((consult, idx) => (
              <div key={consult.id} style={{ borderBottom: idx !== pastConsults.length - 1 ? '1px solid var(--border-color)' : 'none', paddingBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(consult.createdAt).toLocaleDateString()}</span>
                  <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>Completed</span>
                </div>
                <h3 className={styles.conditionName} style={{ fontSize: '1.05rem' }}>{consult.diagnosis}</h3>
                <p className={styles.adviceText}>"{consult.notes}"</p>
                <div className={styles.doctorBadge} style={{ marginTop: 12 }}>
                  <Avatar src={consult.appointment.doctor.avatar} name={consult.appointment.doctor.name} size={32} className={styles.docMiniAvatar} />
                  <div>
                    <p className={styles.docName} style={{ fontSize: '0.8rem' }}>Dr. {consult.appointment.doctor.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '20px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Your doctor's medical assessments and advice will appear here after your consultations.
          </div>
        )}
      </div>

      <div className={styles.chartCard} style={{ marginTop: 24 }}>
        <div className={styles.cardHeader}>
          <div className={styles.titleWrap} style={{ alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className={`${styles.iconCirc} ${styles.redCirc}`}><Thermometer size={16} /></div>
              <h2>Temperature</h2>
            </div>
            {getTrend('TEMPERATURE', true) && (
               <span className={`badge ${getTrend('TEMPERATURE', true)?.format}`} style={{ padding: '2px 8px', fontSize: '0.75rem' }}>
                 {getTrend('TEMPERATURE', true)?.text} °C
               </span>
            )}
          </div>
        </div>
        <CustomChart 
          data={getChartData('TEMPERATURE')} 
          lines={[{ key: 'value', color: '#EF4444' }]} 
          yDomain={[35, 40]}
        />
      </div>

      <div className={styles.chartCard} style={{ marginTop: 20 }}>
        <div className={styles.cardHeader}>
          <div className={styles.titleWrap} style={{ alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className={`${styles.iconCirc} ${styles.blueCirc}`}><Activity size={16} /></div>
              <h2>Blood Pressure</h2>
            </div>
            {getBpTrend() && (
               <span className={`badge ${getBpTrend()?.format}`} style={{ padding: '2px 8px', fontSize: '0.75rem' }}>
                 {getBpTrend()?.text}
               </span>
            )}
          </div>
        </div>
        <CustomChart 
          data={getBpData()} 
          lines={[
            { key: 'systolic', color: '#10B981' },
            { key: 'diastolic', color: '#F59E0B' }
          ]} 
          yDomain={[0, 140]}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.chartCard} style={{ flex: 1 }}>
          <div className={styles.titleWrap} style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className={`${styles.iconCirc} ${styles.blueCirc}`}><Droplet size={14} /></div>
              <h2 style={{ fontSize: '0.9rem' }}>Water</h2>
            </div>
            {getTrend('WATER', false) && (
               <span className={`badge ${getTrend('WATER', false)?.format}`} style={{ padding: '2px 6px', fontSize: '0.65rem' }}>
                 {getTrend('WATER', false)?.text}
               </span>
            )}
          </div>
          <p className={styles.bigVal}>{latestWater} <span className={styles.secVal}>/ 8</span></p>
          <p className={styles.smallVal}>glasses today</p>
          <div className={styles.waterTracker}>
            {Array(8).fill(null).map((_, i) => (
              <div key={i} className={`${styles.waterPill} ${i < latestWater ? styles.waterActive : ''}`} />
            ))}
          </div>
        </div>

        <div className={styles.chartCard} style={{ flex: 1, position: 'relative' }}>
          <div className={styles.titleWrap} style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className={`${styles.iconCirc} ${styles.purpleCirc}`}><Moon size={14} /></div>
              <h2 style={{ fontSize: '0.9rem' }}>Sleep</h2>
            </div>
            {getTrend('SLEEP', false) && (
               <span className={`badge ${getTrend('SLEEP', false)?.format}`} style={{ padding: '2px 6px', fontSize: '0.65rem' }}>
                 {getTrend('SLEEP', false)?.text} hr
               </span>
            )}
          </div>
          <p className={styles.bigVal}>{latestSleep} <span className={styles.secVal}>hrs</span></p>
          <p className={styles.smallVal}>last night</p>
          <div className={styles.sleepOpts}>
            {[6, 7, 8, 9].map((opt: number) => (
              <div key={opt} className={`${styles.sleepOpt} ${opt === latestSleep ? styles.sleepActive : ''}`}>
                {opt}h
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.chartCard} style={{ marginTop: 20 }}>
        <div className={styles.cardHeader}>
          <div className={styles.titleWrap} style={{ alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className={`${styles.iconCirc} ${styles.orangeCirc}`}><Activity size={16} /></div>
              <h2>Weight (kg)</h2>
            </div>
            {getTrend('WEIGHT', true) && (
               <span className={`badge ${getTrend('WEIGHT', true)?.format}`} style={{ padding: '2px 8px', fontSize: '0.75rem' }}>
                 {getTrend('WEIGHT', true)?.text} kg
               </span>
            )}
          </div>
        </div>
        <CustomChart 
          data={getChartData('WEIGHT')} 
          lines={[{ key: 'value', color: '#F59E0B' }]} 
          yDomain={[0, 120]}
        />
      </div>

      <div className={styles.tipsSection}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 className={styles.tipsTitle} style={{ margin: 0 }}>AI Health Insights</h3>
          {loadingTips && (
            <span style={{ fontSize: '0.75rem', color: 'var(--blue-primary)', background: 'var(--bg-blue)', padding: '2px 8px', borderRadius: 12 }}>
              Analyzing data...
            </span>
          )}
        </div>
        <div className={styles.tipsList}>
          {displayTips.map((tip, idx) => (
            <div key={idx} className={styles.tipCard}>
              {tip}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
