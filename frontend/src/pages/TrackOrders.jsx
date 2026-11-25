import { useMemo, useState } from 'react';
import {
  Search,
  ReceiptText,
  PackageCheck,
  Clock3,
  CheckCircle2
} from 'lucide-react';

// --- Demo Initial Orders ---
const initialOrders = [
  {
    id: 'SS-2048',
    name: 'Aarav Sharma',
    date: '2026-11-23 18:42',
    meds: [
      { name: 'Dolo 650', qty: 2, price: 30 },
      { name: 'Crocin', qty: 1, price: 25 }
    ],
    score: 91,
    status: 'Processing'
  },
  {
    id: 'SS-2045',
    name: 'Meera Nair',
    date: '2026-11-23 16:10',
    meds: [{ name: 'Allegra', qty: 1, price: 120 }],
    score: 72,
    status: 'Ready'
  },
  {
    id: 'SS-2041',
    name: 'Kabir Rao',
    date: '2026-11-23 14:05',
    meds: [{ name: 'Becosules', qty: 2, price: 45 }],
    score: 54,
    status: 'Order Received'
  },
  {
    id: 'SS-2039',
    name: 'Ananya Das',
    date: '2026-11-22 19:25',
    meds: [
      { name: 'Limcee', qty: 1, price: 20 },
      { name: 'Shelcal', qty: 1, price: 110 }
    ],
    score: 28,
    status: 'Delivered'
  }
];

// --- Order Lifecycle Stages ---
const stages = ['Order Received', 'Processing', 'Ready', 'Delivered'];

// --- Priority Helper Function ---
function band(score) {
  return score >= 75
    ? 'High Priority'
    : score >= 45
    ? 'Medium Priority'
    : 'Low Priority';
}

export default function TrackOrders() {
  // --- State Declarations ---
  const [orders, setOrders] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem('saltsaver_orders')) || initialOrders
      );
    } catch {
      return initialOrders;
    }
  });

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('high');

  // --- Persistence Helper ---
  const save = (next) => {
    setOrders(next);
    localStorage.setItem('saltsaver_orders', JSON.stringify(next));
  };

  // --- Filtering & Sorting Memo ---
  const filtered = useMemo(
    () =>
      orders
        .filter(
          (o) =>
            (filter === 'All' || band(o.score) === filter) &&
            `${o.name} ${o.id} ${o.meds.map((m) => m.name).join(' ')}`
              .toLowerCase()
              .includes(query.toLowerCase())
        )
        .sort((a, b) =>
          sort === 'low'
            ? a.score - b.score
            : sort === 'new'
            ? new Date(b.date) - new Date(a.date)
            : b.score - a.score
        ),
    [orders, filter, query, sort]
  );

  // --- Aggregated Counts for Metrics Bar ---
  const counts = {
    total: orders.length,
    high: orders.filter((o) => band(o.score) === 'High Priority').length,
    medium: orders.filter((o) => band(o.score) === 'Medium Priority').length,
    low: orders.filter((o) => band(o.score) === 'Low Priority').length
  };

  return (
    <main className="page track-page">
      {/* Page Heading */}
      <div className="section-heading">
        <div className="eyebrow">ORDER MANAGEMENT · DEMO</div>
        <h1>Track Orders</h1>
        <p>
          Receipt-style order overview sorted by illustrative project score.
          This score is not medical triage.
        </p>
      </div>

      {/* Statistics Metric Bar */}
      <div className="track-stats">
        <div>
          <small>Total orders</small>
          <strong>{counts.total}</strong>
        </div>
        <div className="track-high">
          <small>High priority</small>
          <strong>{counts.high}</strong>
        </div>
        <div className="track-mid">
          <small>Medium priority</small>
          <strong>{counts.medium}</strong>
        </div>
        <div className="track-low">
          <small>Low priority</small>
          <strong>{counts.low}</strong>
        </div>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="track-controls">
        <div className="track-search">
          <Search />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customer, order or medicine"
          />
        </div>

        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>High Priority</option>
          <option>Medium Priority</option>
          <option>Low Priority</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="high">Highest score first</option>
          <option value="low">Lowest score first</option>
          <option value="new">Newest first</option>
        </select>
      </div>

      {/* Orders List / Receipts */}
      {filtered.length ? (
        <div className="track-list">
          {filtered.map((o) => {
            const total = o.meds.reduce((s, m) => s + m.qty * m.price, 0);
            const step = stages.indexOf(o.status);

            return (
              <article className="order-receipt" key={o.id}>
                {/* Receipt Header */}
                <div className="receipt-top">
                  <div>
                    <div className="receipt-name">{o.name}</div>
                    <small>
                      {o.id} · {o.date}
                    </small>
                  </div>
                  <span
                    className={`priority-pill ${band(o.score)
                      .split(' ')[0]
                      .toLowerCase()}`}
                  >
                    {band(o.score)}
                  </span>
                </div>

                {/* Medicine Items Breakdown */}
                <div className="receipt-body">
                  <div className="receipt-label">
                    <ReceiptText size={18} /> ORDER SUMMARY
                  </div>

                  {o.meds.map((m, i) => (
                    <div className="receipt-item" key={i}>
                      <span>
                        {m.name}
                        <small>Qty: {m.qty}</small>
                      </span>
                      <strong>₹{m.qty * m.price}</strong>
                    </div>
                  ))}

                  <div className="receipt-total">
                    <span>Estimated total</span>
                    <strong>₹{total}</strong>
                  </div>
                </div>

                {/* Score & Visual Progress Bar */}
                <div className="order-score-row">
                  <span>Demo score</span>
                  <strong>{o.score}/100</strong>
                </div>

                <div className="score-meter">
                  <span style={{ width: `${o.score}%` }} />
                </div>

                {/* Fulfillment Status Stepper */}
                <div className="order-status-track">
                  {stages.map((s, i) => (
                    <div
                      className={`status-step ${i <= step ? 'active' : ''}`}
                      key={s}
                    >
                      <span>
                        {i < step ? (
                          <CheckCircle2 size={16} />
                        ) : i === step ? (
                          <Clock3 size={16} />
                        ) : (
                          <PackageCheck size={16} />
                        )}
                      </span>
                      <small>{s}</small>
                    </div>
                  ))}
                </div>

                {/* Status Update Dropdown */}
                <label className="status-update">
                  Update status
                  <select
                    value={o.status}
                    onChange={(e) =>
                      save(
                        orders.map((x) =>
                          x.id === o.id ? { ...x, status: e.target.value } : x
                        )
                      )
                    }
                  >
                    {stages.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty">No orders match your search or filter.</div>
      )}

      {/* Bottom Disclaimer */}
      <p className="track-note">
        Demo customer names, order details, prices, status and scores. No real
        order processing or clinical prioritization.
      </p>
    </main>
  );
}
