// "use client"

import { getCopyTradingSetting } from "@/actions/copy-trading";
import { DashboardHeader } from "@/components/dashboard/header";
import { copyTradingSettingColumns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { TableSkeleton } from "@/components/ui/skeleton";
import { Tab, TabList, TabPanel, Tabs } from "@/components/v2/tabs/tabs";
import { getCurrentUser } from "@/lib/session";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  // const {data:session, status} = useSession();
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [data, setData] = useState<any[]>([]);
  // const router = useRouter();

  // if (!session || !session.user) {
  //   redirect("/login");
  // }
  const data = await getCopyTradingSetting(user?.id!);

  // const data = await getCopyTradingSetting(user?.id!);
  // useEffect(() => {
  //   if (status === 'loading') return;
  //   if (!session || !session.user) {
  //     router.push('/login');
  //     return;
  //   }

  //   const fetchData = async () => {
  //     const data = await getCopyTradingSetting(session.user.id!);
  //     // console.log("data:", data);
  //     setData(data);
  //     setIsLoading(false);
  //   };

  //   fetchData();
  // }, [session, status]);

  return (
    // <DashboardShell>
    <>
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
            {/* {isLoading ? (
              <div>
                <TableSkeleton />
              </div>
            ) : (
              <DataTable data={data} columns={copyTradingSettingColumns} />
            )} */}
            {data ? (
              <DataTable data={data} columns={copyTradingSettingColumns} />
            ) : (
              <TableSkeleton />
            )}
              {/* <DataTable data={data} columns={copyTradingSettingColumns} /> */}

          </TabPanel>
          {/* <TabPanel value={TabSections.Identities}>
            Identities
          </TabPanel>
          <TabPanel value={TabSections.Roles}>
            Roles
          </TabPanel> */}
        </Tabs>

      </div>
      
    </>
  );
}


  