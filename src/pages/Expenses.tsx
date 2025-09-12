import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Download,
  ArrowDownRight,
  Edit,
  Trash2
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

 type BudgetGroup = 'Needs' | 'Wants' | 'Savings';

 type ExpenseEntry = {
  id: number;
  description: string;
  amount: number; // cents
  category: string;
  group: BudgetGroup;
  date: string; // yyyy-mm-dd
};

const EXPENSES_STORAGE_KEY = 'wise_ledger_expenses_v1';

const categoryToGroup: Record<string, BudgetGroup> = {
  'Groceries': 'Needs',
  'Transportation': 'Needs',
  'Utilities': 'Needs',
  'Housing': 'Needs',
  'Food & Dining': 'Wants',
  'Dining Out': 'Wants',
  'Entertainment': 'Wants',
  'Shopping': 'Wants',
  'Investments': 'Savings',
  'Emergency Fund': 'Savings',
  'Retirement': 'Savings',
};

const categoryColors: Record<string, string> = {
  'Groceries': 'bg-primary/10 text-primary',
  'Transportation': 'bg-info/10 text-info',
  'Entertainment': 'bg-warning/10 text-warning',
  'Food & Dining': 'bg-success/10 text-success',
  'Shopping': 'bg-destructive/10 text-destructive',
  'Utilities': 'bg-muted-foreground/10 text-muted-foreground',
  'Housing': 'bg-primary/10 text-primary',
  'Investments': 'bg-warning/10 text-warning',
  'Emergency Fund': 'bg-primary/10 text-primary',
  'Retirement': 'bg-success/10 text-success',
};

const defaultExpenses: ExpenseEntry[] = [
  { id: 1, description: 'Foods Market', amount: 12550, category: 'Groceries', group: 'Needs', date: '2024-01-15' },
  { id: 2, description: 'Shell Gas Station', amount: 4520, category: 'Transportation', group: 'Needs', date: '2024-01-14' },
  { id: 3, description: 'Netflix Subscription', amount: 1599, category: 'Entertainment', group: 'Wants', date: '2024-01-13' },
  { id: 4, description: 'Coffee Shop', amount: 875, category: 'Food & Dining', group: 'Wants', date: '2024-01-13' },
  { id: 5, description: 'Amazon Purchase', amount: 8999, category: 'Shopping', group: 'Wants', date: '2024-01-12' },
  { id: 6, description: 'Electric Bill', amount: 15680, category: 'Utilities', group: 'Needs', date: '2024-01-10' },
];

export default function Expenses() {
  const [entries, setEntries] = useState<ExpenseEntry[]>([]);
  const [search, setSearch] = useState('');

  // Add/Edit dialog state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(EXPENSES_STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw) as ExpenseEntry[]);
      else setEntries(defaultExpenses);
    } catch {
      setEntries(defaultExpenses);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(entries));
    } catch {}
  }, [entries]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) =>
      e.description.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.date.includes(q)
    );
  }, [entries, search]);

  const INR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });

  const openAdd = () => {
    setDesc('');
    setAmount('');
    setCategory('Groceries');
    setDate(new Date().toISOString().slice(0, 10));
    setError(null);
    setIsAddOpen(true);
  };

  const addEntry = () => {
    setError(null);
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) return setError('Amount must be positive.');
    const entry: ExpenseEntry = {
      id: Date.now(),
      description: desc.trim() || 'Expense',
      amount: Math.round(amt * 100),
      category,
      group: categoryToGroup[category] || 'Needs',
      date,
    };
    setEntries((prev) => [entry, ...prev]);
    setIsAddOpen(false);
  };

  const openEdit = (e: ExpenseEntry) => {
    setEditingId(e.id);
    setDesc(e.description);
    setAmount((e.amount / 100).toString());
    setCategory(e.category);
    setDate(e.date);
    setError(null);
    setIsEditOpen(true);
  };

  const saveEdit = () => {
    setError(null);
    if (editingId == null) return setIsEditOpen(false);
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) return setError('Amount must be positive.');
    setEntries((prev) => prev.map((e) => e.id === editingId ? {
      ...e,
      description: desc.trim() || 'Expense',
      amount: Math.round(amt * 100),
      category,
      group: categoryToGroup[category] || 'Needs',
      date,
    } : e));
    setIsEditOpen(false);
  };

  const removeEntry = (id: number) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const exportCSV = () => {
    const headers = ['id','description','amount_in_inr','category','group','date'];
    const rows = entries.map((e) => [
      e.id,
      escapeCsv(e.description),
      (e.amount / 100).toFixed(2),
      escapeCsv(e.category),
      e.group,
      e.date,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const escapeCsv = (value: string) => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return '"' + value.replace(/"/g, '""') + '"';
    }
    return value;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Expenses</h1>
            <p className="text-muted-foreground">Track and manage your expenses</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-primary/90" onClick={openAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search expenses..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filtered.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-destructive/10 text-destructive">
                      <ArrowDownRight className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">{expense.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className={categoryColors[expense.category] || 'bg-muted'} variant="secondary">
                      {expense.category}
                    </Badge>
                    <span className="font-semibold text-foreground min-w-28 text-right">
                      -{INR.format(expense.amount / 100)}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(expense)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => removeEntry(expense.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground">No expenses found.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Add Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Expense</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="desc">Description</Label>
                <Input id="desc" value={desc} onChange={(e) => setDesc(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amt">Amount (INR)</Label>
                <Input id="amt" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(categoryToGroup).map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={addEntry}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Expense</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="edesc">Description</Label>
                <Input id="edesc" value={desc} onChange={(e) => setDesc(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="eamt">Amount (INR)</Label>
                <Input id="eamt" type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Edit Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(categoryToGroup).map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edate">Date</Label>
                <Input id="edate" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button onClick={saveEdit}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}