"use client";

import { Box, ChartLine, List, ChevronRight, Settings2 } from "lucide-react";
import { Link } from "react-router";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({ items }) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <Link to="/" tabIndex="-1">
            <SidebarMenuButton tooltip="Products">
              <Box />
              <span>Products</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link to="/lists" tabIndex="-1">
            <SidebarMenuButton tooltip="Lists">
              <List />
              <span>Lists</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link to="/dashboard" tabIndex="-1">
            <SidebarMenuButton tooltip="Dashboard">
              <ChartLine />
              <span>Dashboard</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link to="/settings" tabIndex="-1">
            <SidebarMenuButton tooltip="Settings">
              <Settings2 />
              <span>Settings</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
