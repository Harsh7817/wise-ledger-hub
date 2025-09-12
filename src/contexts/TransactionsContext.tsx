import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  description: string;
  amount: number; // positive number; sign is implied by type
  type: TransactionType;
  category: string;
  date: string; // ISO string
};

type TransactionsContextType = {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  addTransaction: (
    t: Omit<Transaction, "id" | "date"> & { date?: string }
  ) => void;
  updateTransaction: (
    id: string,
    updates: Partial<Omit<Transaction, "id">>
  ) => void;
  deleteTransaction: (id: string) => void;
  // computed
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  budgetProgressPercent: number; // expenses as % of income for current month (guarded)
  searchQuery: string;
  setSearchQuery: (q: string) => void;
};

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined
);

const STORAGE_KEY = "transactions";

function getMonthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const seedTransactions: Transaction[] = [
  {
    id: "t1",
    description: "Grocery Store",
    amount: 85.5,
    type: "expense",
    category: "Food & Dining",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "t2",
    description: "Salary Deposit",
    amount: 2600,
    type: "income",
    category: "Salary",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "t3",
    description: "Gas Station",
    amount: 42.3,
    type: "expense",
    category: "Transportation",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "t4",
    description: "Netflix Subscription",
    amount: 15.99,
    type: "expense",
    category: "Entertainment",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const TransactionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return seedTransactions;
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch {}
  }, [transactions]);

  const addTransaction: TransactionsContextType["addTransaction"] = (t) => {
    const id = crypto?.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
    const date = t.date ?? new Date().toISOString();
    setTransactions((prev) => [{ id, date, ...t }, ...prev]);
  };

  const updateTransaction: TransactionsContextType["updateTransaction"] = (
    id,
    updates
  ) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, ...updates } : tx))
    );
  };

  const deleteTransaction: TransactionsContextType["deleteTransaction"] = (
    id
  ) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  const {
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    budgetProgressPercent,
  } = useMemo(() => {
    let balance = 0;
    for (const tx of transactions) {
      balance += tx.type === "income" ? tx.amount : -tx.amount;
    }
    const now = new Date();
    const monthKey = getMonthKey(now);
    let mIncome = 0;
    let mExpenses = 0;
    for (const tx of transactions) {
      const txMonth = getMonthKey(new Date(tx.date));
      if (txMonth === monthKey) {
        if (tx.type === "income") mIncome += tx.amount;
        else mExpenses += tx.amount;
      }
    }
    const budgetPercent =
      mIncome > 0 ? Math.min(100, (mExpenses / mIncome) * 100) : 0;
    return {
      totalBalance: balance,
      monthlyIncome: mIncome,
      monthlyExpenses: mExpenses,
      budgetProgressPercent: budgetPercent,
    };
  }, [transactions]);

  const value: TransactionsContextType = {
    transactions,
    filteredTransactions: useMemo(() => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return transactions;
      return transactions.filter((tx) => {
        const inDesc = tx.description.toLowerCase().includes(q);
        const inCat = tx.category.toLowerCase().includes(q);
        const typeMatch =
          (q === "income" && tx.type === "income") ||
          (q === "expense" && tx.type === "expense");
        return inDesc || inCat || typeMatch;
      });
    }, [transactions, searchQuery]),
    addTransaction,
    updateTransaction,
    deleteTransaction,
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    budgetProgressPercent,
    searchQuery,
    setSearchQuery,
  };

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
};

export function useTransactions() {
  const ctx = useContext(TransactionsContext);
  if (!ctx)
    throw new Error("useTransactions must be used within TransactionsProvider");
  return ctx;
}
