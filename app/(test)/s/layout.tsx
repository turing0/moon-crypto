import { redirect } from "next/navigation";

import { dashboardConfig, settingConfig } from "@/config/dashboard";
import { getCurrentUser } from "@/lib/session";
import { DashboardNav } from "@/components/layout/dashboard-sidenav";
import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { adminConfig } from "@/config/admin";

interface ProtectedLayoutProps {
  children?: React.ReactNode;
}

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  // const user = await getCurrentUser();

  // if (!user) redirect("/login");

  return (
    <div className="grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
      <aside className="hidden w-[200px] flex-col md:flex">
        <DashboardNav
          items={
            // user.role === "ADMIN"
            //   ? adminConfig.sidebarNav
            //   : dashboardConfig.sidebarNav
            settingConfig
          }
        />
      </aside>
      <main className="flex w-full flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
