"use client"

import { getActiveCopyTradingPositions, getCopyTradingPositionHistory, getCopyTradingSetting } from "@/actions/copy-trading";
import { copyTradingSettingColumns } from "@/components/table/columns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tab, TabList, TabPanel, Tabs } from "@/components/v2/tabs/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icons } from "@/components/shared/icons";
import { UpdateCopyTradingSheet } from "@/components/exchange/update-copytrading-sheet";
import { useCallback, useEffect, useState } from "react";
import { DeleteCopyTradingDialog } from "@/components/exchange/delete-copytrading-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import Link from "next/link";
import PNLDisplay from "@/components/shared/common";
import { toast } from "sonner";
import { format } from "date-fns";
import TradeHistoryTable from "@/components/shared/trade-history-table";

const TraderCard = ({ ctSetting, onSuccess=() => {} }) => {
  const [showUpdateSheet, setShowUpdateSheet] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false);
  // const [isActiveLoading, setIsActiveLoading] = useState(true);
  const [activePositionData, setActivePositionData] = useState<any[] | undefined>(undefined);
  const [tradeHistoryData, setTradeHistoryData] = useState<any[] | undefined>(undefined);
  
  const getActivePostions = async () => {
    if (activePositionData) {
      return
    }
    try {
      const data = await getActiveCopyTradingPositions(ctSetting.id);
      setActivePositionData(data);
      console.log("getActiveCopyTradingPositions:", data)
    } catch (error) {
      console.error('Error getActivePostions:', error);
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
    } 
    // finally {
    //   setIsActiveLoading(false);
    // }
  };
  useEffect(() => {
    if (!isExpanded || activePositionData) {
      return
    }
    getActivePostions();
  }, [isExpanded]);
  const getTradeHistory = async () => {
    if (tradeHistoryData) {
      return
    }
    try {
      // const data = await getCopyTradingPositionHistory(ctSetting.id);
      const data = await getActiveCopyTradingPositions(ctSetting.id);
      setTradeHistoryData(data);
      console.log("getCopyTradingPositionHistory:", data)
    } catch (error) {
      console.error('Error getTradeHistory:', error);
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  return (
    <Card className="mb-8 w-full">
      <CardHeader>
        <UpdateCopyTradingSheet
          open={showUpdateSheet}
          onOpenChange={setShowUpdateSheet}
          task={ctSetting}
          onSuccess={onSuccess}
        />
        <DeleteCopyTradingDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          tasks={[ctSetting]}
          showTrigger={false}
          onSuccess={onSuccess}
        />
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <Link href={`/analysis?bitgetTraderId=${encodeURIComponent(ctSetting.traderId)}`} className="block" target="_blank">
            <div className="flex cursor-pointer items-center space-x-4">
              <Avatar>
                <AvatarImage src={ctSetting.avatarUrl} alt={ctSetting.traderName} />
                <AvatarFallback className="text-violet11 text-[25px]">
                  {ctSetting.traderName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{ctSetting.traderName}</CardTitle>
                <CardDescription className="mt-1 flex items-center">
                  {/* <Icons.calendar className="mr-1 h-4 w-4" /> */}
                  Started: {ctSetting.createdAt.toLocaleString('zh-CN', {
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
          <div className="flex w-full space-x-2 sm:w-auto">
            <Button onClick={() => setShowUpdateSheet(true)} variant="outline" size="sm" className="flex-1 sm:flex-initial">
              {/* <Icons.settings className="h-4 w-4 sm:hidden" />
              <span className="hidden sm:inline">Settings</span> */}
              Settings
            </Button>
            <Button onClick={() => setShowDeleteDialog(true)} variant="outline" size="sm" className="flex-1 sm:flex-initial">
              Stop Copying
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Realized PNL:</strong> <PNLDisplay pnl={ctSetting.rpnl} /> USDT </p>
            <p><strong>Followed APIs:</strong>{' '}
              {ctSetting.followedApis.map((api, index) => (
                  <span key={index}>{api.exchangeAccount.accountName}{' '}</span>
              ))}
            </p>
          </div>
          <div>
            <p><strong>Mode:</strong> {" "}
              {ctSetting.fixedAmount && (
                <>Fixed: {ctSetting.fixedAmount} USDT</>
              )}
              {ctSetting.multiplierAmount && (
                <>Multiplier: {ctSetting.multiplierAmount} X</>
              )}
            </p>
            <p><strong>Risk Level:</strong> {ctSetting.riskLevel}</p>
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
            <div className="flex items-center">
              Expand Details
              <Icons.chevronDown className="ml-2 h-4 w-4" />
            </div>
          )}
        </Button>
      </CardFooter>
      {isExpanded && (
        <CardContent>
          <div>
            <Tabs defaultValue="positions">
              <TabList>
                <Tab value="positions">Positions</Tab>
                <Tab value="histroy" onClick={getTradeHistory}>Trade History</Tab>
              </TabList>

              <TabPanel value="positions">
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>API Name</TableHead>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Entry Price</TableHead>
                        <TableHead>Mark Price</TableHead>
                        <TableHead>PNL</TableHead>
                        <TableHead>TP/SL</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activePositionData === undefined ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-40 text-center">
                            <div className="flex h-full w-full items-center justify-center">
                              <Icons.spinner className="size-8 animate-spin text-gray-500" />
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : activePositionData.length>0 ? (
                        <>
                          {activePositionData.map((position, index) => (
                            <TableRow key={index} className={position.error ? 'bg-red-100 hover:bg-red-200 dark:bg-red-950/30 dark:hover:bg-red-950/40' : ''}>
                              <TableCell>
                                <div className="max-w-xs truncate">
                                  {position.exchangeAccount.accountName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {position.exchangeAccount.exchangeName}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="max-w-xs truncate">
                                  {position.symbol}
                                </div>
                                {/* <div className={`text-xs capitalize ${textColor}`}> */}
                                <div className={`text-xs capitalize ${
                                  position.side === 'long' ? 'text-green-500' : 'text-red-500'
                                }`}>
                                  {position.side}
                                </div>
                              </TableCell>

                              {position.error ? (
                                <TableCell colSpan={5} className="p-2 text-red-600 dark:text-red-400">
                                  <div className="flex items-center">
                                    <Link href={"/docs/copy-trading/error-solutions"} target="_blank" className="flex items-center">
                                      <Icons.circleHelp className="mr-2 size-5 flex-shrink-0 cursor-pointer" />
                                      <span>Error: {position.error}</span>
                                    </Link>
                                  </div>
                                </TableCell>
                              ) : (
                                <>
                                  <TableCell>{position.size}</TableCell>
                                  <TableCell>
                                    {position.entryPrice}USDT
                                    <div className="text-xs text-gray-500">
                                      {format(new Date(position.openTime), 'yyyy-MM-dd HH:mm:ss')}
                                    </div>
                                  </TableCell>
                                  <TableCell>{position.currentPrice}</TableCell>
                                  <TableCell>{position.pnl}</TableCell>
                                  <TableCell></TableCell>
                                </>
                              )}
                              
                            </TableRow>
                          ))}
                        </>
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-40 text-center">
                            <div className="flex h-full w-full items-center justify-center">
                              <p className="text-sm text-muted-foreground">
                                No records found.
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabPanel>
              <TabPanel value="histroy">
                <div>
                  <TradeHistoryTable tradeHistoryData={tradeHistoryData} />
                </div>
              </TabPanel>
            </Tabs>

          </div>

          <div className="space-y-4">
            <div>
            </div>
            <div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

const EndedTraderCard = ({ ctSetting, onSuccess  }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false);
  const [tradeHistoryData, setTradeHistoryData] = useState<any[] | undefined>(undefined);

  const getTradeHistory = async () => {
    if (tradeHistoryData) {
      return
    }
    try {
      // const data = await getCopyTradingPositionHistory(ctSetting.id);
      const data = await getActiveCopyTradingPositions(ctSetting.id);
      setTradeHistoryData(data);
      console.log("getCopyTradingPositionHistory:", data)
    } catch (error) {
      console.error('Error getTradeHistory:', error);
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };
  useEffect(() => {
    if (!isExpanded || tradeHistoryData) {
      return
    }
    getTradeHistory();
  }, [isExpanded]);
  return (
    <Card className="mb-8 w-full">
      <CardHeader>
        <DeleteCopyTradingDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          tasks={[ctSetting]}
          showTrigger={false}
          onSuccess={onSuccess}
        />
        <div className="flex items-center justify-between">
        <Link href={`/analysis?bitgetTraderId=${encodeURIComponent(ctSetting.traderId)}`} className="block" target="_blank">
          <div className="flex cursor-pointer items-center space-x-4">
            <Avatar>
              <AvatarImage src={ctSetting.avatarUrl} alt={ctSetting.traderName} />
              <AvatarFallback className="text-violet11 text-[25px]">
                {ctSetting.traderName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{ctSetting.traderName}</CardTitle>
              <CardDescription className="mt-1 flex items-center">
                {/* <CalendarIcon className="mr-1 h-4 w-4" /> */}
                {ctSetting.createdAt.toLocaleString('zh-CN', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
                })}
                {" - "}
                {ctSetting.endDate.toLocaleString('zh-CN', {
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
            <p><strong>Realized PNL:</strong> <PNLDisplay pnl={ctSetting.rpnl} /> USDT </p>
            <p><strong>Followed APIs:</strong>{' '}
              {ctSetting.followedApis.map((api, index) => (
                  <span key={index}>{api.exchangeAccount.accountName}{' '}</span>
              ))}
            </p>
          </div>
          <div>
            <p><strong>Mode:</strong> {" "}
              {ctSetting.fixedAmount && (
                <>Fixed: {ctSetting.fixedAmount} USDT</>
              )}
              {ctSetting.multiplierAmount && (
                <>Multiplier: {ctSetting.multiplierAmount} X</>
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
              <h4 className="mb-2 font-semibold">Trade History</h4>
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
  const [data, setData] = useState<any[] | undefined>(undefined);
  const [endedData, setEndedData] = useState<any[] | undefined>(undefined);

  // if (!session || !session.user) {
  //   redirect("/login");
  // }

  const fetchData = useCallback(async () => {
    if (status !== "authenticated") return;
    // if (status === "loading") return;
    // if (!session || !session.user) {
    //   router.push('/login');
    //   return;
    // }
    try {
      const data = await getCopyTradingSetting(session.user.id!);
      setData(data);
      console.log("getCopyTradingSetting:", data);
    } catch (error) {
      console.error('Error getCopyTradingSetting:', error);
    } 
    // finally {
    //   setIsLoading(false);
    // }
  }, [status]);

  useEffect(() => {
    document.title = "Manage Copy Trading – MoonCrypto";
    fetchData();
  }, [fetchData]);

  const getEndedData = async () => {
    if (endedData) {
      return
    }
    try {
      const data = await getCopyTradingSetting(session?.user?.id!, "ended");
      // console.log("ended data:", data)
      setEndedData(data);
    } catch (error) {
      console.error('Error getEndedData:', error);
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
        <Link href="/copy-trading" className="mb-2 inline-flex cursor-pointer items-center">
          <Icons.arrowLeft className="mr-1 h-4 w-4" />
          <span>Copy Trading</span>
        </Link>
      </div >
      {/* <DashboardHeader
        heading="Manage Copy Trading"
        text=""
      /> */}
      <div className='overflow-x-auto'>
        <Tabs defaultValue="ongoing">
          <TabList>
            <Tab value="ongoing">Ongoing</Tab>
            <Tab value="closed" onClick={getEndedData}>Closed</Tab>
            {/* <Tab value="identities">
              <div className="flex items-center">
                <p>Machine Identities</p>
              </div>
            </Tab> */}
          </TabList>
          <TabPanel value="ongoing">
            {data === undefined ? (
              <div className="flex h-40 items-center justify-center">
                <Icons.spinner className="size-8 animate-spin text-gray-500" />
              </div>
            ) : data.length > 0 ? (
              <div>
                {data.map((ctSetting, index) => (
                  <TraderCard key={ctSetting.id} ctSetting={ctSetting} onSuccess={fetchData} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex h-80 flex-col items-center justify-center space-y-4 p-8 text-center">
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
          </TabPanel>
          <TabPanel value="closed">
            {endedData===undefined ? (
              <div className="flex h-40 items-center justify-center">
                <Icons.spinner className="size-8 animate-spin text-gray-500" />
              </div>
            ) : endedData.length > 0 ? (
              <div>
                {endedData.map((ctSetting, index) => (
                  <EndedTraderCard key={ctSetting.id} ctSetting={ctSetting} onSuccess={fetchData} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex h-80 flex-col items-center justify-center space-y-4 p-8 text-center">
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
          </TabPanel>
        </Tabs>
      </div>
    </>
  );
}


  