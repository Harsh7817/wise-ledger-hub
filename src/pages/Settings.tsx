import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useEffect, useState } from 'react';

type SettingsData = {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'hi';
  timezone: string;
  defaultDashboard: 'Dashboard' | 'Income' | 'Expenses' | 'Budget';
  budgetResetDay: number; // 1..28
  emailNotifications: boolean;
  overspendAlerts: boolean;
  taxRegime: 'old' | 'new';
};

const LOCAL_STORAGE_KEY = 'wise_ledger_settings_v1';

const defaultSettings: SettingsData = {
  theme: 'system',
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  defaultDashboard: 'Dashboard',
  budgetResetDay: 1,
  emailNotifications: true,
  overspendAlerts: true,
  taxRegime: 'new',
};

export default function Settings() {
  const [data, setData] = useState<SettingsData>(defaultSettings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) setData(JSON.parse(raw) as SettingsData);
    } catch {}
  }, []);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldDark = data.theme === 'dark' || (data.theme === 'system' && prefersDark);
    if (shouldDark) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [data.theme]);

  const save = () => {
    setSaving(true);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch {}
    setTimeout(() => setSaving(false), 300);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Configure app preferences and privacy</p>
          </div>
          <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</Button>
        </div>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Theme</Label>
                <Select value={data.theme} onValueChange={(v) => setData({ ...data, theme: v as SettingsData['theme'] })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Language</Label>
                <Select value={data.language} onValueChange={(v) => setData({ ...data, language: v as SettingsData['language'] })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tz">Timezone</Label>
                <Input id="tz" value={data.timezone} onChange={(e) => setData({ ...data, timezone: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Budget & Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Default Dashboard</Label>
                <Select value={data.defaultDashboard} onValueChange={(v) => setData({ ...data, defaultDashboard: v as SettingsData['defaultDashboard'] })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select default view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dashboard">Dashboard</SelectItem>
                    <SelectItem value="Income">Income</SelectItem>
                    <SelectItem value="Expenses">Expenses</SelectItem>
                    <SelectItem value="Budget">Budget</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reset">Budget reset day (1-28)</Label>
                <Input id="reset" type="number" min={1} max={28} value={data.budgetResetDay} onChange={(e) => setData({ ...data, budgetResetDay: Number(e.target.value) })} />
              </div>
              <div className="grid gap-2">
                <Label>Tax regime</Label>
                <Select value={data.taxRegime} onValueChange={(v) => setData({ ...data, taxRegime: v as SettingsData['taxRegime'] })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select regime" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="old">Old</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email notifications</p>
                  <p className="text-sm text-muted-foreground">Get periodic summaries and alerts</p>
                </div>
                <Switch checked={data.emailNotifications} onCheckedChange={(v) => setData({ ...data, emailNotifications: v })} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Overspend alerts</p>
                  <p className="text-sm text-muted-foreground">Warn when a group or category exceeds budget</p>
                </div>
                <Switch checked={data.overspendAlerts} onCheckedChange={(v) => setData({ ...data, overspendAlerts: v })} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

