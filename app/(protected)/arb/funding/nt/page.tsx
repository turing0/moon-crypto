"use client"

import ccxt, { Exchange } from 'ccxt'
import { useEffect, useState } from 'react';

const exchangeIds = ['binance', 'bitget', 'bybit', 'okx']

export default function Home() {
  const [symbol, setSymbol] = useState<string>('BTC'); // State to store the input symbol
  const [exchanges, setExchanges] = useState<Record<string, Exchange>>({});
  const [fundingRates, setFundingRates] = useState<Record<string, any>>({});
  const [error, setError] = useState<string>();
  const [fetchDuration, setFetchDuration] = useState<number | null>(null); // State to store fetch duration

  useEffect(() => {
    console.log('starting exchanges...');
    const newExchanges: Record<string, Exchange> = exchangeIds.reduce((acc: any, exchangeId) => {
      acc[exchangeId] = new (ccxt.pro as any)[exchangeId];
      return acc;
    }, {});
    setExchanges(newExchanges);
  }, []);

  useEffect(() => {
    const fetchFundingRates = async () => {
      const startTime = performance.now(); // Start timer before fetching data

      // for (const exchangeId in exchanges) {
      //   try {
      //     const fundingRate = await exchanges[exchangeId].fetchFundingRate('OM/USDT:USDT');
      //     setFundingRates(fundingRates => ({ ...fundingRates, [exchangeId]: fundingRate }));
      //   } catch (e) {
      //     console.log(e)
      //     setError(exchangeId + ': ' + JSON.stringify(e) + '\n')
      //   }
      // };
      try {
        const fetchPromises = exchangeIds.map(async (exchangeId) => {
          try {
            const fundingRate = await exchanges[exchangeId].fetchFundingRate(`${symbol}/USDT:USDT`); // Use symbol from state
            return { exchangeId, fundingRate }; // Return funding rate with the exchangeId
          } catch (e) {
            console.log(e);
            setError((prevError) => prevError + `${exchangeId}: ${JSON.stringify(e)}\n`);
            return { exchangeId, fundingRate: null }; // Return null if there's an error
          }
        });

        const results = await Promise.all(fetchPromises); // Run all promises concurrently

        const newFundingRates: Record<string, any> = {};
        results.forEach(({ exchangeId, fundingRate }) => {
          if (fundingRate) {
            newFundingRates[exchangeId] = fundingRate;
          }
        });

        setFundingRates(newFundingRates);

      } catch (e) {
        setError('Error in fetching funding rates: ' + JSON.stringify(e));
      }

      const endTime = performance.now(); // End timer after fetching all rates
      const duration = endTime - startTime; // Calculate the time difference
      setFetchDuration(duration); // Update the state with the duration
    };
    fetchFundingRates();
  }, [exchanges, error, symbol]);

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24`}>
      <div className="z-10 w-full max-w-5xl justify-between font-mono text-sm lg:flex">
        <div className="flex-1">
          <h3>Enter Symbol:</h3>
          <input 
            type="text" 
            value={symbol} 
            onChange={(e) => setSymbol(e.target.value)} 
            placeholder="e.g. OM" 
            className="border p-2"
          />
        </div>
        {exchangeIds.map((exchangeId) => (
          <div key={exchangeId} className="flex-1">
            <h3>{exchangeId}</h3>
            <ul>
              <li>{`Funding Rate: ${(fundingRates[exchangeId]?.fundingRate * 100).toFixed(4)}`} %</li>
              <li>{`Next Funding: ${fundingRates[exchangeId]?.nextFunding}`}</li>
              <li>{`Interval: ${fundingRates[exchangeId]?.interval}`}</li>
            </ul>
          </div>
        ))}
      </div>

      <div>
        <h3>Last error:</h3>
        <p>{error ? error : "None"}</p>
      </div>
      {/* Display the total fetch time */}
      {fetchDuration !== null && (
        <div>
          <h3>Total Fetch Time:</h3>
          <p>{fetchDuration.toFixed(2)} ms</p>
        </div>
      )}
    </main>
  )
}
