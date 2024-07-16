import { getCopyTradingSetting } from "@/actions/copy-trading";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { copyTradingSettingColumns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { Tab, TabList, TabPanel, Tabs } from "@/components/v2/tabs/tabs";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

enum TabSections {
  Following = "following",
  Roles = "roles",
  Identities = "identities"
}

export default async function ManageCopyTradingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const data = await getCopyTradingSetting(user?.id!);


  return (
    <DashboardShell>
      <DashboardHeader
        heading="Manage Copy-Trading"
        text=""
      />
      <div className=''>
        <Tabs defaultValue={TabSections.Following}>
          <TabList>
            <Tab value={TabSections.Following}>Following</Tab>
            {/* <Tab value={TabSections.Identities}>
              <div className="flex items-center">
                <p>Machine Identities</p>
              </div>
            </Tab>
            <Tab value={TabSections.Roles}>Organization Roles</Tab> */}
          </TabList>
          <TabPanel value={TabSections.Following}>
            <DataTable data={data} columns={copyTradingSettingColumns} />
          </TabPanel>
          {/* <TabPanel value={TabSections.Identities}>
            Identities
          </TabPanel>
          <TabPanel value={TabSections.Roles}>
            Roles
          </TabPanel> */}
        </Tabs>

      </div>
      
    </DashboardShell>
  );
}


  