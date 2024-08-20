"use client"

import { getCopyTradingSetting } from "@/actions/copy-trading";
import { copyTradingSettingColumns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tab, TabList, TabPanel, Tabs } from "@/components/v2/tabs/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icons } from "@/components/shared/icons";
import { UpdateCopyTradingSheet } from "@/components/exchange/update-copytrading-sheet";
import { useCallback, useEffect, useState } from "react";
import { DeleteCopyTradingDialog } from "@/components/exchange/delete-copytrading-dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import Link from "next/link";
import PNLDisplay from "@/components/shared/common";

const TraderCard = ({ trader, onSuccess=() => {} }) => {
  const [showUpdateSheet, setShowUpdateSheet] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="mb-8 w-full">
      <CardHeader>
        <UpdateCopyTradingSheet
          open={showUpdateSheet}
          onOpenChange={setShowUpdateSheet}
          task={trader}
          onSuccess={onSuccess}
        />
        <DeleteCopyTradingDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          tasks={[trader]}
          showTrigger={false}
          onSuccess={onSuccess}
        />
        <div className="flex items-center justify-between">
          <Link href={`/analysis?bitgetTraderId=${encodeURIComponent(trader.traderId)}`} className="block" target="_blank">
          <div className="flex cursor-pointer items-center space-x-4">
            <Avatar>
              <AvatarImage src={trader.avatarUrl} alt={trader.traderName} />
              {/* <AvatarFallback>{trader.name.charAt(0)}</AvatarFallback> */}
            </Avatar>
            <div>
              <CardTitle>{trader.traderName}</CardTitle>
              <CardDescription className="mt-1 flex items-center">
                {/* <Icons.calendar className="mr-1 h-4 w-4" /> */}
                Started: {trader.createdAt.toLocaleString('zh-CN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })}
              </CardDescription>
            </div>
          </div>
          </Link>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setShowUpdateSheet(true)} variant="outline" size="sm" className="flex items-center">
              <Icons.settings className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline">Settings</span>
            </Button>
            <Button onClick={() => setShowDeleteDialog(true)} variant="destructive" size="sm" className="flex items-center">
              {/* <StopIcon className="mr-2 h-4 w-4" /> */}
              Stop Copying
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Realized PNL:</strong> <PNLDisplay pnl={trader.rpnl} /> USDT </p>
            <p><strong>Followed APIs:</strong>{' '}
              {trader.followedApis.map((api, index) => (
                  <span>{api.exchangeAccount.accountName}{' '}</span>
              ))}
            </p>
          </div>
          <div>
            <p><strong>Mode:</strong> {" "}
              {trader.fixedAmount && (
                <>Fixed: {trader.fixedAmount} USDT</>
              )}
              {trader.multiplierAmount && (
                <>Multiplier: {trader.multiplierAmount} X</>
              )}
            </p>
            <p><strong>Risk Level:</strong> {trader.riskLevel}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full"
        >
          {isExpanded ? (
            <>
              Collapse Details
              <Icons.chevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Expand Details
              <Icons.chevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
      {isExpanded && (
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-semibold">Current Positions</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Entry Price</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>PNL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* {trader.currentPositions.map((position, index) => (
                    <TableRow key={index}>
                      <TableCell>position.symbol</TableCell>
                      <TableCell>position.size</TableCell>
                      <TableCell>position.entryPrice</TableCell>
                      <TableCell>position.currentPrice</TableCell>
                      <TableCell>position.pnl</TableCell>
                    </TableRow>
                  ))} */}
                </TableBody>
              </Table>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">Historical Positions</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Entry Date</TableHead>
                    <TableHead>Exit Date</TableHead>
                    <TableHead>Entry Price</TableHead>
                    <TableHead>Exit Price</TableHead>
                    <TableHead>PNL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* {trader.historicalPositions.map((position, index) => (
                    <TableRow key={index}>
                      <TableCell>position.symbol</TableCell>
                      <TableCell>position.entryDate</TableCell>
                      <TableCell>position.exitDate</TableCell>
                      <TableCell>position.entryPrice</TableCell>
                      <TableCell>position.exitPrice</TableCell>
                      <TableCell>position.pnl</TableCell>
                    </TableRow>
                  ))} */}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

const EndedTraderCard = ({ trader, onSuccess  }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="mb-8 w-full">
      <CardHeader>
        <DeleteCopyTradingDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          tasks={[trader]}
          showTrigger={false}
          onSuccess={onSuccess}
        />
        <div className="flex items-center justify-between">
        <Link href={`/analysis?bitgetTraderId=${encodeURIComponent(trader.traderId)}`} className="block" target="_blank">
          <div className="flex cursor-pointer items-center space-x-4">
            <Avatar>
              <AvatarImage src={trader.avatarUrl} alt={trader.traderName} />
              {/* <AvatarFallback>{trader.traderName.charAt(0)}</AvatarFallback> */}
            </Avatar>
            <div>
              <CardTitle>{trader.traderName}</CardTitle>
              <CardDescription className="mt-1 flex items-center">
                {/* <CalendarIcon className="mr-1 h-4 w-4" /> */}
                {trader.createdAt.toLocaleString('zh-CN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })}
                {" - "}
                {trader.endDate.toLocaleString('zh-CN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })}
              </CardDescription>
            </div>
          </div>
          </Link>
          <div className="flex items-center space-x-2">
            {/* <Button onClick={() => setShowDeleteDialog(true)} variant="destructive" size="sm" className="flex items-center">
              <Icons.trash2 className="mr-2 size-4" />
              Delete
            </Button> */}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Realized PNL:</strong> <PNLDisplay pnl={trader.rpnl} /> USDT </p>
            <p><strong>Followed APIs:</strong>{' '}
              {trader.followedApis.map((api, index) => (
                  <span>{api.exchangeAccount.accountName}{' '}</span>
              ))}
            </p>
          </div>
          <div>
            <p><strong>Mode:</strong> {" "}
              {trader.fixedAmount && (
                <>Fixed: {trader.fixedAmount} USDT</>
              )}
              {trader.multiplierAmount && (
                <>Multiplier: {trader.multiplierAmount} X</>
              )}
            </p>
            {/* <p><strong>Risk Level:</strong> {trader.riskLevel}</p> */}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full"
        >
          {isExpanded ? (
            <>
              Collapse Details
              <Icons.chevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Expand Details
              <Icons.chevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
      {isExpanded && (
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-semibold">Position History</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Entry Date</TableHead>
                    <TableHead>Exit Date</TableHead>
                    <TableHead>Entry Price</TableHead>
                    <TableHead>Exit Price</TableHead>
                    <TableHead>PNL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* {trader.historicalPositions.map((position, index) => (
                    <TableRow key={index}>
                      <TableCell>position.symbol</TableCell>
                      <TableCell>position.entryDate</TableCell>
                      <TableCell>position.exitDate</TableCell>
                      <TableCell>position.entryPrice</TableCell>
                      <TableCell>position.exitPrice</TableCell>
                      <TableCell>position.pnl</TableCell>
                    </TableRow>
                  ))} */}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default function ManageCopyTradingPage() {
  // const user = await getCurrentUser();
  // if (!user) {
  //   redirect("/login");
  // }
  const {data:session, status} = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEndedLoading, setIsEndedLoading] = useState<boolean>(true);
  const [data, setData] = useState<any[]>([]);
  const [endedData, setEndedData] = useState<any[]>([]);

  // if (!session || !session.user) {
  //   redirect("/login");
  // }

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    if (status !== "authenticated") return;
    // if (status === "loading") return;
    // if (!session || !session.user) {
    //   router.push('/login');
    //   return;
    // }
    try {
      const data = await getCopyTradingSetting(session.user.id!);
      setData(data);
      // console.log("result:", data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    document.title = "Manage Copy Trading – MoonCrypto";
    fetchData();
  }, [fetchData]);

  const getEndedData = async () => {
    if (!isEndedLoading) {
      return
    }
    // setIsEndedLoading(true);
    try {
      const data = await getCopyTradingSetting(session?.user?.id!, "ended");
      // console.log("ended data:", data)
      setEndedData(data);
    } catch (error) {
      console.error('Error fetching ended data:', error);
    } finally {
      setIsEndedLoading(false);
    }
  };

  // const data = await getCopyTradingSetting(user?.id!);
  // useEffect(() => {
  //   if (status !== "authenticated") return;
  //   // if (status === "loading") return;
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
    <>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        <Link href="/copy-trading" className="mb-2 flex cursor-pointer items-center">
          <Icons.arrowLeft className="mr-1 h-4 w-4" />
          <span>Copy Trading</span>
        </Link>
      </div >
      {/* <DashboardHeader
        heading="Manage Copy Trading"
        text=""
      /> */}
      <div className='overflow-x-auto'>
        <Tabs defaultValue="ongoing" onValueChange={getEndedData}>
          <TabList>
            <Tab value="ongoing">Ongoing</Tab>
            <Tab value="closed">Ended</Tab>
            {/* <Tab value="identities">
              <div className="flex items-center">
                <p>Machine Identities</p>
              </div>
            </Tab> */}
          </TabList>
          <TabPanel value="ongoing">
            {/* {isLoading ? (
              <div>
                <TableSkeleton />
              </div>
            ) : (
              <DataTable data={data} columns={copyTradingSettingColumns} />
            )} */}

              {isLoading ? (
                <div className="flex h-40 items-center justify-center">
                  <Icons.spinner className="size-8 animate-spin text-gray-500" />
                </div>
              ) : (
                <>
                  {/* {data && data.length > 0 ? (
                    <DataTable data={data} columns={copyTradingSettingColumns} />
                  ) : (
                    <div className="mt-2 rounded-lg border border-gray-300 dark:border-gray-700">
                      <div className="flex h-80 flex-col items-center justify-center space-y-4 p-8 text-center">
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {"You haven't followed any traders yet"}
                          </h3>
                          <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
                            Follow a trader to start copy trading.
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
                  )} */}

                  {data && data.length > 0 ? (
                    <div className="space-y-4">
                      {data.map((trader, index) => (
                        <TraderCard key={index} trader={trader} onSuccess={fetchData} />
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium">
                            {"You haven't followed any traders yet"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Follow a trader to start copy trading.
                          </p>
                        </div>
                        <div>
                          <Link href="/copy-trading">
                            <Button>
                              Find Best Traders
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}

          </TabPanel>
          <TabPanel value="closed">
            {isEndedLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Icons.spinner className="size-8 animate-spin text-gray-500" />
              </div>
              ) : (
              <>
                {endedData && endedData.length > 0 ? (
                  <div className="space-y-4">
                    {endedData.map((trader, index) => (
                      <EndedTraderCard key={index} trader={trader} onSuccess={fetchData} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        No records.
                      </p>
                      <div>
                        <Link href="/copy-trading">
                          <Button>
                            Find Best Traders
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabPanel>
          {/* <TabPanel value="roles">
            Roles
          </TabPanel> */}
        </Tabs>

      </div>
      
    </>
  );
}


  