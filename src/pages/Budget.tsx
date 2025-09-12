import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Wallet,
  Target,
  TrendingUp,
  AlertTriangle,
  Edit,
  Trash2
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

 type BudgetGroup = 'Needs' | 'Wants' | 'Savings';

 type BudgetCategory = {
  id: number;
  name: string;
  group: BudgetGroup;
  allocated: number; // cents
  // spent removed from source of truth; derive from expenses
};

 type ExpenseEntry = {
  id: number;
  description: string;
  amount: number; // cents
  category: string;
  group: BudgetGroup;
  date: string; // yyyy-mm-dd
};

const INR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });

const LOCAL_STORAGE_KEY = 'wise_ledger_budget_v1';
const EXPENSES_STORAGE_KEY = 'wise_ledger_expenses_v1';

const categoryToGroup: Record<string, BudgetGroup> = {
  Housing: 'Needs',
  Groceries: 'Needs',
  Transportation: 'Needs',
  Utilities: 'Needs',
  'Food & Dining': 'Wants',
  Dining: 'Wants',
  'Dining Out': 'Wants',
  Entertainment: 'Wants',
  Shopping: 'Wants',
  Investments: 'Savings',
  'Emergency Fund': 'Savings',
  Retirement: 'Savings',
};

const defaultCategories: BudgetCategory[] = [
  { id: 1, name: 'Housing', group: 'Needs', allocated: 150000 },
  { id: 2, name: 'Transportation', group: 'Needs', allocated: 40000 },
  { id: 3, name: 'Groceries', group: 'Needs', allocated: 60000 },
  { id: 4, name: 'Utilities', group: 'Needs', allocated: 20000 },
  { id: 5, name: 'Entertainment', group: 'Wants', allocated: 30000 },
  { id: 6, name: 'Dining Out', group: 'Wants', allocated: 25000 },
  { id: 7, name: 'Emergency Fund', group: 'Savings', allocated: 50000 },
  { id: 8, name: 'Retirement', group: 'Savings', allocated: 80000 },
];

// Fallback sample expenses if none exist (to mirror original Expenses page values roughly)
const defaultExpenses: ExpenseEntry[] = [
  { id: 1, description: 'Foods Market', amount: 12550, category: 'Groceries', group: 'Needs', date: '2024-01-15' },
  { id: 2, description: 'Shell Gas Station', amount: 4520, category: 'Transportation', group: 'Needs', date: '2024-01-14' },
  { id: 3, description: 'Netflix Subscription', amount: 1599, category: 'Entertainment', group: 'Wants', date: '2024-01-13' },
  { id: 4, description: 'Coffee Shop', amount: 875, category: 'Food & Dining', group: 'Wants', date: '2024-01-13' },
  { id: 5, description: 'Amazon Purchase', amount: 8999, category: 'Shopping', group: 'Wants', date: '2024-01-12' },
  { id: 6, description: 'Electric Bill', amount: 15680, category: 'Utilities', group: 'Needs', date: '2024-01-10' },
];

export default function Budget() {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [totalBudget, setTotalBudget] = useState<number>(0); // cents
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([]);

  // Dialog states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);

  // Add category form
  const [newName, setNewName] = useState('');
  const [newGroup, setNewGroup] = useState<BudgetGroup>('Needs');
  const [newAllocated, setNewAllocated] = useState('');
  const [addError, setAddError] = useState<string | null>(null);

  // Edit category form
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editGroup, setEditGroup] = useState<BudgetGroup>('Needs');
  const [editAllocated, setEditAllocated] = useState('');
  const [editError, setEditError] = useState<string | null>(null);

  // Add expense form
  const [expenseCategoryId, setExpenseCategoryId] = useState<number | null>(null);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseError, setExpenseError] = useState<string | null>(null);

  // Settings form
  const [settingsTotal, setSettingsTotal] = useState('');
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // Load/save persistence
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { totalBudget: number; categories: BudgetCategory[] };
        setCategories(parsed.categories);
        setTotalBudget(parsed.totalBudget);
      } else {
        setCategories(defaultCategories);
        const initialTotal = defaultCategories.reduce((s, c) => s + c.allocated, 0);
        setTotalBudget(initialTotal);
      }
    } catch {
      setCategories(defaultCategories);
      setTotalBudget(defaultCategories.reduce((s, c) => s + c.allocated, 0));
    }
    try {
      const rawExp = localStorage.getItem(EXPENSES_STORAGE_KEY);
      if (rawExp) {
        setExpenses(JSON.parse(rawExp) as ExpenseEntry[]);
      } else {
        setExpenses(defaultExpenses);
      }
    } catch {
      setExpenses(defaultExpenses);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ totalBudget, categories }));
    } catch {}
  }, [totalBudget, categories]);

  useEffect(() => {
    try {
      localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
    } catch {}
  }, [expenses]);

  // Derived from expenses
  const totalSpent = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);
  const remaining = useMemo(() => Math.max(totalBudget - totalSpent, 0), [totalBudget, totalSpent]);
  const progress = useMemo(() => (totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0), [totalBudget, totalSpent]);

  const groupSpent = useMemo(() => ({
    Needs: expenses.filter(e => e.group === 'Needs').reduce((s, e) => s + e.amount, 0),
    Wants: expenses.filter(e => e.group === 'Wants').reduce((s, e) => s + e.amount, 0),
    Savings: expenses.filter(e => e.group === 'Savings').reduce((s, e) => s + e.amount, 0),
  }), [expenses]);

  const targets = useMemo(() => ({
    Needs: totalBudget * 0.5,
    Wants: totalBudget * 0.3,
    Savings: totalBudget * 0.2,
  }), [totalBudget]);

  const sumAllocated = useMemo(() => categories.reduce((s, c) => s + c.allocated, 0), [categories]);
  const overAllocated = sumAllocated > totalBudget;

  // Category spent map from expenses
  const categorySpentMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of expenses) {
      map[e.category] = (map[e.category] || 0) + e.amount;
    }
    return map;
  }, [expenses]);

  const getProgressColor = (spent: number, allocated: number) => {
    if (allocated === 0) return 'primary';
    const percentage = (spent / allocated) * 100;
    if (percentage > 100) return 'destructive';
    if (percentage > 80) return 'warning';
    return 'primary';
  };

  // Handlers
  const openAdd = () => {
    setNewName('');
    setNewGroup('Needs');
    setNewAllocated('');
    setAddError(null);
    setIsAddOpen(true);
  };

  const addCategory = () => {
    setAddError(null);
    const name = newName.trim();
    const allocatedNum = Number(newAllocated);
    if (!name) return setAddError('Category name is required.');
    if (!Number.isFinite(allocatedNum) || allocatedNum < 0) return setAddError('Allocated must be a non-negative number.');
    const cat: BudgetCategory = {
      id: Date.now(),
      name,
      group: newGroup,
      allocated: Math.round(allocatedNum * 100),
    };
    const newAllocatedSum = sumAllocated + cat.allocated;
    if (newAllocatedSum > totalBudget) return setAddError('Total allocated exceeds total budget. Increase budget in Settings or reduce allocation.');
    setCategories((prev) => [cat, ...prev]);
    setIsAddOpen(false);
  };

  const openEditCategory = (c: BudgetCategory) => {
    setEditingId(c.id);
    setEditName(c.name);
    setEditGroup(c.group);
    setEditAllocated((c.allocated / 100).toString());
    setEditError(null);
    setIsEditOpen(true);
  };

  const saveEditCategory = () => {
    setEditError(null);
    if (editingId == null) return setIsEditOpen(false);
    const name = editName.trim();
    const allocatedNum = Number(editAllocated);
    if (!name) return setEditError('Category name is required.');
    if (!Number.isFinite(allocatedNum) || allocatedNum < 0) return setEditError('Allocated must be a non-negative number.');
    const allocatedCents = Math.round(allocatedNum * 100);

    const newSumAllocated = categories.reduce((s, c) => s + (c.id === editingId ? allocatedCents : c.allocated), 0);
    if (newSumAllocated > totalBudget) return setEditError('Total allocated exceeds total budget.');

    setCategories((prev) => prev.map((c) => c.id === editingId ? { ...c, name, group: editGroup, allocated: allocatedCents } : c));
    setIsEditOpen(false);
  };

  const deleteCategory = (id: number) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const openAddExpense = (categoryId?: number) => {
    setExpenseCategoryId(categoryId ?? null);
    setExpenseAmount('');
    setExpenseDescription('');
    setExpenseError(null);
    setIsExpenseOpen(true);
  };

  const addExpense = () => {
    setExpenseError(null);
    const amountNum = Number(expenseAmount);
    if (expenseCategoryId == null) return setExpenseError('Select a category.');
    if (!Number.isFinite(amountNum) || amountNum <= 0) return setExpenseError('Amount must be a positive number.');
    const addCents = Math.round(amountNum * 100);
    const category = categories.find((c) => c.id === expenseCategoryId);
    if (!category) return setExpenseError('Invalid category.');
    const entry: ExpenseEntry = {
      id: Date.now(),
      description: expenseDescription.trim() || `Expense: ${category.name}`,
      amount: addCents,
      category: category.name,
      group: category.group || categoryToGroup[category.name] || 'Needs',
      date: new Date().toISOString().slice(0, 10),
    };
    setExpenses((prev) => [entry, ...prev]);
    setIsExpenseOpen(false);
  };

  const openSettings = () => {
    setSettingsTotal((totalBudget / 100).toString());
    setSettingsError(null);
    setIsSettingsOpen(true);
  };

  const saveSettings = () => {
    setSettingsError(null);
    const totalNum = Number(settingsTotal);
    if (!Number.isFinite(totalNum) || totalNum < 0) return setSettingsError('Total budget must be a non-negative number.');
    const cents = Math.round(totalNum * 100);
    const allocatedSum = categories.reduce((s, c) => s + c.allocated, 0);
    if (cents < allocatedSum) return setSettingsError('Total budget cannot be less than the sum of category allocations.');
    setTotalBudget(cents);
    setIsSettingsOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Budget</h1>
            <p className="text-muted-foreground">Track your spending against your budget goals</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={openSettings}>
              <Wallet className="w-4 h-4 mr-2" />
              Set Budget
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-primary/90" onClick={openAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
            <Button variant="outline" size="sm" onClick={() => openAddExpense()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                  <p className="text-2xl font-bold text-foreground">{INR.format(totalBudget / 100)}</p>
                </div>
                <Target className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold text-foreground">{INR.format(totalSpent / 100)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Remaining</p>
                  <p className="text-2xl font-bold text-success">{INR.format(remaining / 100)}</p>
                </div>
                <Target className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Progress</p>
                  <p className="text-2xl font-bold text-foreground">{progress.toFixed(1)}%</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 50/30/20 Rule Overview */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>50/30/20 Budget Rule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['Needs','Wants','Savings'] as BudgetGroup[]).map((grp) => (
                <div className="space-y-2" key={grp}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{grp} {grp === 'Needs' ? '(50%)' : grp === 'Wants' ? '(30%)' : '(20%)'}</span>
                    <span className="text-sm text-muted-foreground">{INR.format(groupSpent[grp] / 100)} / {INR.format(targets[grp] / 100)}</span>
                  </div>
                  <Progress value={targets[grp] > 0 ? Math.min((groupSpent[grp] / targets[grp]) * 100, 100) : 0} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Budget Categories */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Budget Categories</CardTitle>
            {overAllocated && (
              <p className="text-sm text-destructive">Allocated sum exceeds Total Budget. Adjust categories or increase budget.</p>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((category) => {
                const spent = categorySpentMap[category.name] || 0;
                const percentage = category.allocated > 0 ? (spent / category.allocated) * 100 : 0;
                const isOverBudget = spent > category.allocated;
                return (
                  <div key={category.id} className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{category.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {category.group}
                        </Badge>
                        {isOverBudget && (
                          <Badge variant="destructive" className="text-xs">
                            Over Budget
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {INR.format(spent / 100)} / {INR.format(category.allocated / 100)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className="h-2"
                    />
                    {isOverBudget && (
                      <p className="text-sm text-destructive mt-2">
                        Over budget by {INR.format((spent - category.allocated) / 100)}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => openAddExpense(category.id)}>Add Expense</Button>
                      <Button variant="ghost" size="sm" onClick={() => openEditCategory(category)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteCategory(category.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
              {categories.length === 0 && (
                <p className="text-sm text-muted-foreground">No categories yet. Add one to get started.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Settings Dialog */}
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Budget Settings</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="total">Total Budget (INR)</Label>
                <Input id="total" type="number" min="0" step="0.01" value={settingsTotal} onChange={(e) => setSettingsTotal(e.target.value)} />
                {settingsError && <p className="text-sm text-destructive">{settingsError}</p>}
              </div>
              <p className="text-xs text-muted-foreground">Targets use 50/30/20 split. Custom splits can be added later.</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>Cancel</Button>
              <Button onClick={saveSettings}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Category Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="cname">Name</Label>
                <Input id="cname" value={newName} onChange={(e) => setNewName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Group</Label>
                <Select value={newGroup} onValueChange={(v) => setNewGroup(v as BudgetGroup)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Needs">Needs</SelectItem>
                    <SelectItem value="Wants">Wants</SelectItem>
                    <SelectItem value="Savings">Savings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="calloc">Allocated (INR)</Label>
                <Input id="calloc" type="number" min="0" step="0.01" value={newAllocated} onChange={(e) => setNewAllocated(e.target.value)} />
              </div>
              {addError && <p className="text-sm text-destructive">{addError}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={addCategory}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="ename">Name</Label>
                <Input id="ename" value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Group</Label>
                <Select value={editGroup} onValueChange={(v) => setEditGroup(v as BudgetGroup)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Needs">Needs</SelectItem>
                    <SelectItem value="Wants">Wants</SelectItem>
                    <SelectItem value="Savings">Savings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ealloc">Allocated (INR)</Label>
                <Input id="ealloc" type="number" min="0" step="0.01" value={editAllocated} onChange={(e) => setEditAllocated(e.target.value)} />
              </div>
              {editError && <p className="text-sm text-destructive">{editError}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button onClick={saveEditCategory}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Expense Dialog */}
        <Dialog open={isExpenseOpen} onOpenChange={setIsExpenseOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Expense</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select value={expenseCategoryId != null ? String(expenseCategoryId) : ''} onValueChange={(v) => setExpenseCategoryId(Number(v))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name} ({c.group})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edesc">Description</Label>
                <Input id="edesc" value={expenseDescription} onChange={(e) => setExpenseDescription(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="eamt">Amount (INR)</Label>
                <Input id="eamt" type="number" min="0" step="0.01" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} />
              </div>
              {expenseError && <p className="text-sm text-destructive">{expenseError}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsExpenseOpen(false)}>Cancel</Button>
              <Button onClick={addExpense}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}