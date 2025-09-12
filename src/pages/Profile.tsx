import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';

type ProfileData = {
  name: string;
  email: string;
  phone: string;
  country: string;
  currency: string;
  dob: string;
  occupation: string;
  avatarDataUrl?: string; // base64 image persisted locally
};

const LOCAL_STORAGE_KEY = 'wise_ledger_profile_v1';

const defaultProfile: ProfileData = {
  name: '',
  email: '',
  phone: '',
  country: 'India',
  currency: 'INR',
  dob: '',
  occupation: '',
  avatarDataUrl: '',
};

export default function Profile() {
  const [data, setData] = useState<ProfileData>(defaultProfile);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) setData(JSON.parse(raw) as ProfileData);
    } catch {}
  }, []);

  const save = () => {
    setSaving(true);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch {}
    setTimeout(() => setSaving(false), 300);
  };

  const onPickAvatar: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setData((prev) => ({ ...prev, avatarDataUrl: String(reader.result || '') }));
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setData((prev) => ({ ...prev, avatarDataUrl: '' }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">Manage your personal and financial details</p>
          </div>
          <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</Button>
        </div>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2 md:col-span-2">
                <Label>Profile Picture</Label>
                <div className="flex items-center gap-4">
                  {/* Preview */}
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex items-center justify-center text-sm text-muted-foreground">
                    {data.avatarDataUrl ? (
                      <img src={data.avatarDataUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span>Avatar</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input type="file" accept="image/*" onChange={onPickAvatar} />
                    {data.avatarDataUrl && (
                      <Button variant="outline" type="button" onClick={removeAvatar}>Remove</Button>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" value={data.dob} onChange={(e) => setData({ ...data, dob: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Financial Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Country</Label>
                <Select value={data.country} onValueChange={(v) => setData({ ...data, country: v })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="India">India</SelectItem>
                    <SelectItem value="USA">USA</SelectItem>
                    <SelectItem value="UK">UK</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Preferred Currency</Label>
                <Select value={data.currency} onValueChange={(v) => setData({ ...data, currency: v })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input id="occupation" value={data.occupation} onChange={(e) => setData({ ...data, occupation: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

