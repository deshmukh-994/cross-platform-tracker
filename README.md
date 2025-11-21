# Cross-Platform Expense Tracker — Backend (Ready to Run)

This is a lightweight, ready-to-run backend API for the **Cross-Platform Expense Tracker** project.

It uses:
- Node.js + Express
- SQLite (file-based, no extra setup)
- Simple REST endpoints for expenses

## Getting Started

```bash
cd cross-platform-expense-tracker
npm install
cp .env.example .env
npm start
```

The server will start on `http://localhost:4001` by default.

## Endpoints

- `GET /health` – health check
- `GET /api/expenses` – list all expenses (most recent first)
- `POST /api/expenses` – create new expense  
  ```json
  {
    "userId": "user-1",
    "category": "Food",
    "amount": 25.5,
    "currency": "USD",
    "note": "Lunch"
  }
  ```
- `DELETE /api/expenses/:id` – delete an expense by id

You can easily plug this backend into a React / React Native frontend to complete the project.
