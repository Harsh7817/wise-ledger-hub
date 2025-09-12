# 💸 Wise Ledger Hub – Expense Tracker

Wise Ledger Hub is a modern, feature-rich expense tracker and budget management application built with the MERN stack (MongoDB, Express.js, React, Node.js) and enhanced with modern tooling. It helps you manage your finances, track income & expenses, plan budgets, and even get smart financial advice with an integrated AI assistant.

---

## 🚀 Features

- **User Authentication:** Secure login/signup and protected routes.
- **Dashboard:** Overview of your financial health, recent transactions, and key metrics.
- **Expense & Income Tracking:** Easily add, edit, and categorize expenses and income.
- **Budgeting:** Set and monitor custom budgets.
- **Tax Calculator:** Calculate your Indian income tax (old/new regime) in rupees.
- **Profile & Settings:** Manage personal info, preferences, currency, and more.
- **Reports:** Visualize spending trends and download financial reports.
- **AI Financial Assistant:** Get personalized advice on spending, saving, and budgeting.
- **Responsive UI:** Works great on desktop and mobile.
- **Notifications & Toasters:** Real-time feedback on actions.
- **Secure & Scalable:** Built for modern web standards.

---

## 🛠 Tech Stack

### **Frontend**
- **React** – Component-based UI
- **Vite** – Fast development and builds
- **Tailwind CSS** – Utility-first styling
- **shadcn/ui** – Accessible, customizable UI components
- **React Router** – Client-side routing

### **Backend**
- **Node.js** – Server runtime
- **Express.js** – RESTful API
- **MongoDB** – NoSQL database

### **Other Tools**
- **TanStack Query** – Data fetching and caching
- **React Context** – State management for auth, transactions, etc.
- **OpenAI (optional)** – AI-powered financial assistant

---

## 🖥️ Getting Started

### 1. **Clone the Repository**
```bash
git clone https://github.com/Harsh7817/wise-ledger-hub.git
cd wise-ledger-hub
```

### 2. **Install Frontend Dependencies**
```bash
cd client
npm install
```

### 3. **Install Backend Dependencies**
```bash
cd ../server
npm install
```

### 4. **Environment Variables**
- Copy `.env.example` to `.env` in both `/client` and `/server` directories.
- Fill in MongoDB URI, JWT secrets, and (optionally) OpenAI API key.

### 5. **Start Development Servers**
- **Backend:**
  ```bash
  cd server
  npm run dev
  ```
- **Frontend:**
  ```bash
  cd client
  npm run dev
  ```

### 6. **Visit the App**
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
wise-ledger-hub/
│
├── client/          # Frontend (React, Vite, Tailwind)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   └── ...
│   └── ...
│
├── server/          # Backend (Node.js, Express, MongoDB)
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── ...
│
├── README.md
└── ...
```

---

## 🧠 AI Assistant (Optional)

- To use the AI financial assistant, add your OpenAI API key to the backend `.env` and ensure the `/api/ai-assistant` endpoint is enabled.

---

## 📝 Contributing

Contributions are welcome!  
1. Fork the repo  
2. Create your feature branch  
3. Commit changes  
4. Open a Pull Request

---

## 📄 License

[MIT](LICENSE)

---

## 🙋‍♀️ Authors & Credits

Made with ❤️ by [@Harsh7817](https://github.com/Harsh7817), [@anushka48483](https://github.com/anushka48483) and contributors.

---
