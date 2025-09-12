import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  Target,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your financial overview.</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-primary/90">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Reports
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Balance"
            value="$12,450.00"
            change="+5.2% from last month"
            changeType="positive"
            icon={<DollarSign className="w-6 h-6 text-primary" />}
          />
          <MetricCard
            title="Monthly Income"
            value="$5,200.00"
            change="+2.1% from last month"
            changeType="positive"
            icon={<TrendingUp className="w-6 h-6 text-success" />}
          />
          <MetricCard
            title="Monthly Expenses"
            value="$3,180.00"
            change="-1.5% from last month"
            changeType="positive"
            icon={<TrendingDown className="w-6 h-6 text-destructive" />}
          />
          <MetricCard
            title="Budget Progress"
            value="72%"
            change="Budget remaining: $1,020"
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
                <Button variant="ghost" size="sm">View All</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { category: 'Housing', amount: '$1,200', percentage: 38, color: 'bg-primary' },
                  { category: 'Food & Dining', amount: '$650', percentage: 20, color: 'bg-success' },
                  { category: 'Transportation', amount: '$420', percentage: 13, color: 'bg-info' },
                  { category: 'Entertainment', amount: '$310', percentage: 10, color: 'bg-warning' },
                  { category: 'Other', amount: '$600', percentage: 19, color: 'bg-muted' },
                ].map((item) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-sm font-medium">{item.category}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-muted-foreground">{item.percentage}%</span>
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
                <Button variant="ghost" size="sm">View All</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    description: 'Grocery Store', 
                    amount: '-$85.50', 
                    type: 'expense', 
                    category: 'Food & Dining',
                    date: '2 hours ago'
                  },
                  { 
                    description: 'Salary Deposit', 
                    amount: '+$2,600.00', 
                    type: 'income', 
                    category: 'Salary',
                    date: '1 day ago'
                  },
                  { 
                    description: 'Gas Station', 
                    amount: '-$42.30', 
                    type: 'expense', 
                    category: 'Transportation',
                    date: '2 days ago'
                  },
                  { 
                    description: 'Netflix Subscription', 
                    amount: '-$15.99', 
                    type: 'expense', 
                    category: 'Entertainment',
                    date: '3 days ago'
                  },
                ].map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'income' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-destructive/10 text-destructive'
                      }`}>
                        {transaction.type === 'income' ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{transaction.category} • {transaction.date}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${
                      transaction.type === 'income' ? 'text-success' : 'text-foreground'
                    }`}>
                      {transaction.amount}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}