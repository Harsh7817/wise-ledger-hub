import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter,
  Download,
  ArrowDownRight,
  Edit,
  Trash2
} from 'lucide-react';

export default function Expenses() {
  const expenses = [
    { id: 1, description: 'Foods Market', amount: 125.50, category: 'Groceries', date: '2024-01-15', type: 'expense' },
    { id: 2, description: 'Shell Gas Station', amount: 45.20, category: 'Transportation', date: '2024-01-14', type: 'expense' },
    { id: 3, description: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', date: '2024-01-13', type: 'expense' },
    { id: 4, description: 'Coffee Shop', amount: 8.75, category: 'Food & Dining', date: '2024-01-13', type: 'expense' },
    { id: 5, description: 'Amazon Purchase', amount: 89.99, category: 'Shopping', date: '2024-01-12', type: 'expense' },
    { id: 6, description: 'Electric Bill', amount: 156.80, category: 'Utilities', date: '2024-01-10', type: 'expense' },
  ];

  const categoryColors: Record<string, string> = {
    'Groceries': 'bg-primary/10 text-primary',
    'Transportation': 'bg-info/10 text-info',
    'Entertainment': 'bg-warning/10 text-warning',
    'Food & Dining': 'bg-success/10 text-success',
    'Shopping': 'bg-destructive/10 text-destructive',
    'Utilities': 'bg-muted-foreground/10 text-muted-foreground',
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
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search expenses..." className="pl-10" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
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
              {expenses.map((expense) => (
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
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}