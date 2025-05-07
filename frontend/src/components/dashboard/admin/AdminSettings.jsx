import React from 'react';
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Switch } from "../../ui/switch";
import { Textarea } from "../../ui/textarea";

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Admin Settings</h2>
        <p className="text-muted-foreground">Manage platform settings and configurations</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Manage general platform configurations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input id="platform-name" defaultValue="FundShare" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform-description">Platform Description</Label>
                <Textarea id="platform-description" defaultValue="A crowdfunding platform connecting creators with supporters and companies." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Support Email</Label>
                <Input id="contact-email" type="email" defaultValue="support@fundshare.example.com" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                  <Switch id="maintenance-mode" />
                </div>
                <p className="text-sm text-muted-foreground">When enabled, the site will display a maintenance page to visitors.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Homepage Configuration</CardTitle>
              <CardDescription>Customize what appears on the homepage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="feature-projects">Featured Projects</Label>
                  <p className="text-sm text-muted-foreground">Show featured projects section</p>
                </div>
                <Switch id="feature-projects" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="feature-challenges">Funding Challenges</Label>
                  <p className="text-sm text-muted-foreground">Show company funding challenges</p>
                </div>
                <Switch id="feature-challenges" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="feature-stats">Platform Statistics</Label>
                  <p className="text-sm text-muted-foreground">Show platform statistics</p>
                </div>
                <Switch id="feature-stats" defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="featured-count">Number of featured items</Label>
                <Input id="featured-count" type="number" defaultValue="6" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure system email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="new-user-emails">New User Registration</Label>
                  <p className="text-sm text-muted-foreground">Send email when new users register</p>
                </div>
                <Switch id="new-user-emails" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="new-project-emails">New Project Submission</Label>
                  <p className="text-sm text-muted-foreground">Send email when new projects are submitted</p>
                </div>
                <Switch id="new-project-emails" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="challenge-emails">New Challenge Proposal</Label>
                  <p className="text-sm text-muted-foreground">Send email when new challenges are proposed</p>
                </div>
                <Switch id="challenge-emails" defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-sender">Sender Email Address</Label>
                <Input id="email-sender" defaultValue="notifications@fundshare.example.com" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor">Require Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">For admin and moderator accounts</p>
                </div>
                <Switch id="two-factor" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="force-password">Force Password Reset</Label>
                  <p className="text-sm text-muted-foreground">Require all users to reset passwords</p>
                </div>
                <Switch id="force-password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input id="session-timeout" type="number" defaultValue="60" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="failed-attempts">Max Failed Login Attempts</Label>
                <Input id="failed-attempts" type="number" defaultValue="5" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;