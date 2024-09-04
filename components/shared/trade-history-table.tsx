import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Icons } from './icons';
import PNLDisplay from './common';

type TradeHistoryData = {
  openTime: string;
  exchangeAccount: {
    accountName: string;
    exchangeName: string;
  };
  symbol: string;
  side: 'long' | 'short';
  size: string;
  entryPrice: string;
  realizedPnl: number | string;
  error?: string;
};

type TradeHistoryTableProps = {
  // tradeHistoryData?: TradeHistoryData[];
  tradeHistoryData?: any[] | undefined;
};

function TradeHistoryTable({ tradeHistoryData }: TradeHistoryTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>API</TableHead>
          <TableHead>Symbol</TableHead>
          <TableHead>Side</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Realized PNL</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tradeHistoryData === undefined ? (
          <TableRow>
            <TableCell colSpan={7} className="h-40 text-center">
              <div className="flex h-full w-full items-center justify-center">
                <Icons.spinner className="size-8 animate-spin text-gray-500" />
              </div>
            </TableCell>
          </TableRow>
        ) : tradeHistoryData.length > 0 ? (
          <>
            {tradeHistoryData.map((trade, index) => (
              <TableRow
                key={index}
                className={trade.error ? 'bg-red-100 hover:bg-red-200 dark:bg-red-950/30 dark:hover:bg-red-950/40' : ''}
              >
                <TableCell>{format(new Date(trade.openTime), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
                <TableCell>
                  <div className="max-w-xs truncate">
                    {trade.exchangeAccount.accountName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {trade.exchangeAccount.exchangeName}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs truncate">{trade.symbol}</div>
                </TableCell>

                {trade.error ? (
                  <TableCell colSpan={4} className="p-2 text-red-600 dark:text-red-400">
                    <div className="flex items-center">
                      <Link href="/docs/copy-trading/error-solutions" target="_blank" className="flex items-center">
                        <Icons.circleHelp className="mr-2 size-5 flex-shrink-0 cursor-pointer" />
                        <span>Error: {trade.error}</span>
                      </Link>
                    </div>
                  </TableCell>
                ) : (
                  <>
                    <TableCell>
                      <div
                        className={`capitalize ${
                          trade.side === 'long' ? 'text-green-500' : trade.side==='short'?'text-red-500':''
                        }`}
                      >
                        {trade.side==='long'?'Buy/':trade.side==='short'?'Sell/':''}{trade.side}
                      </div>
                    </TableCell>
                    <TableCell>{trade.size.toString().substring(0, 9)} {trade.symbol.slice(0, -4)}</TableCell>
                    <TableCell>{trade.entryPrice.toString().substring(0, 9)}</TableCell>
                    <TableCell>
                      <PNLDisplay pnl={trade.realizedPnl} showUSDT />
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </>
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="h-40 text-center">
              <div className="flex h-full w-full items-center justify-center">
                <p className="text-sm text-muted-foreground">No records found.</p>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default TradeHistoryTable;



{/* <Table>
<TableHeader>
  <TableRow>
    <TableHead>Time</TableHead>
    <TableHead>API</TableHead>
    <TableHead>Symbol</TableHead>
    <TableHead>Side</TableHead>
    <TableHead>Size</TableHead>
    <TableHead>Price</TableHead>
    <TableHead>Realized PNL</TableHead>
  </TableRow>
</TableHeader>
<TableBody>
  {tradeHistoryData === undefined ? (
    <TableRow>
      <TableCell colSpan={7} className="h-40 text-center">
        <div className="flex h-full w-full items-center justify-center">
          <Icons.spinner className="size-8 animate-spin text-gray-500" />
        </div>
      </TableCell>
    </TableRow>
  ) : tradeHistoryData.length > 0 ? (
    <>
      {tradeHistoryData.map((trade, index) => (
        <TableRow key={index} className={trade.error ? 'bg-red-100 hover:bg-red-200 dark:bg-red-950/30 dark:hover:bg-red-950/40' : ''}>
          <TableCell>{format(new Date(trade.openTime), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
          <TableCell>
            <div className="max-w-xs truncate">
              {trade.exchangeAccount.accountName}
            </div>
            <div className="text-xs text-gray-500">
              {trade.exchangeAccount.exchangeName}
            </div>
          </TableCell>
          <TableCell>
            <div className="max-w-xs truncate">
              {trade.symbol}
            </div>
          </TableCell>

          {trade.error ? (
            <TableCell colSpan={4} className="p-2 text-red-600 dark:text-red-400">
              <div className="flex items-center">
                <Link href={"/docs/copy-trading/error-solutions"} target="_blank" className="flex items-center">
                  <Icons.circleHelp className="mr-2 size-5 flex-shrink-0 cursor-pointer" />
                  <span>Error: {trade.error}</span>
                </Link>
              </div>
            </TableCell>
          ) : (
            <>
            <TableCell>
              <div className={`capitalize ${
                trade.side === 'long' ? 'text-green-500' : 'text-red-500'
              }`}>
                {trade.side}
              </div>
            </TableCell>
            <TableCell>{trade.size}</TableCell>
            <TableCell>
              {trade.entryPrice}
            </TableCell>
            <TableCell>
              <PNLDisplay pnl={trade.realizedPnl} showUSDT />
            </TableCell>
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
</Table> */}