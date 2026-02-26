/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import {
  BookOpen,
  Frame,
  GalleryVerticalEnd,
  Home,
  LogOut,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Users,
  LayoutDashboard,
  FileText,
  ShieldCheck,
  UserCog
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const data = {
  teams: [
    {
      name: "NorthStar Academy",
      logo: GalleryVerticalEnd,
      plan: "Admin Dashboard",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Team Management",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Roles",
          url: "/dashboard/team/roles",
          icon: ShieldCheck
        },
        {
          title: "Permissions",
          url: "/dashboard/team/permissions",
          icon: Settings2
        },
        {
          title: "Users",
          url: "/dashboard/team/users",
          icon: UserCog
        },
      ],
    },
    {
      title: "Content Management",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Blog Categories",
          url: "/dashboard/blogs/categories",
        },
        {
          title: "All Blogs",
          url: "/dashboard/blogs",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    // eslint-disable-next-line
    const loadUser = () => {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem("user")
        if (raw) {
          setCurrentUser(JSON.parse(raw))
        }
      }
    }
    loadUser()
  }, [])

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0"
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }
  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="bg-sidebar-primary text-sidebar-primary-foreground">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-sidebar-accent/10">
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white text-sidebar-primary">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-white">NorthStar Academy</span>
                  <span className="truncate text-xs text-white/80">Admin Portal</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => {
              // HIDE Team Management for Team Members
              if (item.title === "Team Management" && currentUser?.role === "Team Member") {
                return null
              }

              // FILTER Content Management items for Team Members
              let subItems = item.items
              if (item.title === "Content Management" && currentUser?.role === "Team Member") {
                // Hide Blog Categories
                subItems = item.items?.filter(sub => sub.title !== "Blog Categories")
              }

              return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  {subItems ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title} className="hover:text-primary">
                          {item.icon && <item.icon className="text-sidebar-primary/80" />}
                          <span className="font-medium">{item.title}</span>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild className="hover:text-primary">
                                <a href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : (
                    <SidebarMenuButton asChild tooltip={item.title} className="hover:text-primary">
                      <a href={item.url}>
                        {item.icon && <item.icon className="text-sidebar-primary/80" />}
                        <span className="font-medium">{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              </Collapsible>
            )})}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-sidebar-accent/20">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg border border-sidebar-border">
                    <AvatarImage src={currentUser?.avatar || ""} alt={currentUser?.name || "User"} />
                    <AvatarFallback className="rounded-lg bg-sidebar-primary text-white">NS</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {currentUser?.name || "User"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">{currentUser?.email || ""}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleLogout}>
                  <LogOut className="mr-2 size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
