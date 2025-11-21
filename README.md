# Cross-Platform Expense Tracker (Full Stack Demo)

## Run server

```bash
cd server
npm install
cp .env.example .env
npm start
```

## Run client

```bash
cd client
npm install
npm run dev
```

Client expects server on http://localhost:4001

    "amount": 25.5,
    "currency": "USD",
    "note": "Lunch"
  }
  ```
- `DELETE /api/expenses/:id` – delete an expense by id

You can easily plug this backend into a React / React Native frontend to complete the project.
