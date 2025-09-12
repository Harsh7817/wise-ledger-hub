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
  ArrowUpRight,
  Edit,
  Trash2
} from 'lucide-react';

export default function Income() {
  const incomeEntries = [
    { id: 1, description: 'Monthly Salary', amount: 5200.00, source: 'Primary Job', date: '2024-01-01', taxable: true },
    { id: 2, description: 'Freelance Project', amount: 850.00, source: 'Freelance', date: '2024-01-05', taxable: true },
    { id: 3, description: 'Investment Returns', amount: 125.50, source: 'Investments', date: '2024-01-08', taxable: true },
    { id: 4, description: 'Side Business', amount: 320.00, source: 'Business', date: '2024-01-10', taxable: true },
    { id: 5, description: 'Gift from Family', amount: 100.00, source: 'Gift', date: '2024-01-12', taxable: false },
    { id: 6, description: 'Tax Refund', amount: 450.00, source: 'Government', date: '2024-01-14', taxable: false },
  ];

  const sourceColors: Record<string, string> = {
    'Primary Job': 'bg-primary/10 text-primary',
    'Freelance': 'bg-info/10 text-info',
    'Investments': 'bg-warning/10 text-warning',
    'Business': 'bg-success/10 text-success',
    'Gift': 'bg-destructive/10 text-destructive',
    'Government': 'bg-muted-foreground/10 text-muted-foreground',
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Income</h1>
            <p className="text-muted-foreground">Track your income sources</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Income
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                  <p className="text-2xl font-bold text-success">$7,045.50</p>
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
                  <p className="text-2xl font-bold text-warning">$6,495.50</p>
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
                  <p className="text-2xl font-bold text-info">$550.00</p>
                </div>
                <ArrowUpRight className="w-8 h-8 text-info" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Search income entries..." className="pl-10" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Income Table */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Income Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incomeEntries.map((income) => (
                <div key={income.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-success/10 text-success">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{income.description}</p>
                      <p className="text-sm text-muted-foreground">{income.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className={sourceColors[income.source] || 'bg-muted'} variant="secondary">
                      {income.source}
                    </Badge>
                    <Badge variant={income.taxable ? "destructive" : "secondary"}>
                      {income.taxable ? 'Taxable' : 'Non-Taxable'}
                    </Badge>
                    <span className="font-semibold text-success min-w-20 text-right">
                      +${income.amount.toFixed(2)}
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