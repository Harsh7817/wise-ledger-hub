import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useTransactions } from "@/contexts/TransactionsContext";
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Target,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    filteredTransactions: transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    budgetProgressPercent,
  } = useTransactions();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formDescription, setFormDescription] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formType, setFormType] = useState<"income" | "expense">("expense");
  const [formCategory, setFormCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setFormDescription("");
    setFormAmount("");
    setFormType("expense");
    setFormCategory("");
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNumber = Number(formAmount);
    if (
      !formDescription.trim() ||
      !formCategory.trim() ||
      !formAmount ||
      isNaN(amountNumber) ||
      amountNumber <= 0
    ) {
      toast({
        title: "Invalid input",
        description:
          "Please provide description, category, and a positive amount.",
        variant: "destructive" as any,
      });
      return;
    }
    if (editingId) {
      updateTransaction(editingId, {
        description: formDescription.trim(),
        amount: amountNumber,
        type: formType,
        category: formCategory.trim(),
      });
      toast({
        title: "Transaction updated",
        description: formDescription.trim(),
      });
    } else {
      addTransaction({
        description: formDescription.trim(),
        amount: amountNumber,
        type: formType,
        category: formCategory.trim(),
      });
      toast({
        title: "Transaction added",
        description: `${formDescription.trim()} $${amountNumber.toFixed(2)}`,
      });
    }
    setIsAddOpen(false);
    setEditingId(null);
    resetForm();
  };

  const openEdit = (tx: {
    id: string;
    description: string;
    amount: number;
    type: "income" | "expense";
    category: string;
  }) => {
    setEditingId(tx.id);
    setFormDescription(tx.description);
    setFormAmount(String(tx.amount));
    setFormType(tx.type);
    setFormCategory(tx.category);
    setIsAddOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's your financial overview.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-primary to-primary/90"
              onClick={() => navigate("/reports")}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              View Reports
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Balance"
            value={`$${totalBalance.toFixed(2)}`}
            change={undefined}
            changeType="neutral"
            icon={<DollarSign className="w-6 h-6 text-primary" />}
          />
          <MetricCard
            title="Monthly Income"
            value={`$${monthlyIncome.toFixed(2)}`}
            change={undefined}
            changeType="positive"
            icon={<TrendingUp className="w-6 h-6 text-success" />}
          />
          <MetricCard
            title="Monthly Expenses"
            value={`$${monthlyExpenses.toFixed(2)}`}
            change={undefined}
            changeType="positive"
            icon={<TrendingDown className="w-6 h-6 text-destructive" />}
          />
          <MetricCard
            title="Budget Progress"
            value={`${budgetProgressPercent.toFixed(0)}%`}
            change={undefined}
            changeType="neutral"
            icon={<Target className="w-6 h-6 text-info" />}
          />
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spending Breakdown */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Spending Breakdown</span>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    category: "Housing",
                    amount: "$1,200",
                    percentage: 38,
                    color: "bg-primary",
                  },
                  {
                    category: "Food & Dining",
                    amount: "$650",
                    percentage: 20,
                    color: "bg-success",
                  },
                  {
                    category: "Transportation",
                    amount: "$420",
                    percentage: 13,
                    color: "bg-info",
                  },
                  {
                    category: "Entertainment",
                    amount: "$310",
                    percentage: 10,
                    color: "bg-warning",
                  },
                  {
                    category: "Other",
                    amount: "$600",
                    percentage: 19,
                    color: "bg-muted",
                  },
                ].map((item) => (
                  <div
                    key={item.category}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm font-medium">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-muted-foreground">
                        {item.percentage}%
                      </span>
                      <span className="text-sm font-medium">{item.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Transactions</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddOpen(true)}
                >
                  Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-full ${
                          transaction.type === "income"
                            ? "bg-success/10 text-success"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.category}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        transaction.type === "income"
                          ? "text-success"
                          : "text-foreground"
                      }`}
                    >
                      {`${
                        transaction.type === "income" ? "+" : "-"
                      }$${transaction.amount.toFixed(2)}`}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(transaction)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTransaction(transaction.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Add Transaction Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Transaction" : "Add Transaction"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="e.g. Coffee Shop"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={formType}
                    onValueChange={(v) =>
                      setFormType(v as "income" | "expense")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="e.g. Food & Dining"
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
