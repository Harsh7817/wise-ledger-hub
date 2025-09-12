import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Calculator,
  FileText,
  DollarSign,
  Receipt
} from 'lucide-react';

export default function TaxCalculator() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tax Calculator</h1>
            <p className="text-muted-foreground">Estimate your tax liability for the current year</p>
          </div>
          <Button size="sm" className="bg-gradient-to-r from-primary to-primary/90">
            <FileText className="w-4 h-4 mr-2" />
            Save Report
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tax Input Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Income Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="annual-income">Annual Income</Label>
                    <Input id="annual-income" placeholder="$75,000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="filing-status">Filing Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married-joint">Married Filing Jointly</SelectItem>
                        <SelectItem value="married-separate">Married Filing Separately</SelectItem>
                        <SelectItem value="head-household">Head of Household</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ca">California</SelectItem>
                        <SelectItem value="ny">New York</SelectItem>
                        <SelectItem value="tx">Texas</SelectItem>
                        <SelectItem value="fl">Florida</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dependents">Number of Dependents</Label>
                    <Input id="dependents" type="number" placeholder="0" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Receipt className="w-5 h-5 mr-2" />
                  Deductions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="standard-deduction">Standard Deduction</Label>
                    <Input id="standard-deduction" placeholder="$13,850" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itemized-deductions">Itemized Deductions</Label>
                    <Input id="itemized-deductions" placeholder="$0" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mortgage-interest">Mortgage Interest</Label>
                    <Input id="mortgage-interest" placeholder="$0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="charitable-donations">Charitable Donations</Label>
                    <Input id="charitable-donations" placeholder="$0" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state-local-taxes">State & Local Taxes</Label>
                    <Input id="state-local-taxes" placeholder="$0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medical-expenses">Medical Expenses</Label>
                    <Input id="medical-expenses" placeholder="$0" />
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-primary to-primary/90">
                  Calculate Tax
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Tax Results */}
          <div className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Tax Estimation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Gross Income</span>
                    <span className="font-medium">$75,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Standard Deduction</span>
                    <span className="font-medium">-$13,850</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Taxable Income</span>
                    <span className="font-medium">$61,150</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Federal Tax</span>
                    <span className="font-medium text-destructive">$8,720</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">State Tax</span>
                    <span className="font-medium text-destructive">$2,145</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">FICA Tax</span>
                    <span className="font-medium text-destructive">$5,738</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total Tax</span>
                    <span className="font-bold text-destructive">$16,603</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">After-Tax Income</span>
                    <span className="font-bold text-success">$58,397</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Tax Breakdown by Bracket</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { rate: '10%', range: '$0 - $11,000', tax: '$1,100' },
                    { rate: '12%', range: '$11,001 - $44,725', tax: '$4,047' },
                    { rate: '22%', range: '$44,726 - $61,150', tax: '$3,573' },
                  ].map((bracket, index) => (
                    <div key={index} className="p-3 rounded-lg bg-accent/50">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{bracket.rate}</p>
                          <p className="text-xs text-muted-foreground">{bracket.range}</p>
                        </div>
                        <span className="font-semibold">{bracket.tax}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}