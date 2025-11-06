import React, { useEffect, useMemo, useState } from "react";

export default function Leaderboard({
    players: playersProp,
    fetchUrl,
    currentUserId,
    limit = 10,
    onSelect,
    className = "",
}) {
    const [players, setPlayers] = useState(playersProp ?? []);
    const [loading, setLoading] = useState(!playersProp && !!fetchUrl);
    const [error, setError] = useState(null);
    const [q, setQ] = useState("");
    const [sort, setSort] = useState({ key: "score", desc: true });

    useEffect(() => {
        let c = false;
        if (!playersProp && fetchUrl) {
            setLoading(true);
            fetch(fetchUrl)
                .then((r) => r.json())
                .then((d) => !c && setPlayers(Array.isArray(d) ? d : []))
                .catch((e) => !c && setError(String(e)))
                .finally(() => !c && setLoading(false));
        }
        if (playersProp) setPlayers(playersProp);
        return () => (c = true);
    }, [fetchUrl, playersProp]);

    const visible = useMemo(() => {
        if (!Array.isArray(players)) return [];
        const qq = q.trim().toLowerCase();
        const out = players
            .filter((p) => (qq === "" ? true : (p.name || "").toLowerCase().includes(qq)))
            .sort((a, b) => {
                let va = a[sort.key] ?? 0;
                let vb = b[sort.key] ?? 0;
                if (typeof va === "string") va = va.toLowerCase();
                if (typeof vb === "string") vb = vb.toLowerCase();
                return va < vb ? (sort.desc ? 1 : -1) : va > vb ? (sort.desc ? -1 : 1) : 0;
            });
        return out.slice(0, limit);
    }, [players, q, sort, limit]);

    const rows = visible;
    const toggle = (k) => setSort((s) => (s.key === k ? { key: k, desc: !s.desc } : { key: k, desc: true }));

    return (
        <div className={`leaderboard ${className}`}>
            <style>{`
                .leaderboard{--lb-bg:var(--panel-bg,rgba(20,24,30,0.7));--lb-card:var(--card-bg,rgba(255,255,255,0.02));--lb-accent:var(--accent,#6ee7b7);--lb-muted:var(--muted,#9aa4b2);--lb-text:var(--text,#e6eef6);color:var(--lb-text);font-family:Inter,system-ui,Segoe UI,Roboto,Arial;padding:10px;border-radius:10px;max-width:420px;background:linear-gradient(180deg,rgba(255,255,255,0.02),transparent);backdrop-filter:blur(6px) saturate(120%);}
                .header{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}
                h3{margin:0;font-size:14px}
                .controls{display:flex;gap:8px}
                .lb-search{background:var(--lb-card);border:1px solid rgba(255,255,255,0.03);color:var(--lb-text);padding:6px 8px;border-radius:8px;font-size:13px;width:140px}
                .lb-sort{background:transparent;border:1px solid rgba(255,255,255,0.04);color:var(--lb-muted);padding:6px 8px;border-radius:8px;font-size:12px;cursor:pointer}
                .lb-list{display:flex;flex-direction:column;gap:8px}
                .lb-row{display:flex;align-items:center;gap:12px;padding:10px;border-radius:8px;background:linear-gradient(180deg,transparent,rgba(255,255,255,0.01));border:1px solid rgba(255,255,255,0.02);transition:transform .12s,box-shadow .12s;cursor:pointer}
                .lb-row:hover{transform:translateY(-3px);box-shadow:0 10px 20px rgba(6,8,10,0.45)}
                .lb-rank{width:36px;text-align:center;font-weight:700;font-size:13px;color:var(--lb-muted)}
                .lb-avatar{width:40px;height:40px;border-radius:10px;overflow:hidden;flex:0 0 40px;background:linear-gradient(135deg,rgba(255,255,255,0.03),rgba(0,0,0,0.06));display:inline-flex;align-items:center;justify-content:center;font-weight:700;color:var(--lb-text);border:1px solid rgba(255,255,255,0.03)}
                .lb-info{flex:1;min-width:0}
                .lb-name{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
                .lb-meta{font-size:12px;color:var(--lb-muted);margin-top:3px}
                .lb-score{min-width:72px;text-align:right;font-weight:700;color:var(--lb-accent)}
                .lb-empty{text-align:center;padding:24px;color:var(--lb-muted);font-size:13px}
                .rank-medal-1{color:#ffdf7e;background:linear-gradient(90deg,#ffd56a,#ff9f6b)}
                .rank-medal-2{color:#e6f2ff;background:linear-gradient(90deg,#c9dfff,#94b6ff)}
                .rank-medal-3{color:#f3e4ff;background:linear-gradient(90deg,#e3c9ff,#caa8ff)}
                .is-current{box-shadow:0 6px 20px rgba(100,200,160,0.12);border:1px solid rgba(110,231,183,0.12)}
                @media(max-width:420px){.leaderboard{max-width:100%}.lb-search{width:100px}}
            `}</style>

            <div className="header">
                <h3>Leaderboard</h3>
                <div className="controls">
                    <input className="lb-search" placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)} />
                    <button className="lb-sort" onClick={() => toggle("score")} title={`Sort by score (${sort.key === "score" ? (sort.desc ? "desc" : "asc") : "desc"})`}>Score</button>
                </div>
            </div>

            {loading ? (
                <div style={{ fontSize: 13, color: "var(--lb-muted)" }}>Loading…</div>
            ) : error ? (
                <div style={{ fontSize: 13, color: "salmon" }}>Error: {error}</div>
            ) : rows.length === 0 ? (
                <div className="lb-empty">
                    {q ? `No players found matching "${q}"` : 'No scores yet'}
                </div>
            ) : (
                <div className="lb-list" role="list">
                    {rows.map((p, i) => {
                        const rank = i + 1;
                        const isCurrent = currentUserId != null && p.id === currentUserId;
                        const medal = rank <= 3 ? `rank-medal-${rank}` : "";
                        
                        return (
                            <div key={p.id ?? `${p.name}-${i}`} role="listitem" className={`lb-row ${isCurrent ? "is-current" : ""}`} onClick={() => onSelect && onSelect(p)}>
                                <div className={`lb-rank ${medal}`} title={`#${rank}`}>{rank <= 3 ? "★" : `#${rank}`}</div>
                                <div className="lb-avatar" title={p.name}>
                                    {p.avatar ? <img src={p.avatar} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (p.name || "?").slice(0, 2).toUpperCase()}
                                </div>
                                <div className="lb-info">
                                    <div className="lb-name">{p.name ?? "Unknown"}</div>
                                    <div className="lb-meta">
                                        Score: {p.score ?? 0}
                                    </div>
                                </div>
                                <div className="lb-score">{p.score ?? 0}</div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}