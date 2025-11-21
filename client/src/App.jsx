import React, { useEffect, useState } from 'react';

const API_BASE = '';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    userId: 'demo-user',
    category: '',
    amount: '',
    currency: 'USD',
    note: ''
  });

  const loadExpenses = async () => {
    const res = await fetch(`${API_BASE}/api/expenses`);
    const data = await res.json();
    setExpenses(data);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      amount: Number(form.amount)
    };
    const res = await fetch(`${API_BASE}/api/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      setForm((f) => ({ ...f, category: '', amount: '', note: '' }));
      loadExpenses();
    }
  };

  const handleDelete = async (id) => {
    await fetch(`${API_BASE}/api/expenses/` + id, { method: 'DELETE' });
    loadExpenses();
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24, fontFamily: 'system-ui' }}>
      <h1>Cross-Platform Expense Tracker</h1>
      <p>Demo web UI connected to the Node.js backend.</p>

      <form onSubmit={handleSubmit} style={{ marginBottom: 24, display: 'grid', gap: 8 }}>
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />
        <input
          name="amount"
          type="number"
          step="0.01"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <input
          name="currency"
          placeholder="Currency"
          value={form.currency}
          onChange={handleChange}
        />
        <input
          name="note"
          placeholder="Note (optional)"
          value={form.note}
          onChange={handleChange}
        />
        <button type="submit">Add Expense</button>
      </form>

      <h2>Recent Expenses</h2>
      {expenses.length === 0 && <p>No expenses yet.</p>}
      <ul>
        {expenses.map((e) => (
          <li key={e.id} style={{ marginBottom: 8 }}>
            <strong>{e.category}</strong> — {e.amount} {e.currency} [{e.user_id}]
            {e.note && ` — ${e.note}`}
            <button style={{ marginLeft: 8 }} onClick={() => handleDelete(e.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
