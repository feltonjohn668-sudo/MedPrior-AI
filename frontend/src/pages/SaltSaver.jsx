import { useEffect, useMemo, useState } from 'react';
import {
  BadgeIndianRupee,
  Search,
  Pill,
  Filter,
  ShoppingCart,
  Trash2,
  CheckCircle2
} from 'lucide-react';

export default function SaltSaver({ selected = [], result }) {
  // --- State Declarations ---
  const [catalog, setCatalog] = useState([]);
  const [query, setQuery] = useState('');
  const [quantities, setQuantities] = useState({});
  const [category, setCategory] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('saltsaver_demo_user'))?.name || '';
    } catch {
      return '';
    }
  });
  const [confirmation, setConfirmation] = useState('');

  // --- Fetch Catalogue on Mount ---
  useEffect(() => {
    fetch('/api/medicines')
      .then((r) => r.json())
      .then(setCatalog)
      .catch(() => setCatalog([]));
  }, []);

  // --- Filter & Derivation Logic ---
  const chosen = selected?.length ? selected : result?.selected_medicines || [];

  const categories = useMemo(
    () => [
      'All',
      ...new Set(catalog.map((r) => r.therapeutic_category).filter(Boolean))
    ],
    [catalog]
  );

  const focus =
    showAll || !chosen.length
      ? catalog
      : catalog.filter((row) => chosen.includes(row.branded_medicine));

  const filtered = focus.filter(
    (row) =>
      (category === 'All' || row.therapeutic_category === category) &&
      `${row.branded_medicine} ${row.salt_composition} ${row.alternative_name} ${row.therapeutic_category}`
        .toLowerCase()
        .includes(query.toLowerCase())
  );

  // --- Cart Calculations ---
  const total = cart.reduce((s, m) => s + m.qty * m.price, 0);

  // --- Handlers ---
  const add = (row) => {
    const qty = Math.max(1, Number(quantities[row.branded_medicine] || 1));
    setCart((prev) => {
      const existing = prev.find((x) => x.brand === row.branded_medicine);
      return existing
        ? prev.map((x) =>
            x.brand === row.branded_medicine ? { ...x, qty: x.qty + qty } : x
          )
        : [
            ...prev,
            {
              brand: row.branded_medicine,
              name: row.alternative_name,
              salt: row.salt_composition,
              qty,
              price: Number(row.alternative_price_inr) || 0
            }
          ];
    });
    setConfirmation('');
  };

  const placeOrder = () => {
    if (!customerName.trim() || !cart.length) return;

    let existing = [];
    try {
      existing = JSON.parse(localStorage.getItem('saltsaver_orders')) || [];
    } catch {}

    const order = {
      id: 'SS-' + Date.now().toString().slice(-6),
      name: customerName.trim(),
      date: new Date().toLocaleString(),
      meds: cart.map((m) => ({ name: m.name, qty: m.qty, price: m.price })),
      score: Number(result?.score || 0),
      status: 'Order Received',
      demo: true
    };

    localStorage.setItem(
      'saltsaver_orders',
      JSON.stringify([order, ...existing])
    );
    setConfirmation(`Order ${order.id} confirmed and saved to Track Orders.`);
    setCart([]);
  };

  return (
    <main className="page">
      {/* Page Heading */}
      <div className="section-heading">
        <div className="eyebrow">MEDICINE PRICE COMPARISON · DEMO CART</div>
        <h1>SaltSaver</h1>
        <p>
          Review illustrative alternatives and build a demo order. Confirm
          ingredient, strength, form and suitability with a pharmacist or
          prescriber before any real substitution.
        </p>
      </div>

      {/* Catalog Filters & Controls */}
      <div className="catalog-controls">
        <div className="search-box">
          <Search />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search brand, salt or alternative"
          />
        </div>

        <label className="category-select">
          <Filter size={18} />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>

        <button
          className="button secondary"
          onClick={() => setShowAll((v) => !v)}
        >
          {showAll ? 'Show selected' : 'Browse all medicines'}
        </button>
      </div>

      {/* Catalog Context Summary */}
      <div className="catalog-context">
        {chosen.length && !showAll ? (
          <>
            Showing <strong>{chosen.length} selected brand(s)</strong>:{' '}
            {chosen.join(', ')}.{' '}
            <button className="text-button" onClick={() => setShowAll(true)}>
              View full catalogue
            </button>
          </>
        ) : (
          <>Showing all {catalog.length} catalogue entries.</>
        )}
      </div>

      {/* Medicine Grid */}
      <div className="medicine-grid">
        {filtered.map((row) => {
          const brand = Number(row.branded_price_inr);
          const generic = Number(row.alternative_price_inr);

          return (
            <article className="medicine-card" key={row.branded_medicine}>
              <div className="med-card-head">
                <Pill />
                <span className="tag">Illustrative</span>
              </div>

              <h3>{row.branded_medicine}</h3>
              <p className="salt">
                {row.salt_composition} · {row.dosage_form}
              </p>
              <div className="category-chip">{row.therapeutic_category}</div>

              <div className="price-row">
                <div>
                  <small>Brand (listed unit)</small>
                  <strong>₹{brand.toFixed(2)}</strong>
                </div>
                <div>
                  <small>Example alternative</small>
                  <strong className="green">₹{generic.toFixed(2)}</strong>
                </div>
              </div>

              <div className="alternative-panel">
                <small>Alternative example</small>
                <h4>{row.alternative_name}</h4>
                <p>{row.alternative_manufacturer}</p>
                <small>Illustrative—not a verified substitution</small>
              </div>

              <label className="quantity-label">
                Quantity
                <input
                  type="number"
                  min="1"
                  value={quantities[row.branded_medicine] || 1}
                  onChange={(e) =>
                    setQuantities((prev) => ({
                      ...prev,
                      [row.branded_medicine]: e.target.value
                    }))
                  }
                />
              </label>

              <div className="savings-box">
                <span>
                  <BadgeIndianRupee /> Example per-unit difference
                </span>
                <strong>₹{Math.max(0, brand - generic).toFixed(2)}</strong>
                <small>Illustrative price comparison only.</small>
              </div>

              <button
                className="button add-cart-button"
                onClick={() => add(row)}
              >
                <ShoppingCart size={18} /> Add alternative to order
              </button>

              <div className="small-text">
                Check active ingredient, strength and formulation with a
                pharmacist/prescriber before considering a substitution.
              </div>
            </article>
          );
        })}
      </div>

      {!filtered.length && (
        <div className="empty">
          No matching catalogue entries in this filter.
        </div>
      )}

      {/* Cart & Checkout Panel */}
      <section className="cart-panel">
        <div className="cart-heading">
          <div>
            <div className="eyebrow">ORDER CHECKOUT</div>
            <h2>
              <ShoppingCart /> Selected alternatives
            </h2>
          </div>
          <span className="cart-count">
            {cart.reduce((s, m) => s + m.qty, 0)} units
          </span>
        </div>

        {cart.length ? (
          cart.map((m) => (
            <div className="cart-row" key={m.brand}>
              <div>
                <strong>{m.name}</strong>
                <small>
                  Based on: {m.brand} · {m.salt}
                </small>
                <small>
                  Qty {m.qty} × ₹{m.price.toFixed(2)}
                </small>
              </div>
              <strong>₹{(m.qty * m.price).toFixed(2)}</strong>
              <button
                className="icon-button"
                title="Remove"
                onClick={() =>
                  setCart((prev) => prev.filter((x) => x.brand !== m.brand))
                }
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        ) : (
          <div className="empty">
            Add an alternative from the catalogue to build your demo order.
          </div>
        )}

        <div className="cart-total">
          <span>Estimated total</span>
          <strong>₹{total.toFixed(2)}</strong>
        </div>

        <label className="checkout-name">
          Customer name
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Name for receipt"
            required
          />
        </label>

        <button
          className="button place-order-button"
          disabled={!cart.length || !customerName.trim()}
          onClick={placeOrder}
        >
          Confirm / Place Demo Order
        </button>

        {confirmation && (
          <div className="success order-confirmation">
            <CheckCircle2 /> {confirmation}{' '}
            <a href="/orders">View Track Orders</a>
          </div>
        )}

        <p className="small-text">
          Demo confirmation only. No medicines are purchased, reserved or
          delivered.
        </p>
      </section>

      {/* Bottom Medical Disclaimer */}
      <div className="warning-box wide-warning">
        This sample catalogue is not a verified medicine database and does not
        confirm equivalence, availability, suitability or actual savings. Do
        not change a prescribed medicine based on this app; ask a pharmacist or
        prescriber.
      </div>
    </main>
  );
}
