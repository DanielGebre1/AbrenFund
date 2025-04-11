import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "../components/ui/button";
import { 
  Bell, Check, Clock, AlertCircle, 
  Heart, Rocket, DollarSign, MessageSquare, 
  Settings, Trash2, CheckCircle2
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { checkAuthAndRedirect } from '../utils/authRedirect';

const Notifications = () => {
  useEffect(() => {
    checkAuthAndRedirect('/login');
  }, []);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'payment',
      title: 'New Donation Received',
      message: 'You received a 2500 Birr donation for "Renewable Energy Lab" from Ahmed Hassan.',
      date: '2 hours ago',
      read: false,
      icon: <DollarSign className="h-5 w-5 text-green-500" />
    },
    {
      id: 2,
      type: 'update',
      title: 'Campaign Milestone Reached',
      message: 'Your "Student Mental Health Support" campaign has reached 75% of its funding goal!',
      date: '1 day ago',
      read: false,
      icon: <Rocket className="h-5 w-5 text-primary" />
    },
    {
      id: 3,
      type: 'message',
      title: 'New Comment on Your Campaign',
      message: 'Sara Negash commented on your "Agricultural Innovation Hub" campaign: "This is exactly what our region needs!"',
      date: '2 days ago',
      read: true,
      icon: <MessageSquare className="h-5 w-5 text-blue-500" />
    },
    {
      id: 4,
      type: 'alert',
      title: 'Campaign Approval',
      message: 'Your "Digital Literacy Program" campaign has been approved and is now live!',
      date: '3 days ago',
      read: true,
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />
    },
    {
      id: 5,
      type: 'payment',
      title: 'New Donation Received',
      message: 'You received a 1000 Birr donation for "Digital Literacy Program" from Meron Abebe.',
      date: '3 days ago',
      read: true,
      icon: <DollarSign className="h-5 w-5 text-green-500" />
    },
    {
      id: 6,
      type: 'alert',
      title: 'Campaign Ending Soon',
      message: 'Your "Women in STEM Scholarship Fund" campaign ends in 3 days. You are 10,000 Birr away from your goal.',
      date: '4 days ago',
      read: true,
      icon: <AlertCircle className="h-5 w-5 text-orange-500" />
    },
    {
      id: 7,
      type: 'message',
      title: 'New Supporter Message',
      message: 'Haile Gebrselassie sent you a message: "I would like to discuss partnership opportunities for your campaign."',
      date: '5 days ago',
      read: true,
      icon: <MessageSquare className="h-5 w-5 text-blue-500" />
    },
    {
      id: 8,
      type: 'update',
      title: 'New Campaign Feature',
      message: 'We\'ve added new features to help promote your campaigns! Check out the updated campaign dashboard.',
      date: '1 week ago',
      read: true,
      icon: <Bell className="h-5 w-5 text-primary" />
    },
  ]);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    donationAlerts: true,
    commentAlerts: true,
    campaignUpdates: true,
    marketingEmails: false
  });

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSettingChange = (key) => {
    setSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  const getTypeFiltered = (type) => {
    if (type === 'all') return notifications;
    return notifications.filter(n => n.type === type);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Notifications</h1>
              <p className="text-muted-foreground">
                Stay updated on your campaigns and supporter activities
              </p>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              {unreadCount > 0 && (
                <Button variant="outline" onClick={markAllAsRead} className="flex items-center">
                  <Check className="mr-2 h-4 w-4" /> Mark all as read
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={clearAllNotifications} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {unreadCount > 0 && (
            <div className="mb-6">
              <Badge variant="secondary" className="text-xs py-1">
                {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
              </Badge>
            </div>
          )}

          <div className="bg-background rounded-xl shadow-sm overflow-hidden mb-8">
            <Tabs defaultValue="all" className="w-full">
              <div className="border-b px-4">
                <TabsList className="h-16">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="payment">Payments</TabsTrigger>
                  <TabsTrigger value="update">Updates</TabsTrigger>
                  <TabsTrigger value="message">Messages</TabsTrigger>
                  <TabsTrigger value="alert">Alerts</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all">
                <NotificationList 
                  notifications={getTypeFiltered('all')}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              </TabsContent>

              <TabsContent value="payment">
                <NotificationList 
                  notifications={getTypeFiltered('payment')}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              </TabsContent>

              <TabsContent value="update">
                <NotificationList 
                  notifications={getTypeFiltered('update')}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              </TabsContent>

              <TabsContent value="message">
                <NotificationList 
                  notifications={getTypeFiltered('message')}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              </TabsContent>

              <TabsContent value="alert">
                <NotificationList 
                  notifications={getTypeFiltered('alert')}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="bg-background rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">Notification Settings</h2>
              <div className="space-y-6">
                {[
                  { id: 'email-notifications', label: 'Email Notifications', desc: 'Receive notifications via email', key: 'emailNotifications' },
                  { id: 'push-notifications', label: 'Push Notifications', desc: 'Receive notifications on your device', key: 'pushNotifications' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor={item.id}>{item.label}</Label>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch 
                      id={item.id}
                      checked={settings[item.key]}
                      onCheckedChange={() => handleSettingChange(item.key)}
                    />
                  </div>
                ))}

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Notification Types</h3>
                  {[
                    { id: 'donation-alerts', label: 'Donation Alerts', desc: 'When you receive new donations', key: 'donationAlerts' },
                    { id: 'comment-alerts', label: 'Comment Alerts', desc: 'When someone comments on your campaigns', key: 'commentAlerts' },
                    { id: 'campaign-updates', label: 'Campaign Updates', desc: 'Milestones, approvals, and campaign statuses', key: 'campaignUpdates' },
                    { id: 'marketing-emails', label: 'Marketing Emails', desc: 'News, tips, and platform updates', key: 'marketingEmails' }
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor={item.id}>{item.label}</Label>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch 
                        id={item.id}
                        checked={settings[item.key]}
                        onCheckedChange={() => handleSettingChange(item.key)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const NotificationList = ({ notifications, onMarkAsRead, onDelete }) => {
  if (notifications.length === 0) {
    return (
      <div className="p-12 text-center">
        <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-1">No notifications</h3>
        <p className="text-muted-foreground">You're all caught up!</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {notifications.map((notification) => (
        <div 
          key={notification.id} 
          className={`p-4 hover:bg-muted/40 transition-colors relative ${!notification.read ? 'bg-primary/5' : ''}`}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">{notification.icon}</div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className={`font-medium text-base ${!notification.read ? 'font-semibold' : ''}`}>
                  {notification.title}
                </h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                  {notification.date}
                </span>
              </div>
              <p className="text-muted-foreground mt-1 text-sm">{notification.message}</p>
              <div className="flex items-center gap-4 mt-2">
                {!notification.read && (
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => onMarkAsRead(notification.id)}>
                    Mark as read
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 px-2 text-xs text-destructive hover:text-destructive/90"
                  onClick={() => onDelete(notification.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
          {!notification.read && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
