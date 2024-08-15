import { DashboardHeader } from "@/components/dashboard/header";
import { DataTable } from "@/components/table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Positions – MoonCrypto",
  description: "Check your positions.",
});

export default function PositionPage() {
  return (
    // <DashboardShell>
    <>
      <DashboardHeader
        heading="Positions"
        text="Current open positions 1 Unrealized P/L $160"
      />
      <div className=''>
      <Tabs defaultValue="live" className="space-y-4">
          <TabsList>
            <TabsTrigger value="live">Live</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="live" className="space-y-4">
            {/* <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60"> */}
            {/* <div>
              <form onSubmit={handleBitgetOrderSubmit}>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input name="bitgetTraderId" placeholder="Search Bitget TraderId" className="pl-8" />
                </div>
              </form>
            </div> */}
            {/* <DataTable data={bitgetTrader} columns={bitgetTraderColumns} userApi={userApiData!} /> */}
          </TabsContent>
          <TabsContent value="history" className="space-y-4">
            <div >
              <form>
                {/* <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input name="binanceTraderId" placeholder="Search Binance TraderId" className="pl-8" />
                </div> */}
              </form>
            </div>
            {/* <DataTable data={binanceOrder} columns={binanceOrderColumns} /> */}
          </TabsContent>
        </Tabs>

      </div>
    </>
  );
}
