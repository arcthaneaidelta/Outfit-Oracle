import { useMemo } from 'react';

export default function WearHistory({ history }) {
  const grouped = useMemo(() => {
    const map = {};
    history.forEach(h => {
      const d = h.wornAt?.toDate ? h.wornAt.toDate() : new Date();
      const month = d.toLocaleString('en', { month: 'long', year: 'numeric' });
      if (!map[month]) map[month] = [];
      map[month].push({ ...h, _date: d });
    });
    return map;
  }, [history]);

  // Most worn outfits
  const outfitCounts = useMemo(() => {
    const counts = {};
    history.forEach(h => {
      counts[h.outfitName] = (counts[h.outfitName] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [history]);

  return (
    <div>
      <div className="page-header">
        <h2>Wear History</h2>
        <p>Track your outfit journey over time</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '28px', alignItems: 'start' }}>
        {/* Timeline */}
        <div>
          {history.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <h3>No wear history yet</h3>
              <p>When you mark outfits as worn from the Planner, they'll appear here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {Object.entries(grouped).map(([month, entries]) => (
                <div key={month}>
                  <h3 style={{ fontSize: '12px', color: 'var(--charcoal-muted)', marginBottom: '12px', fontFamily: 'var(--font-body)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {month}
                  </h3>
                  <div className="history-timeline">
                    {entries.map(h => (
                      <div key={h.id} className="history-entry">
                        <div className="history-date">
                          <div className="history-date-day">{h._date.getDate()}</div>
                          <div className="history-date-month">
                            {h._date.toLocaleString('en', { month: 'short' })}
                          </div>
                        </div>
                        <div className="history-divider" />
                        <div style={{ flex: 1 }}>
                          <div className="history-outfit-name">{h.outfitName}</div>
                          <div className="history-outfit-meta">
                            {h._date.toLocaleString('en', { weekday: 'long' })}
                          </div>
                        </div>
                        <div style={{ fontSize: '20px', opacity: 0.6 }}>👗</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card">
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Stats</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Total Wears', value: history.length },
                { label: 'Unique Outfits Worn', value: new Set(history.map(h => h.outfitId)).size },
                { label: 'This Month', value: history.filter(h => {
                  const d = h.wornAt?.toDate ? h.wornAt.toDate() : new Date();
                  const now = new Date();
                  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                }).length },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--cream-darker)' }}>
                  <span style={{ fontSize: '13px', color: 'var(--charcoal-muted)' }}>{s.label}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 600 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {outfitCounts.length > 0 && (
            <div className="card">
              <h3 style={{ fontSize: '16px', marginBottom: '14px' }}>Most Worn</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {outfitCounts.map(([name, count], i) => (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--charcoal-muted)', minWidth: '16px' }}>#{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '3px' }}>{name}</div>
                      <div style={{ height: '4px', background: 'var(--cream-darker)', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(count / outfitCounts[0][1]) * 100}%`, background: 'var(--terracotta)', borderRadius: '99px' }} />
                      </div>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--charcoal-muted)' }}>{count}×</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
