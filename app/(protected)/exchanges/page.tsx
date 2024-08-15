import { getExchangeAPI } from "@/actions/exchange";
import { getRedisArray } from "@/actions/redisKey";
import { DashboardHeader } from "@/components/dashboard/header";
import { CreateExchangeDialog } from "@/components/exchange/create-exchange-dialog";
import { exchangeApiInfoColumns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { redirect } from "next/navigation";

export const metadata = constructMetadata({
  title: "Exchanges – MoonCrypto",
  description: "Setting your exchange account.",
});

export type ExchangeApiInfo = {
  id: string;
  userId: string
  accountName: string;
  exchangeName: string;
  apiKey: string;
  // secretKey: string;
  // passphrase: string | null;
  // description: string | null;
  enabled: boolean;
  // createdAt: string;
  // updatedAt: string;
};

async function fetchExchangeAPIs(userId: string): Promise<{ data: ExchangeApiInfo[]; status: string }> {
  try {
    const exchangeAPIs = await getExchangeAPI(userId);
    // console.log('Exchange APIs:', exchangeAPIs);
    return {data: exchangeAPIs, status: 'success'};
  } catch (error) {
    console.error(error);
    return { data: [], status: 'error' }
  }
}

export default async function ExchangePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  const {data, status} = await fetchExchangeAPIs(user.id!);
  // const whitelistIPs = await getRedisArray(`exchange_whitelistIPs`)
  const whitelistIPs = ["coming soon"]

  return (
    // <DashboardShell>
    <>
      <div className="flex items-center justify-between">
        <DashboardHeader
          heading="Exchanges"
          // text="Create and manage exchange accounts."
        />
        <CreateExchangeDialog userid={user?.id} ipdata={whitelistIPs} />
      </div>
      {/* <div className='flex h-full w-full flex-col items-center justify-center'> */}
      <div className="overflow-x-auto">
        {/* <CreateExchangeDialog userid={user?.id} ipdata={whitelistIPs} /> */}
        
        {data && data.length > 0 ? (
          <DataTable data={data} columns={exchangeApiInfoColumns} />
        ) : (
          <div className="mt-2 rounded-lg border border-gray-300 dark:border-gray-700">
            <div className="flex h-80 flex-col items-center justify-center space-y-4 p-8 text-center">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{"You don't have any exchange APIs yet"}</h3>
                <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
                  {"Add an exchange API to start copy-trading."}
                </p>
              </div>
              <CreateExchangeDialog userid={user?.id} ipdata={whitelistIPs} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
