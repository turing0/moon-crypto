import { getExchangeAPI } from "@/actions/exchange";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { CreateExchangeDialog } from "@/components/exchange/create-exchange-dialog";
import { exchangeApiInfoColumns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export type ExchangeApiInfo = {
  id: string;
  userId: string
  exchangeName: string;
  apiKey: string;
  // secretKey: string;
  // passphrase: string | null;
  description: string | null;
  // createdAt: string;
  // updatedAt: string;
};

async function fetchExchangeAPIs(userId: string): Promise<{ data: ExchangeApiInfo[]; status: string }> {
  try {
    const exchangeAPIs = await getExchangeAPI(userId);
    console.log('Exchange APIs:', exchangeAPIs);
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
  const {data, status} = await fetchExchangeAPIs("clxiz8v0z00004iggqdpyuyv3");

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Exchanges"
        text="Create and manage exchange accounts."
      />
      {/* <div className='flex h-full w-full flex-col items-center justify-center'> */}
      <div className=''>
      
        <CreateExchangeDialog userid={user?.id} />
        
        <DataTable data={data} columns={exchangeApiInfoColumns} />

      </div>
    </DashboardShell>
  );
}
