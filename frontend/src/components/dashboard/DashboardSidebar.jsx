import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "../ui/sidebar";
import { HeartHandshake, Users, PieChart, FileText, Briefcase, Award

, Settings, MessageSquare, BarChart, Trophy } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { useIsMobile } from "../../hooks/use-mobile";
import { SheetTitle, SheetDescription } from "../ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export const DashboardSidebar = ({ type }) => {
  const location = useLocation();
  const basePath = `/${type}-dashboard`;
  const isMobile = useIsMobile();
  
  const isActive = (path) => {
    return location.pathname === `${basePath}${path}`;
  };
  
  const getMenuItems = () => {
    const commonItems = [
      {
        title: "Dashboard",
        url: "",
        icon: PieChart,
      },
    ];
    
    // Only add Settings to admin and moderator menus
    if (type !== 'creator') {
      commonItems.push({
        title: "Settings",
        url: "/settings",
        icon: Settings,
      });
    }
    
    if (type === 'creator') {
      return [
        ...commonItems,
        {
          title: "My Projects",
          url: "/projects",
          icon: FileText,
        },
        {
          title: "My Proposals",
          url: "/proposals",
          icon: Briefcase,
        },
        {
          title: "My Challenges",
          url: "/challenges",
          icon: Trophy,
        },
        {
          title: "Messages",
          url: "/messages",
          icon: MessageSquare,
        },
      ];
    }
    
    if (type === 'admin') {
      return [
        ...commonItems,
        {
          title: "Users",
          url: "/users",
          icon: Users,
        },
        {
          title: "Verifications",
          url: "/verifications",
          icon: FileText,
        },
        {
          title: "All Projects",
          url: "/projects",
          icon: FileText,
        },
        {
          title: "Analytics",
          url: "/analytics",
          icon: BarChart,
        },
      ];
    }
    
    // Moderator menu items
    return [
      ...commonItems,
      {
        title: "Verifications",
        url: "/verifications",
        icon: FileText,
      },
      {
        title: "Review Projects",
        url: "/review",
        icon: FileText,
      },
      // {
      //   title: "Review Proposals",
      //   url: "/proposals",
      //   icon: Briefcase,
      // },
      {
        title: "Challenges",
        url: "/challenges",
        icon: Award,
      },
    ];
  };
  
  const items = getMenuItems();
  
  return (
    <Sidebar className={cn(
      isMobile ? "bg-background border-r shadow-md" : ""
    )}>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-3">
          <HeartHandshake className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold text-primary capitalize">{type} Dashboard</span>
          {/* Add SheetTitle and SheetDescription for mobile accessibility */}
          {isMobile && (
            <>
              <VisuallyHidden asChild>
                <SheetTitle>{type} Dashboard</SheetTitle>
              </VisuallyHidden>
              <VisuallyHidden asChild>
                <SheetDescription>
                  Navigate through {type} dashboard features and settings.
                </SheetDescription>
              </VisuallyHidden>
            </>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={isActive(item.url)}
                  >
                    <Link to={`${basePath}${item.url}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <Button variant="outline" asChild className="w-full">
          <Link to="/">
            Back to Home
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};