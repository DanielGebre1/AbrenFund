import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  User, 
  Mail, 
  Lock, 
  CreditCard, 
  Bell, 
  Shield, 
  Trash2, 
  Upload, 
  Info, 
  Check,
  Instagram,
  Twitter,
  Facebook,
  Linkedin
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { checkAuthAndRedirect } from '../utils/authRedirect';

const Settings = () => {
  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [passwordNew, setPasswordNew] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in, redirect if not
    checkAuthAndRedirect('/login');
  }, []);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setIsProfileUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProfileUpdating(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    }, 1000);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    setIsPasswordUpdating(true);
    
    // Validate passwords
    if (passwordNew !== passwordConfirm) {
      setIsPasswordUpdating(false);
      toast({
        title: "Error",
        description: "New passwords don't match.",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsPasswordUpdating(false);
      setPasswordCurrent('');
      setPasswordNew('');
      setPasswordConfirm('');
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
          
          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="w-full flex justify-start border-b pb-0">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Account & Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Billing
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your profile information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/4 flex flex-col items-center space-y-4">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src="https://github.com/shadcn.png" alt="Profile picture" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          Change Photo
                        </Button>
                      </div>
                      
                      <div className="md:w-3/4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" defaultValue="John" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" defaultValue="Doe" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue="john.doe@example.com" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea 
                            id="bio" 
                            placeholder="Tell us about yourself"
                            defaultValue="I'm a software developer passionate about supporting innovative projects."
                            className="min-h-32"
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Social Profiles</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center border rounded-md px-3 py-2">
                              <Twitter className="h-5 w-5 text-[#1DA1F2] mr-2" />
                              <Input 
                                placeholder="Twitter username" 
                                defaultValue="johndoe"
                                className="border-0 p-0 h-8 focus-visible:ring-0"
                              />
                            </div>
                            <div className="flex items-center border rounded-md px-3 py-2">
                              <Facebook className="h-5 w-5 text-[#4267B2] mr-2" />
                              <Input 
                                placeholder="Facebook profile" 
                                defaultValue="johndoe"
                                className="border-0 p-0 h-8 focus-visible:ring-0"
                              />
                            </div>
                            <div className="flex items-center border rounded-md px-3 py-2">
                              <Instagram className="h-5 w-5 text-[#E1306C] mr-2" />
                              <Input 
                                placeholder="Instagram username" 
                                defaultValue="johndoe"
                                className="border-0 p-0 h-8 focus-visible:ring-0"
                              />
                            </div>
                            <div className="flex items-center border rounded-md px-3 py-2">
                              <Linkedin className="h-5 w-5 text-[#0077B5] mr-2" />
                              <Input 
                                placeholder="LinkedIn profile" 
                                className="border-0 p-0 h-8 focus-visible:ring-0"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isProfileUpdating}>
                        {isProfileUpdating ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password regularly to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input 
                          id="current-password" 
                          type="password" 
                          value={passwordCurrent}
                          onChange={e => setPasswordCurrent(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input 
                          id="new-password" 
                          type="password" 
                          value={passwordNew}
                          onChange={e => setPasswordNew(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input 
                          id="confirm-password" 
                          type="password" 
                          value={passwordConfirm}
                          onChange={e => setPasswordConfirm(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isPasswordUpdating}>
                        {isPasswordUpdating ? 'Updating...' : 'Update Password'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <h3 className="font-medium">Two-factor authentication</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Protect your account with an additional verification step.
                      </p>
                    </div>
                    <Switch id="two-factor" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-red-200">
                <CardHeader className="text-red-500">
                  <CardTitle>Delete Account</CardTitle>
                  <CardDescription className="text-red-500/80">
                    Permanently delete your account and all associated data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert className="border-red-200 text-red-600 mb-4">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      This action cannot be undone. All your data including campaigns, donations, and personal information will be permanently deleted.
                    </AlertDescription>
                  </Alert>
                  
                  <Button variant="destructive" className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Control how and when we contact you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Email Notifications</h3>
                      
                      {[
                        {
                          id: "campaign-updates",
                          title: "Campaign Updates",
                          description: "Get notified about updates to campaigns you've backed",
                          defaultChecked: true
                        },
                        {
                          id: "new-backers",
                          title: "New Backers",
                          description: "Receive notifications when someone backs your campaign",
                          defaultChecked: true
                        },
                        {
                          id: "comments",
                          title: "Comments",
                          description: "Get notified about new comments on your campaigns",
                          defaultChecked: false
                        },
                        {
                          id: "feature-updates",
                          title: "Platform Updates",
                          description: "Stay informed about new features and improvements",
                          defaultChecked: true
                        },
                        {
                          id: "promotions",
                          title: "Marketing & Promotions",
                          description: "Receive exclusive offers and promotional content",
                          defaultChecked: false
                        }
                      ].map(item => (
                        <div key={item.id} className="flex items-center justify-between border-b pb-4">
                          <div className="space-y-0.5">
                            <Label htmlFor={item.id} className="text-base cursor-pointer">
                              {item.title}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                          <Switch id={item.id} defaultChecked={item.defaultChecked} />
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-end">
                      <Button className="flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        Save Preferences
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Manage your payment methods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-md p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-md">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                          Remove
                        </Button>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Add Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>
                    View your recent payments and invoices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="px-4 py-3 font-medium bg-muted text-sm grid grid-cols-5">
                      <div className="col-span-2">Description</div>
                      <div>Date</div>
                      <div>Amount</div>
                      <div>Status</div>
                    </div>
                    <div className="divide-y">
                      <div className="px-4 py-3 text-sm grid grid-cols-5 items-center">
                        <div className="col-span-2">Campaign Promotion</div>
                        <div>2025-04-01</div>
                        <div>200 ETB</div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          Paid
                        </div>
                      </div>
                      <div className="px-4 py-3 text-sm grid grid-cols-5 items-center">
                        <div className="col-span-2">Platform Fee</div>
                        <div>2025-03-15</div>
                        <div>50 ETB</div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                          Paid
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;