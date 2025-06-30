"use client";

import { Calendar, ChevronUp, Home, Settings, UserPen, LogOut, Activity, HeartPulse, Trophy, Users, Tv, Briefcase, User, Shield } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  //DropdownMenuLabel,
  //DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

// Menu items.
const items = [
  {
    title: "Accueil",
    url: "/",
    icon: Home,
  },
  {
    title: "Activités",
    url: "/activities",
    icon: Activity,
  },
  {
    title: "Programmes santé",
    url: "/health-programs",
    icon: HeartPulse,
  },
  {
    title: "Compétitions & défis",
    url: "/competitions",
    icon: Trophy,
  },
  {
    title: "Communauté",
    url: "/community",
    icon: Users,
  },
  {
    title: "Médias & événements",
    url: "/media-events",
    icon: Tv,
  },
  {
    title: "Carrières & pro",
    url: "/careers",
    icon: Briefcase,
  },
  {
    title: "Calendrier",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Groupes",
    url: "/groups",
    icon: Shield,
  }
]

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader><h1>TrainBuddy</h1></SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className={isActive ? "bg-primary text-primary-foreground" : ""}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                        {isActive && (
                          <div className="ml-auto w-2 h-2 bg-primary-foreground rounded-full" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>

      </SidebarFooter>
      <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                  <Avatar>
                      <AvatarImage src="https://github.com/diedasilva.png" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    Username
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User />
                      <span>Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth">
                      <UserPen />
                      <span>Authentification</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings />
                    <span>Paramètres</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  )
}
