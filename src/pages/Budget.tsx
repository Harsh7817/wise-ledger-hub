import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Settings,
  Target,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export default function Budget() {
  const budgetCategories = [
    { name: 'Housing', budgeted: 1500, spent: 1200, type: 'needs', color: 'primary' },
    { name: 'Transportation', budgeted: 400, spent: 420, type: 'needs', color: 'info' },
    { name: 'Groceries', budgeted: 600, spent: 485, type: 'needs', color: 'success' },
    { name: 'Utilities', budgeted: 200, spent: 156, type: 'needs', color: 'warning' },
    { name: 'Entertainment', budgeted: 300, spent: 275, type: 'wants', color: 'destructive' },
    { name: 'Dining Out', budgeted: 250, spent: 320, type: 'wants', color: 'muted' },
    { name: 'Emergency Fund', budgeted: 500, spent: 500, type: 'savings', color: 'primary' },
    { name: 'Retirement', budgeted: 800, spent: 800, type: 'savings', color: 'success' },
  ];

  const totalBudgeted = budgetCategories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);

  const needsSpent = budgetCategories.filter(cat => cat.type === 'needs').reduce((sum, cat) => sum + cat.spent, 0);
  const wantsSpent = budgetCategories.filter(cat => cat.type === 'wants').reduce((sum, cat) => sum + cat.spent, 0);
  const savingsSpent = budgetCategories.filter(cat => cat.type === 'savings').reduce((sum, cat) => sum + cat.spent, 0);

  const getProgressColor = (spent: number, budgeted: number) => {
    const percentage = (spent / budgeted) * 100;
    if (percentage > 100) return 'destructive';
    if (percentage > 80) return 'warning';
    return 'primary';
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
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
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
                  <p className="text-2xl font-bold text-foreground">${totalBudgeted.toFixed(2)}</p>
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
                  <p className="text-2xl font-bold text-foreground">${totalSpent.toFixed(2)}</p>
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
                  <p className="text-2xl font-bold text-success">${(totalBudgeted - totalSpent).toFixed(2)}</p>
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
                  <p className="text-2xl font-bold text-foreground">{((totalSpent / totalBudgeted) * 100).toFixed(1)}%</p>
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
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Needs (50%)</span>
                  <span className="text-sm text-muted-foreground">${needsSpent} / $2,600</span>
                </div>
                <Progress value={(needsSpent / 2600) * 100} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Wants (30%)</span>
                  <span className="text-sm text-muted-foreground">${wantsSpent} / $1,560</span>
                </div>
                <Progress value={(wantsSpent / 1560) * 100} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Savings (20%)</span>
                  <span className="text-sm text-muted-foreground">${savingsSpent} / $1,040</span>
                </div>
                <Progress value={(savingsSpent / 1040) * 100} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Categories */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Budget Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {budgetCategories.map((category, index) => {
                const percentage = (category.spent / category.budgeted) * 100;
                const isOverBudget = category.spent > category.budgeted;
                
                return (
                  <div key={index} className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{category.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {category.type}
                        </Badge>
                        {isOverBudget && (
                          <Badge variant="destructive" className="text-xs">
                            Over Budget
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ${category.spent} / ${category.budgeted}
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
                        Over budget by ${(category.spent - category.budgeted).toFixed(2)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}