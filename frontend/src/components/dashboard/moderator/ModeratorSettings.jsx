import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Switch } from "../../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Textarea } from "../../ui/textarea";

const ModeratorSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Moderator Settings</h2>
        <p className="text-muted-foreground">Configure your moderation preferences and workflow</p>
      </div>

      <Tabs defaultValue="preferences">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="templates">Review Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preferences" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Review Preferences</CardTitle>
              <CardDescription>Configure how you review projects and proposals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projects-per-page">Projects per page</Label>
                <Select defaultValue="10">
                  <SelectTrigger id="projects-per-page">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 projects</SelectItem>
                    <SelectItem value="10">10 projects</SelectItem>
                    <SelectItem value="20">20 projects</SelectItem>
                    <SelectItem value="50">50 projects</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-assign">Auto-assign new items</Label>
                  <p className="text-sm text-muted-foreground">Automatically assign new projects to your queue</p>
                </div>
                <Switch id="auto-assign" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-creator-history">Show creator history</Label>
                  <p className="text-sm text-muted-foreground">View creator's past projects during review</p>
                </div>
                <Switch id="show-creator-history" defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="default-sort">Default sorting</Label>
                <Select defaultValue="date-new">
                  <SelectTrigger id="default-sort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-new">Newest first</SelectItem>
                    <SelectItem value="date-old">Oldest first</SelectItem>
                    <SelectItem value="goal-high">Highest goal first</SelectItem>
                    <SelectItem value="goal-low">Lowest goal first</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Moderation Queue</CardTitle>
              <CardDescription>Manage your review workload</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="daily-limit">Daily review limit</Label>
                  <p className="text-sm text-muted-foreground">Maximum number of items to review per day</p>
                </div>
                <Input 
                  id="daily-limit" 
                  type="number" 
                  defaultValue="15" 
                  min="1" 
                  className="w-20 text-right" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialization">Review specialization</Label>
                <Select defaultValue="all">
                  <SelectTrigger id="specialization">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All project types</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="environment">Environment</SelectItem>
                    <SelectItem value="arts">Arts & Culture</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">You'll be prioritized for these project types</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Queue Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure when and how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-new-projects">New projects to review</Label>
                  <p className="text-sm text-muted-foreground">Receive email when new projects are ready for review</p>
                </div>
                <Switch id="email-new-projects" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-new-proposals">New proposals to review</Label>
                  <p className="text-sm text-muted-foreground">Receive email when new challenge proposals are submitted</p>
                </div>
                <Switch id="email-new-proposals" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-daily-digest">Daily digest</Label>
                  <p className="text-sm text-muted-foreground">Receive a daily summary of your moderation queue</p>
                </div>
                <Switch id="email-daily-digest" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="browser-notifications">Browser notifications</Label>
                  <p className="text-sm text-muted-foreground">Show browser notifications for new items</p>
                </div>
                <Switch id="browser-notifications" defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notification-frequency">Email frequency</Label>
                <Select defaultValue="immediately">
                  <SelectTrigger id="notification-frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediately">Immediately</SelectItem>
                    <SelectItem value="hourly">Hourly digest</SelectItem>
                    <SelectItem value="daily">Daily digest</SelectItem>
                    <SelectItem value="never">Never (web only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Review Response Templates</CardTitle>
              <CardDescription>Create templates for common review responses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input id="template-name" placeholder="e.g., Request More Information" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="template-text">Template Text</Label>
                <Textarea 
                  id="template-text" 
                  placeholder="Enter template text..." 
                  rows={5}
                />
              </div>
              
              <Button variant="outline" className="w-full">Add Template</Button>
              
              <div className="border rounded-md mt-6">
                <div className="px-4 py-3 border-b flex justify-between items-center">
                  <h4 className="font-medium">Approval Template</h4>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                  </div>
                </div>
                <div className="p-4 text-sm">
                  Thank you for your submission. We're pleased to inform you that your project has been approved
                  and is now live on our platform. We wish you the best of luck with your fundraising efforts!
                </div>
              </div>
              
              <div className="border rounded-md">
                <div className="px-4 py-3 border-b flex justify-between items-center">
                  <h4 className="font-medium">Minor Changes Template</h4>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                  </div>
                </div>
                <div className="p-4 text-sm">
                  Thank you for your submission. Your project shows promise, but we need some minor changes 
                  before it can be approved. Please address the following points and resubmit your project.
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Templates</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModeratorSettings;
