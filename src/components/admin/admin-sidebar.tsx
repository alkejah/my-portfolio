"use client"

import {
  ExternalLink,
  FolderKanban,
  LayoutDashboard,
  Settings2
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { LogoutButton } from "@/components/admin/logout-button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

type AdminSidebarProps = {
  username: string
}

const navigationItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
  title:
    "Settings",

  href:
    "/admin/settings",

  icon:
    Settings2,
},
]

function isNavigationItemActive(
  pathname: string,
  href: string
) {
  if (href === "/admin") {
    return pathname === "/admin"
  }

  return pathname.startsWith(href)
}

const sidebarLinkClassName =
  "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring [&>svg]:size-4 [&>svg]:shrink-0 [&>span]:truncate"

export function AdminSidebar({
  username,
}: AdminSidebarProps) {
  const pathname = usePathname()

  const { setOpenMobile } = useSidebar()

  function handleNavigation() {
    setOpenMobile(false)
  }

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="border-b">
        <div className="px-2 py-3">
          <p className="font-semibold">
            Portfolio CMS
          </p>

          <p className="text-xs text-muted-foreground">
            {siteConfig.name}
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Management
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon

                const active =
                  isNavigationItemActive(
                    pathname,
                    item.href
                  )

                return (
                  <SidebarMenuItem
                    key={item.href}
                  >
                    <Link
                      href={item.href}
                      onClick={handleNavigation}
                      aria-current={
                        active
                          ? "page"
                          : undefined
                      }
                      className={cn(
                        sidebarLinkClassName,

                        active &&
                          "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                      )}
                    >
                      <Icon />

                      <span>
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            Website
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className={
                    sidebarLinkClassName
                  }
                >
                  <ExternalLink />

                  <span>
                    View Portfolio
                  </span>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="space-y-3 p-2">
          <div>
            <p className="text-xs text-muted-foreground">
              Signed in as
            </p>

            <p className="truncate text-sm font-medium">
              {username}
            </p>
          </div>

          <LogoutButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}