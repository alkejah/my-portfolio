import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { SkipLink } from "@/components/shared/skip-link";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getAdminSession } from "@/lib/auth/session";
import { ThemeToggle } from "@/components/shared/theme-toggle";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <SidebarProvider>
      <SkipLink href="#admin-main-content">Skip to admin content</SkipLink>
      <AdminSidebar username={session.username} />

      <SidebarInset className="min-w-0">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur md:px-6">
          <SidebarTrigger />

          <div className="h-4 w-px bg-border" />

          <p className="text-sm font-medium">Admin workspace</p>

          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>

        <main id="admin-main-content" tabIndex={-1} className="flex-1">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
