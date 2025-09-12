import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Download,
  ArrowUpRight,
  Edit,
  Trash2,
  Check,
  Info
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type IncomeEntry = {
  id: number;
  description: string;
  amount: number;
  source: string;
  date: string; // ISO yyyy-mm-dd
  taxable: boolean;
};

const INR = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

const LOCAL_STORAGE_KEY = 'wise_ledger_income_entries_v1';

const CATEGORY_OPTIONS = [
  'Primary Job',
  'Freelance',
  'Business',
  'Interest',
  'Rent',
  'Capital Gains',
  'Investments',
  'Gift',
  'Tax-free Bonds Interest',
  'Scholarship',
  'Government',
  'Reimbursement',
  'Other',
];

const defaultEntries: IncomeEntry[] = [
  { id: 1, description: 'Monthly Salary', amount: 520000, source: 'Primary Job', date: '2024-01-01', taxable: true },
  { id: 2, description: 'Freelance Project', amount: 85000, source: 'Freelance', date: '2024-01-05', taxable: true },
  { id: 3, description: 'Investment Returns', amount: 12550, source: 'Investments', date: '2024-01-08', taxable: true },
  { id: 4, description: 'Side Business', amount: 32000, source: 'Business', date: '2024-01-10', taxable: true },
  { id: 5, description: 'Gift from Family', amount: 10000, source: 'Gift', date: '2024-01-12', taxable: false },
  { id: 6, description: 'Tax Refund', amount: 45000, source: 'Government', date: '2024-01-14', taxable: false },
];

export default function Income() {
  const [entries, setEntries] = useState<IncomeEntry[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Income form state
  const [newDescription, setNewDescription] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newSource, setNewSource] = useState('');
  const [newDate, setNewDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [newTaxable, setNewTaxable] = useState<boolean>(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Edit dialog state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editSource, setEditSource] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTaxable, setEditTaxable] = useState<boolean>(true);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const parsed: IncomeEntry[] = JSON.parse(raw);
        setEntries(parsed);
      } else {
        setEntries(defaultEntries);
      }
    } catch {
      setEntries(defaultEntries);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // ignore storage write errors
    }
  }, [entries]);

  const sourceColors: Record<string, string> = {
    'Primary Job': 'bg-primary/10 text-primary',
    'Freelance': 'bg-info/10 text-info',
    'Investments': 'bg-warning/10 text-warning',
    'Business': 'bg-success/10 text-success',
    'Gift': 'bg-destructive/10 text-destructive',
    'Government': 'bg-muted-foreground/10 text-muted-foreground',
    'Interest': 'bg-warning/10 text-warning',
    'Rent': 'bg-primary/10 text-primary',
    'Capital Gains': 'bg-warning/10 text-warning',
    'Tax-free Bonds Interest': 'bg-info/10 text-info',
    'Scholarship': 'bg-info/10 text-info',
    'Reimbursement': 'bg-muted-foreground/10 text-muted-foreground',
    'Other': 'bg-muted',
  };

  // Basic India tax classification helper by common categories
  const inferTaxableFromSource = (source: string): boolean => {
    const normalized = source.trim().toLowerCase();
    const nonTaxableSources = [
      'gift',
      'tax refund',
      'government subsidy',
      'reimbursement',
      'tax-free bonds interest',
      'scholarship',
      'ppf interest',
      'ltcg up to limit',
      'gratuity exempt',
      'lta exempt',
    ];
    if (nonTaxableSources.some((s) => normalized.includes(s))) return false;
    return true;
  };

  // Derived list with search only
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((e) =>
      e.description.toLowerCase().includes(q) ||
      e.source.toLowerCase().includes(q) ||
      e.date.includes(q)
    );
  }, [entries, searchQuery]);

  // Totals (overall)
  const { totalIncome, taxableIncome, nonTaxableIncome } = useMemo(() => {
    const totals = entries.reduce(
      (acc, e) => {
        acc.totalIncome += e.amount;
        if (e.taxable) acc.taxableIncome += e.amount;
        else acc.nonTaxableIncome += e.amount;
        return acc;
      },
      { totalIncome: 0, taxableIncome: 0, nonTaxableIncome: 0 }
    );
    return totals;
  }, [entries]);

  const handleDelete = (id: number) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const openEdit = (entry: IncomeEntry) => {
    setEditingId(entry.id);
    setEditDescription(entry.description);
    setEditAmount((entry.amount / 100).toString());
    setEditSource(entry.source);
    setEditDate(entry.date);
    setEditTaxable(entry.taxable);
    setEditError(null);
    setIsEditOpen(true);
  };

  const saveEdit = () => {
    setEditError(null);
    if (editingId == null) return setIsEditOpen(false);
    const description = editDescription.trim();
    const amountNum = Number(editAmount);
    const source = editSource.trim() || 'Other';
    if (!description) return setEditError('Description is required.');
    if (!Number.isFinite(amountNum) || amountNum <= 0) return setEditError('Amount must be a positive number.');
    if (!editDate) return setEditError('Date is required.');

    setEntries((prev) => prev.map((e) => e.id === editingId ? {
      ...e,
      description,
      amount: Math.round(amountNum * 100),
      source,
      date: editDate,
      taxable: editTaxable,
    } : e));
    setIsEditOpen(false);
  };

  const resetForm = () => {
    setNewDescription('');
    setNewAmount('');
    setNewSource('');
    setNewDate(new Date().toISOString().slice(0, 10));
    setNewTaxable(true);
    setFormError(null);
  };

  const handleOpenAdd = () => {
    setNewTaxable(inferTaxableFromSource(newSource));
    setIsAddOpen(true);
  };

  const handleAdd = () => {
    setFormError(null);
    const description = newDescription.trim();
    const source = newSource.trim() || 'Other';
    const amountNum = Number(newAmount);
    if (!description) return setFormError('Description is required.');
    if (!Number.isFinite(amountNum) || amountNum <= 0) return setFormError('Amount must be a positive number.');
    if (!newDate) return setFormError('Date is required.');

    const entry: IncomeEntry = {
      id: Date.now(),
      description,
      amount: Math.round(amountNum * 100),
      source,
      date: newDate,
      taxable: newTaxable,
    };
    setEntries((prev) => [entry, ...prev]);
    setIsAddOpen(false);
    resetForm();
  };

  const exportCSV = () => {
    const headers = ['id','description','amount_in_inr','source','date','taxable'];
    const rows = entries.map((e) => [
      e.id,
      escapeCsv(e.description),
      (e.amount / 100).toFixed(2),
      escapeCsv(e.source),
      e.date,
      e.taxable ? 'Yes' : 'No',
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `income_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const escapeCsv = (value: string) => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return '"' + value.replace(/"/g, '""') + '"';
    }
    return value;
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 print:space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between print:justify-start print:gap-4">
          <div className="flex items-center gap-2">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Income</h1>
              <p className="text-muted-foreground">Track your income sources</p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center cursor-pointer text-muted-foreground">
                    <Info className="w-4 h-4" />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">
                    Taxable: Salary, Business, Rent, Interest, Capital Gains. Non-Taxable: Gifts from relatives (limits), Scholarships, Tax-free bonds, Reimbursements, Government subsidies.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center space-x-3 print:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={exportCSV}>Export CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={exportPDF}>Export PDF (Print)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={isAddOpen} onOpenChange={(o) => { setIsAddOpen(o); if (!o) resetForm(); }}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-to-r from-primary to-primary/90" onClick={handleOpenAdd}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Income
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Income</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                  <div className="grid gap-2">
                    <Label htmlFor="desc">Description</Label>
                    <Input id="desc" placeholder="e.g., Salary for September" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount (INR)</Label>
                    <Input id="amount" type="number" min="0" step="0.01" placeholder="e.g., 50000" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Category/Source</Label>
                    <Select value={newSource} onValueChange={(v) => { setNewSource(v); setNewTaxable(inferTaxableFromSource(v)); }}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
                  </div>
                  <div className="flex items-center gap-2">
                    <input id="taxable" type="checkbox" checked={newTaxable} onChange={(e) => setNewTaxable(e.target.checked)} />
                    <Label htmlFor="taxable">Taxable (override if needed)</Label>
                  </div>
                  {formError && <p className="text-sm text-destructive">{formError}</p>}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => { setIsAddOpen(false); resetForm(); }}>Cancel</Button>
                  <Button onClick={handleAdd}>Add</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-3">
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                  <p className="text-2xl font-bold text-success">{INR.format(totalIncome / 100)}</p>
                </div>
                <ArrowUpRight className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Taxable Income</p>
                  <p className="text-2xl font-bold text-warning">{INR.format(taxableIncome / 100)}</p>
                </div>
                <ArrowUpRight className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Non-Taxable</p>
                  <p className="text-2xl font-bold text-info">{INR.format(nonTaxableIncome / 100)}</p>
                </div>
                <ArrowUpRight className="w-8 h-8 text-info" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search only */}
        <Card className="shadow-soft print:hidden">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search income entries..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Income Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Income Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-12 text-xs text-muted-foreground px-2">
                <div className="col-span-5">Entry</div>
                <div className="col-span-2 text-right">Amount</div>
                <div className="col-span-2 text-center">Taxable</div>
                <div className="col-span-2 text-center">Non-Taxable</div>
                <div className="col-span-1 text-right"></div>
              </div>
              {filtered.map((income) => (
                <div key={income.id} className="grid grid-cols-12 items-center p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                  <div className="col-span-5 flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-success/10 text-success">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{income.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge className={sourceColors[income.source] || 'bg-muted'} variant="secondary">
                          {income.source}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{income.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 font-semibold text-success text-right">
                    +{INR.format(income.amount / 100)}
                  </div>
                  <div className="col-span-2 text-center">
                    {income.taxable && <Check className="inline w-4 h-4 text-warning" />}
                  </div>
                  <div className="col-span-2 text-center">
                    {!income.taxable && <Check className="inline w-4 h-4 text-info" />}
                  </div>
                  <div className="col-span-1 flex items-center justify-end space-x-1 print:hidden">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(income)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(income.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground">No income entries match your search.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Income</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="edesc">Description</Label>
                <Input id="edesc" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="eamount">Amount (INR)</Label>
                <Input id="eamount" type="number" min="0" step="0.01" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Category/Source</Label>
                <Select value={editSource} onValueChange={(v) => { setEditSource(v); setEditTaxable(inferTaxableFromSource(v)); }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edate">Date</Label>
                <Input id="edate" type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
              </div>
              <div className="flex items-center gap-2">
                <input id="etaxable" type="checkbox" checked={editTaxable} onChange={(e) => setEditTaxable(e.target.checked)} />
                <Label htmlFor="etaxable">Taxable</Label>
              </div>
              {editError && <p className="text-sm text-destructive">{editError}</p>}
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