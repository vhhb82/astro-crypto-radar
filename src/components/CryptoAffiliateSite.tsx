import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  Star,
  ExternalLink,
  Newspaper,
  BarChart2,
  ShieldCheck,
  Cog,
  Lightbulb,
  Link as LinkIcon,
  Search,
  TrendingUp,
  Layers,
  Sun,
  Moon,
} from "lucide-react";

// =====================
// Tipuri
// =====================

type Exchange = {
  name: string;
  slug: string;
  referralUrl: string; // link de afiliere
  score: number; // 0..100
  features: string[];
  notes?: string;
};

type Tool = {
  name: string;
  description: string;
  url: string; // link de afiliere
};

// =====================
// Config implicit — CU LINK-URILE TALE
// =====================

const DEFAULT_EXCHANGES: Exchange[] = [
  { name: "Binance", slug: "binance", referralUrl: "https://www.binance.com/activity/referral-entry/CPA?ref=CPA_008BUATWJ6", score: 96, features: ["Spot", "Futures", "Options", "Launchpad", "Copy trading"], notes: "Largest liquidity; KYC în multe regiuni." },
  { name: "OKX", slug: "okx", referralUrl: "https://okx.com/join/65725967", score: 95, features: ["Spot", "Perps", "Options", "Grid bots", "Earn"] },
  { name: "Bybit", slug: "bybit", referralUrl: "https://www.bybit.com/invite?ref=ZZWPQQ", score: 94, features: ["Spot", "Perps", "Copy trading", "Earn", "Launchpad"] },
  { name: "Bitget", slug: "bitget", referralUrl: "https://www.bitget.com/ru/referral/register?clacCode=QFKSAFPY&from=%2Fru%2Fevents%2Freferral-all-program&source=events&utmSource=PremierInviter", score: 92, features: ["Spot", "Perps", "Copy trading", "Grid bots"] },
  { name: "KuCoin", slug: "kucoin", referralUrl: "https://www.kucoin.com/r/rf/XN9WZ9NQ", score: 90, features: ["Spot", "Perps", "Earn", "Trading bots"] },
  { name: "MEXC", slug: "mexc", referralUrl: "https://promote.mexc.com/r/G97gjvQX", score: 88, features: ["Spot", "Perps", "Low fees", "Launchpad"] },
  { name: "Gate.io", slug: "gateio", referralUrl: "https://www.gate.com/signup/VGRMULPAVA?ref_type=103&utm_cmp=PEYEQdSb", score: 87, features: ["Spot", "Perps", "Copy trading", "Startup (IEO)"] },
  { name: "HTX (Huobi)", slug: "htx", referralUrl: "https://www.htx.com/invite/ru-ru/1f?invite_code=ib3pc223", score: 85, features: ["Spot", "Perps", "Earn"] },
  { name: "Phemex", slug: "phemex", referralUrl: "https://phemex.com/ru/account/referral/invite-friends-entry?referralCode=I3HKW8", score: 84, features: ["Spot", "Perps", "Earn"] },
  { name: "BitMart", slug: "bitmart", referralUrl: "https://www.bitmart.com/invite/cBhfB3/en", score: 83, features: ["Spot", "Perps", "Launchpad"] },
  { name: "LBank", slug: "lbank", referralUrl: "https://lbank.com/ref/58RDR", score: 80, features: ["Spot", "Perps"] },
  { name: "Pionex", slug: "pionex", referralUrl: "", score: 78, features: ["Spot", "Perps", "Built-in grid bots"] },
];

const DEFAULT_TOOLS: Tool[] = [
  { name: "TradingView", description: "Charting, alerts, screener, Pine Script.", url: "https://ru.tradingview.com/?aff_id=156512" },
  { name: "Altrady", description: "Terminal multi-exchange cu smart orders & portofoliu.", url: "https://altrady.com?a=cCRGkEePeMotZqm8" }
];

// =====================
// Helpers
// =====================

const cx = (...xs: Array<string | false | undefined>) => xs.filter(Boolean).join(" ");
const saveJson = (k: string, v: unknown) => localStorage.setItem(k, JSON.stringify(v));
const loadJson = <T,>(k: string, fb: T): T => {
  try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) as T : fb; } catch { return fb; }
};

// =====================
// News fetch (prin endpoint local sau direct)
// =====================

type NewsItem = { id: string | number; title: string; url: string; published_at?: string; domain?: string };

type Props = { newsEndpoint?: string };

const useCryptoNews = (source: string | null, query: string) => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const run = async () => {
      setLoading(true); setError(null);
      try {
        if (source) {
          const u = new URL(source, location.origin);
          if (query) u.searchParams.set("q", query);
          const r = await fetch(u.toString());
          if (!r.ok) throw new Error("Eșec la endpoint-ul de știri");
          const data = await r.json();
          const mapped: NewsItem[] = (data.results || []).map((x: any) => ({ id: x.id, title: x.title, url: x.url, published_at: x.published_at, domain: x.domain }));
          if (!ignore) setItems(mapped);
        } else {
          const fallback: NewsItem[] = [
            { id: 1, title: "Market overview: BTC & ETH weekly momentum", url: "https://www.coindesk.com/markets/", domain: "CoinDesk" },
            { id: 2, title: "On-chain insights: exchange flows & funding rates", url: "https://cointelegraph.com/tags/on-chain-data", domain: "CoinTelegraph" },
            { id: 3, title: "Macro & crypto: dollar liquidity watch", url: "https://theblock.co/markets", domain: "The Block" }
          ];
          if (!ignore) setItems(fallback);
        }
      } catch (e: any) {
        if (!ignore) setError(e?.message || "Eroare necunoscută");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    run();
    return () => { ignore = true };
  }, [source, query]);

  return { items, loading, error };
};

// =====================
// UI
// =====================

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium opacity-80">{children}</span>
);

const Card: React.FC<{ className?: string } & React.PropsWithChildren> = ({ className, children }) => (
  <div className={cx("rounded-2xl border p-5 shadow", className)}>{children}</div>
);

const ExchangeCard: React.FC<{ ex: Exchange; idx: number }> = ({ ex, idx }) => {
  const hasLink = !!ex.referralUrl && ex.referralUrl.trim().length > 0;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.03 }}>
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-xl border text-sm font-bold">
                {ex.name.split(" ").map((w) => w[0]).join("")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-lg font-semibold">{ex.name}</h3>
                  <Badge><Star className="mr-1 h-3 w-3" /> {ex.score}</Badge>
                </div>
                <div className="mt-1 flex flex-wrap gap-2 text-sm opacity-80">
                  {ex.features.map((f) => (<Badge key={f}>{f}</Badge>))}
                </div>
                {ex.notes && (<p className="mt-2 text-sm opacity-80">{ex.notes}</p>)}
              </div>
            </div>
          </div>
          <div className="shrink-0">
            <a href={hasLink ? ex.referralUrl : undefined} target="_blank" rel="noreferrer" className={cx("inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold shadow-sm", hasLink ? "hover:shadow" : "opacity-50 cursor-not-allowed")} aria-disabled={!hasLink} onClick={(e) => { if (!hasLink) e.preventDefault(); }}>
              Open account <ExternalLink className="h-4 w-4" />
            </a>
            <div className="mt-2 text-center text-[11px] opacity-60">Referral link</div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const ToolCard: React.FC<{ tool: Tool }> = ({ tool }) => (
  <Card>
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="text-lg font-semibold">{tool.name}</h3>
        <p className="mt-1 text-sm opacity-80">{tool.description}</p>
      </div>
      <a href={tool.url || undefined} target="_blank" rel="noreferrer" className={cx("inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold shadow-sm", tool.url ? "hover:shadow" : "opacity-50 cursor-not-allowed")} onClick={(e) => { if (!tool.url) e.preventDefault(); }}>
        Try <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  </Card>
);

// =====================
// App
// =====================

const CryptoAffiliateSite: React.FC<Props> = ({ newsEndpoint = null }) => {
  const [dark, setDark] = useState(loadJson("theme:dark", false));
  useEffect(() => { saveJson("theme:dark", dark); }, [dark]);

  const [query, setQuery] = useState(loadJson("news:defaultQuery", ""));
  const [exchanges, setExchanges] = useState<Exchange[]>(loadJson<Exchange[]>("exchanges", DEFAULT_EXCHANGES));
  const [tools, setTools] = useState<Tool[]>(loadJson<Tool[]>("tools", DEFAULT_TOOLS));
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { items, loading, error } = useCryptoNews(newsEndpoint, query);
  const top10 = useMemo(() => [...exchanges].sort((a, b) => b.score - a.score).slice(0, 10), [exchanges]);

  useEffect(() => { saveJson("exchanges", exchanges); }, [exchanges]);
  useEffect(() => { saveJson("tools", tools); }, [tools]);

  return (
    <div className={cx(dark && "dark", "min-h-screen")}>
      <div className="bg-white text-gray-900 dark:bg-neutral-950 dark:text-neutral-100">
        <nav className="sticky top-0 z-20 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-neutral-950/70">
          <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0" }}>
            <a href="#home" className="flex items-center gap-2 font-semibold"><Rocket className="h-5 w-5" />Crypto Radar</a>
            <div className="flex items-center gap-2">
              <a href="#news" className="rounded-xl px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/5">News</a>
              <a href="#exchanges" className="rounded-xl px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/5">Top Exchanges</a>
              <a href="#strategies" className="rounded-xl px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/5">Strategies</a>
              <a href="#tools" className="rounded-xl px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/5">Tools</a>
              <button onClick={() => setSettingsOpen(true)} className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm hover:shadow" title="Configure referrals & API key"><Cog className="h-4 w-4" /> Settings</button>
              <button onClick={() => setDark((v) => !v)} className="ml-1 inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm hover:shadow" title="Toggle theme">{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} Theme</button>
            </div>
          </div>
        </nav>

        <header id="home" className="border-b" style={{ background: "linear-gradient(#0000,#0001)" }}>
          <div className="container" style={{ padding: "48px 0" }}>
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-3xl font-extrabold sm:text-4xl">Latest Crypto News, Smart Strategies, and Trusted Exchanges</motion.h1>
                <p className="mt-3 max-w-xl text-sm opacity-80">Curated market updates, playbook-uri testate și un shortlist de burse & unelte pe care le folosim. Unele link-uri sunt de afiliere — nu te costă nimic, susțin proiectul.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#news" className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold shadow-sm"><Newspaper className="h-4 w-4" /> Vezi știrile</a>
                  <a href="#exchanges" className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold shadow-sm"><BarChart2 className="h-4 w-4" /> Top burse</a>
                  <a href="#strategies" className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold shadow-sm"><Lightbulb className="h-4 w-4" /> Strategii</a>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs opacity-70"><ShieldCheck className="h-4 w-4" /> Affiliate disclosure.</div>
              </div>
              <div className="round border" style={{ padding: "24px" }}>
                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  {top10.map((ex, i) => (
                    <div key={ex.slug} className="round border p-3">
                      <div className="text-2xl font-bold leading-none">{i + 1}</div>
                      <div className="mt-1 truncate font-semibold">{ex.name}</div>
                      <div className="mt-1 inline-flex items-center gap-1 text-[11px] opacity-70"><Star className="h-3 w-3" /> {ex.score}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        <section id="news" className="container" style={{ padding: "32px 0" }}>
          <div className="mb-3" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
            <h2 className="flex items-center gap-2 text-2xl font-bold"><Newspaper className="h-6 w-6" /> Latest crypto news</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ position: "relative" }}>
                <Search className="pointer-events-none" style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)" }} size={16} />
                <input value={query} onChange={(e) => { setQuery(e.target.value); saveJson("news:defaultQuery", e.target.value); }} placeholder="Filter (ex. BTC, ETF, DeFi)" className="w-56 rounded-xl border py-1.5" style={{ paddingLeft: 28, paddingRight: 12, fontSize: 14 }} />
              </div>
              <ApiKeyBadge />
            </div>
          </div>
          {loading && <p className="opacity-70">Se încarcă…</p>}
          {error && (<p className="text-sm" style={{ color: "#dc2626" }}>Eroare: {String(error)} — afișez fallback.</p>)}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((n) => (
              <motion.a key={n.id} href={n.url} target="_blank" rel="noreferrer" className="round border p-4 shadow-sm hover:shadow" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-sm font-semibold leading-snug">{n.title}</h3>
                  <ExternalLink className="h-4 w-4 shrink-0 opacity-60" />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs opacity-70">
                  <span className="truncate">{n.domain || new URL(n.url).hostname}</span>
                  {n.published_at && (<time dateTime={n.published_at}>{new Date(n.published_at).toLocaleString()}</time>)}
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        <section id="exchanges" className="container" style={{ padding: "32px 0" }}>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-2xl font-bold"><BarChart2 className="h-6 w-6" /> Top 10 Exchanges</h2>
            <div className="text-xs opacity-70">Ranking by features, liquidity & UX</div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {top10.map((ex, idx) => (<ExchangeCard key={ex.slug} ex={ex} idx={idx} />))}
          </div>
        </section>

        <section id="strategies" className="container" style={{ padding: "32px 0" }}>
          <h2 className="flex items-center gap-2 text-2xl font-bold"><Lightbulb className="h-6 w-6" /> Strategy Playbooks</h2>
          <div className="grid gap-4 md:grid-cols-3 mt-3">
            <StrategyCard title="DCA Momentum" bullets={["DCA săptămânal în BTC/ETH.", "Adaugă când 20D > 100D MA & funding neutru.", "Oprește adds la RSI>70 sau funding > 0.05%."]} />
            <StrategyCard title="Breakout-Retest" bullets={["Caută range-uri cu volum în scădere.", "Intrare la retest cu invalidare strânsă.", "TP parțial la 1R/2R; trail restul."]} />
            <StrategyCard title="Grid / Range Bots" bullets={["Alege perechi mean-reverting cu funding plat.", "Grid cu pas mic, cap la drawdown.", "Oprește la evenimente macro (CPI/FOMC)."]} />
          </div>
        </section>

        <section id="tools" className="container" style={{ padding: "32px 0" }}>
          <h2 className="flex items-center gap-2 text-2xl font-bold"><Layers className="h-6 w-6" /> Useful Tools</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-3">
            {tools.map((t) => (<ToolCard key={t.name} tool={t} />))}
          </div>
        </section>

        <section id="newsletter" className="container" style={{ padding: "32px 0" }}>
          <Card>
            <form action="#" method="post" className="flex flex-col gap-3 sm:flex-row" onSubmit={(e) => { e.preventDefault(); alert("Leagă acest formular la providerul tău de email."); }}>
              <input required type="email" placeholder="you@email.com" className="w-full rounded-2xl border px-4 py-3 text-sm outline-none" />
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-2xl border px-6 py-3 text-sm font-semibold shadow-sm">Subscribe</button>
            </form>
            <p className="mt-2 text-xs opacity-70">Fără spam. Doar note de piață & setup-uri.</p>
          </Card>
        </section>

        <footer className="border-t">
          <div className="container" style={{ padding: "24px 0" }}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>© {new Date().getFullYear()} Crypto Radar — Educațional. Nu reprezintă sfat financiar.</div>
              <div className="flex flex-wrap items-center gap-4 text-xs opacity-70">
                <span className="inline-flex items-center gap-1"><LinkIcon className="h-3.5 w-3.5" /> Unele link-uri sunt de afiliere.</span>
                <a href="#exchanges">Exchanges</a>
                <a href="#tools">Tools</a>
                <a href="#strategies">Strategii</a>
              </div>
            </div>
          </div>
        </footer>

        {settingsOpen && (
          <SettingsModal onClose={() => setSettingsOpen(false)} exchanges={exchanges} setExchanges={setExchanges} tools={tools} setTools={setTools} />
        )}
      </div>
    </div>
  );
};

const StrategyCard: React.FC<{ title: string; bullets: string[] }> = ({ title, bullets }) => (
  <Card>
    <h3 className="text-lg font-semibold">{title}</h3>
    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm opacity-90">
      {bullets.map((b, i) => (<li key={i}>{b}</li>))}
    </ul>
    <p className="mt-3 text-xs opacity-60">Doar pentru studiu. Testează și gestionează riscul.</p>
  </Card>
);

const SettingsModal: React.FC<{ onClose: () => void; exchanges: Exchange[]; setExchanges: (xs: Exchange[]) => void; tools: Tool[]; setTools: (ts: Tool[]) => void; }> = ({ onClose, exchanges, setExchanges, tools, setTools }) => {
  const [tab, setTab] = useState<"exchanges" | "tools">("exchanges");
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-3xl border bg-white p-4 shadow-xl dark:bg-neutral-950">
        <div className="flex items-center justify-between border-b px-2 pb-3">
          <h3 className="flex items-center gap-2 text-lg font-semibold"><Cog className="h-5 w-5" /> Settings</h3>
          <button onClick={onClose} className="rounded-xl border px-3 py-1.5 text-sm">Close</button>
        </div>

        <div className="mt-4 flex items-center gap-2 border-b px-2">
          <TabButton active={tab === "exchanges"} onClick={() => setTab("exchanges")}>Exchanges</TabButton>
          <TabButton active={tab === "tools"} onClick={() => setTab("tools")}>Tools</TabButton>
        </div>

        <div className="max-h-[65vh] overflow-auto p-2">
          {tab === "exchanges" && (
            <div className="grid gap-3">
              {exchanges.sort((a, b) => b.score - a.score).map((ex, i) => (
                <div key={ex.slug} className="rounded-2xl border p-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="grid h-8 w-8 place-items-center rounded-lg border text-xs font-bold">{ex.name.split(" ").map((w) => w[0]).join("")}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="truncate font-semibold">{i + 1}. {ex.name}</div>
                            <Badge><Star className="mr-1 h-3 w-3" /> {ex.score}</Badge>
                          </div>
                          <div className="mt-1 text-xs opacity-70">{ex.features.join(" • ")}</div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:w-[52%]">
                      <label className="block text-xs opacity-70">Referral URL</label>
                      <input value={ex.referralUrl} onChange={(e) => { const next = exchanges.map((x) => x.slug === ex.slug ? { ...x, referralUrl: e.target.value } : x); setExchanges(next); }} placeholder={`https://… ${ex.name} referral`} className="mt-1 w-full rounded-xl border px-3 py-1.5 text-sm outline-none" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "tools" && (
            <div className="grid gap-3">
              {tools.map((t, i) => (
                <div key={t.name} className="rounded-2xl border p-3">
                  <div className="grid gap-2 sm:grid-cols-4 sm:items-center">
                    <div className="sm:col-span-1">
                      <label className="block text-xs opacity-70">Name</label>
                      <input value={t.name} onChange={(e) => { const next = [...tools]; next[i] = { ...next[i], name: e.target.value }; setTools(next); }} className="mt-1 w-full rounded-xl border px-3 py-1.5 text-sm outline-none" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs opacity-70">Description</label>
                      <input value={t.description} onChange={(e) => { const next = [...tools]; next[i] = { ...next[i], description: e.target.value }; setTools(next); }} className="mt-1 w-full rounded-xl border px-3 py-1.5 text-sm outline-none" />
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-xs opacity-70">Referral URL</label>
                      <input value={t.url} onChange={(e) => { const next = [...tools]; next[i] = { ...next[i], url: e.target.value }; setTools(next); }} placeholder={`https://… ${t.name}`} className="mt-1 w-full rounded-xl border px-3 py-1.5 text-sm outline-none" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active?: boolean; onClick?: () => void }> = ({ active, onClick, children }) => (
  <button onClick={onClick} className={cx("rounded-xl px-3 py-1.5 text-sm", active ? "bg-black/5 dark:bg-white/10" : "hover:bg-black/5 dark:hover:bg-white/5")}>{children}</button>
);

const ApiKeyBadge: React.FC = () => (
  <button onClick={() => { const k = prompt("Cheia CryptoPanic (gol pentru a șterge)", localStorage.getItem("cryptopanic:key") || ""); if (k !== null) localStorage.setItem("cryptopanic:key", k.trim()); }} className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs opacity-80" title="Opțional: cheia CryptoPanic">
    <Newspaper className="h-4 w-4" /> Live news: via server
  </button>
);

export default CryptoAffiliateSite;
