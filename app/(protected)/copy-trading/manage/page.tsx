// "use client"

import { getCopyTradingSetting } from "@/actions/copy-trading";
import { DashboardHeader } from "@/components/dashboard/header";
import { copyTradingSettingColumns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/skeleton";
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
      <div className='overflow-x-auto'>
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

              {/* <DataTable data={data} columns={copyTradingSettingColumns} /> */}
              {data && data.length > 0 ? (
                <DataTable data={data} columns={copyTradingSettingColumns} />
              ) : (
                <div className="mt-2 rounded-lg border border-gray-300 dark:border-gray-700">
                  <div className="flex h-80 flex-col items-center justify-center space-y-4 p-8 text-center">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {"You haven't followed any traders yet"}
                      </h3>
                      <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
                        Follow a trader to start copy-trading.
                      </p>
                    </div>
                    <form action="/copy-trading" method="get">
                      <Button 
                        type="submit"
                      >
                        Find Best Traders
                      </Button>
                    </form>
                  </div>
                </div>
              )}

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


  