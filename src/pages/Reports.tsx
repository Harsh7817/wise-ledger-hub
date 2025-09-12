import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useTransactions } from "@/contexts/TransactionsContext";

function getMonthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const COLORS = ["#7c3aed", "#22c55e", "#06b6d4", "#f59e0b", "#64748b"];

export default function Reports() {
  const { transactions } = useTransactions();

  // Build last 6 months keys
  const now = new Date();
  const months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(d.toLocaleString(undefined, { month: "short" }));
  }

  // Aggregate per month
  const monthlyMap = new Map<string, { income: number; expenses: number }>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthlyMap.set(getMonthKey(d), { income: 0, expenses: 0 });
  }
  transactions.forEach((tx) => {
    const k = getMonthKey(new Date(tx.date));
    if (!monthlyMap.has(k)) return;
    const agg = monthlyMap.get(k)!;
    if (tx.type === "income") agg.income += tx.amount;
    else agg.expenses += tx.amount;
  });
  const monthlyData = Array.from(monthlyMap.entries()).map(([k, v]) => ({
    month: new Date(k + "-01").toLocaleString(undefined, { month: "short" }),
    income: v.income,
    expenses: v.expenses,
  }));

  // Current month category breakdown
  const currentKey = getMonthKey(now);
  const categoryMap = new Map<string, number>();
  transactions.forEach((tx) => {
    if (getMonthKey(new Date(tx.date)) !== currentKey) return;
    if (tx.type !== "expense") return;
    categoryMap.set(
      tx.category,
      (categoryMap.get(tx.category) ?? 0) + tx.amount
    );
  });
  const categoryData = Array.from(categoryMap.entries()).map(
    ([name, value]) => ({ name, value })
  );

  function downloadBlob(content: BlobPart, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function exportCSV() {
    const bom = "\uFEFF";
    const monthlyHeader = "Month,Income,Expenses\n";
    const monthlyRows = monthlyData
      .map((r) => `${r.month},${r.income.toFixed(2)},${r.expenses.toFixed(2)}`)
      .join("\n");
    const categoryHeader = "\n\nCategory,Amount (This Month)\n";
    const categoryRows = categoryData
      .map((c) => `${c.name},${c.value.toFixed(2)}`)
      .join("\n");
    const csv =
      bom +
      "Summary Report\n" +
      monthlyHeader +
      monthlyRows +
      categoryHeader +
      categoryRows +
      "\n";
    downloadBlob(csv, "report-summary.csv", "text/csv;charset=utf-8;");
  }

  function exportPDF() {
    const win = window.open("", "_blank");
    if (!win) return;
    const monthlyTableRows = monthlyData
      .map(
        (r) =>
          `<tr><td>${r.month}</td><td>$${r.income.toFixed(
            2
          )}</td><td>$${r.expenses.toFixed(2)}</td></tr>`
      )
      .join("");
    const categoryTableRows = categoryData
      .map((c) => `<tr><td>${c.name}</td><td>$${c.value.toFixed(2)}</td></tr>`)
      .join("");
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Report Summary</title>
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; padding: 24px; color: #0f172a; }
    h1 { font-size: 20px; margin: 0 0 16px; }
    h2 { font-size: 16px; margin: 24px 0 8px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
    th { background: #f8fafc; }
  </style>
  </head>
  <body>
    <h1>Report Summary</h1>
    <h2>Income vs Expenses (Last 6 Months)</h2>
    <table>
      <thead><tr><th>Month</th><th>Income</th><th>Expenses</th></tr></thead>
      <tbody>${monthlyTableRows}</tbody>
    </table>
    <h2 style="page-break-inside: avoid;">Spending by Category (This Month)</h2>
    <table>
      <thead><tr><th>Category</th><th>Amount</th></tr></thead>
      <tbody>${categoryTableRows}</tbody>
    </table>
  </body>
</html>`;
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.focus();
    // Give the document a moment to render before printing
    setTimeout(() => {
      win.print();
    }, 300);
  }
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground">
              Visualize your income, expenses, and spending trends
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Summary
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export as</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={exportCSV}>CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={exportPDF}>PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Income vs Expenses (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="month" stroke="currentColor" opacity={0.6} />
                  <YAxis stroke="currentColor" opacity={0.6} />
                  <RechartsTooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Spending by Category (This Month)</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    label
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-soft lg:col-span-2">
            <CardHeader>
              <CardTitle>Monthly Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="month" stroke="currentColor" opacity={0.6} />
                  <YAxis stroke="currentColor" opacity={0.6} />
                  <RechartsTooltip />
                  <Legend />
                  <Bar
                    dataKey="expenses"
                    fill="#7c3aed"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
