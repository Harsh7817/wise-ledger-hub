import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Plus, 
  Search, 
  Filter,
  Download,
  ArrowDownRight,
  Edit,
  Trash2
} from 'lucide-react';
// Add this import for PDF export
import jsPDF from 'jspdf';
import 'jspdf-autotable';

type Expense = {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: string;
};

const categories = [
  'All',
  'Groceries',
  'Transportation',
  'Entertainment',
  'Food & Dining',
  'Shopping',
  'Utilities'
];

export default function Expenses() {
<<<<<<< HEAD
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, description: 'Whole Foods Market', amount: 125.50, category: 'Groceries', date: '2024-01-15', type: 'expense' },
=======
  const expenses = [
    { id: 1, description: 'Foods Market', amount: 125.50, category: 'Groceries', date: '2024-01-15', type: 'expense' },
>>>>>>> 4c6bbf044dca73ce0c340fdb53939448b3b2fd9b
    { id: 2, description: 'Shell Gas Station', amount: 45.20, category: 'Transportation', date: '2024-01-14', type: 'expense' },
    { id: 3, description: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', date: '2024-01-13', type: 'expense' },
    { id: 4, description: 'Coffee Shop', amount: 8.75, category: 'Food & Dining', date: '2024-01-13', type: 'expense' },
    { id: 5, description: 'Amazon Purchase', amount: 89.99, category: 'Shopping', date: '2024-01-12', type: 'expense' },
    { id: 6, description: 'Electric Bill', amount: 156.80, category: 'Utilities', date: '2024-01-10', type: 'expense' },
  ]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [form, setForm] = useState({ description: '', amount: '', category: '', date: '' });
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const categoryColors: Record<string, string> = {
    'Groceries': 'bg-primary/10 text-primary',
    'Transportation': 'bg-info/10 text-info',
    'Entertainment': 'bg-warning/10 text-warning',
    'Food & Dining': 'bg-success/10 text-success',
    'Shopping': 'bg-destructive/10 text-destructive',
    'Utilities': 'bg-muted-foreground/10 text-muted-foreground',
  };

  // Export as CSV
  const handleExportCSV = () => {
    const csv = [
      ['Description', 'Amount', 'Category', 'Date'],
      ...filteredExpenses.map(e => [
        "${e.description}",
        e.amount,
        "${e.category}",
        e.date
      ])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    a.click();
    URL.revokeObjectURL(url);
    setShowExportDropdown(false);
  };

  // Export as PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Expenses', 14, 16);
    (doc as any).autoTable({
      head: [['Description', 'Amount', 'Category', 'Date']],
      body: filteredExpenses.map(e => [
        e.description,
        '-$${e.amount.toFixed(2)}',
        e.category,
        e.date
      ]),
      startY: 22,
    });
    doc.save('expenses.pdf');
    setShowExportDropdown(false);
  };

  // Add Expense
  const handleAddExpense = () => {
    setExpenses([
      ...expenses,
      {
        id: expenses.length ? Math.max(...expenses.map(e => e.id)) + 1 : 1,
        description: form.description,
        amount: parseFloat(form.amount),
        category: form.category,
        date: form.date,
        type: 'expense'
      }
    ]);
    setForm({ description: '', amount: '', category: '', date: '' });
    setShowAddDialog(false);
  };

  // Edit Expense
  const handleEditExpense = () => {
    if (!selectedExpense) return;
    setExpenses(expenses.map(e =>
      e.id === selectedExpense.id
        ? { ...e, ...form, amount: parseFloat(form.amount) }
        : e
    ));
    setSelectedExpense(null);
    setForm({ description: '', amount: '', category: '', date: '' });
    setShowEditDialog(false);
  };

  // Delete Expense
  const handleDeleteExpense = () => {
    if (!selectedExpense) return;
    setExpenses(expenses.filter(e => e.id !== selectedExpense.id));
    setSelectedExpense(null);
    setShowDeleteDialog(false);
  };

  // Open Edit Dialog
  const openEditDialog = (expense: Expense) => {
    setSelectedExpense(expense);
    setForm({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date
    });
    setShowEditDialog(true);
  };

  // Open Delete Dialog
  const openDeleteDialog = (expense: Expense) => {
    setSelectedExpense(expense);
    setShowDeleteDialog(true);
  };

  // Filter and Search Logic
  const filteredExpenses = expenses.filter(e => {
    const matchesCategory = filterCategory === 'All' || e.category === filterCategory;
    const matchesSearch = e.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <DashboardLayout>
      <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Expenses</h1>
            <p className="text-muted-foreground">Track and manage your expenses</p>
          </div>
          <div className="flex items-center space-x-3 relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExportDropdown((v) => !v)}
                  onBlur={() => setTimeout(() => setShowExportDropdown(false), 200)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export expenses as CSV or PDF</TooltipContent>
            </Tooltip>
            {showExportDropdown && (
              <div className="absolute right-0 top-10 z-10 bg-background border rounded shadow p-2 flex flex-col min-w-[120px]">
                <Button variant="ghost" size="sm" onClick={handleExportCSV}>Export as CSV</Button>
                <Button variant="ghost" size="sm" onClick={handleExportPDF}>Export as PDF</Button>
              </div>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" className="bg-gradient-to-r from-primary to-primary/90" onClick={() => setShowAddDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </TooltipTrigger>
              <TooltipContent>Add a new expense</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search expenses..."
                  className="pl-10"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="relative">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilterDropdown((v) => !v)}
                      onBlur={() => setTimeout(() => setShowFilterDropdown(false), 200)}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Filter by category</TooltipContent>
                </Tooltip>
                {showFilterDropdown && (
                  <div className="absolute right-0 top-10 z-10 bg-background border rounded shadow p-2 flex flex-col min-w-[120px]">
                    {categories.map(cat => (
                      <Button
                        key={cat}
                        variant={filterCategory === cat ? "default" : "ghost"}
                        size="sm"
                        className="justify-start"
                        onClick={() => {
                          setFilterCategory(cat);
                          setShowFilterDropdown(false);
                        }}
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                )}
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
              {filteredExpenses.length === 0 && (
                <div className="text-center text-muted-foreground py-8">No expenses found.</div>
              )}
              {filteredExpenses.map((expense) => (
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
                    <span className="font-semibold text-foreground min-w-20 text-right">
                      -${expense.amount.toFixed(2)}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(expense)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit expense</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(expense)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete expense</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Expense Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Description"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
            <Input
              placeholder="Amount"
              type="number"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
            />
            <Input
              placeholder="Category"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            />
            <Input
              placeholder="Date"
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddExpense}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Expense Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Description"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
            <Input
              placeholder="Amount"
              type="number"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
            />
            <Input
              placeholder="Category"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            />
            <Input
              placeholder="Date"
              type="date"
              value={form.date}
              onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleEditExpense}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Expense</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this expense?</p>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteExpense}>Delete</Button>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </TooltipProvider>
    </DashboardLayout>
  );
}