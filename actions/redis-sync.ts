"use server"

async function redisUpdate(settingIds?, exchangeAccountId?) {
  const response = await fetch(`https://tdb.mooncryp.to/api/redis/update`, { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ settingIds: settingIds, exchangeAccountId: exchangeAccountId }),
  });
  if (!response.ok) {
    throw new Error(`Redis update, failed to fetch data: ${response.statusText}`);
  }
  const responseData = await response.json(); // Assuming response is JSON
  console.log('Redis update, response:', responseData); // Print response data
  return responseData;
}

async function redisDelete(settingId) {
  console.log('delete:', settingId)
  const apiUrl = `https://tdb.mooncryp.to/api/redis/delete?settingId=${settingId}`;
  const response = await fetch(apiUrl, { method: 'GET' });
  if (!response.ok) {
    throw new Error(`Redis delete, failed to fetch data: ${response.statusText}`);
  }
  const responseData = await response.json(); // Assuming response is JSON
  console.log('Redis delete, response:', responseData); // Print response data
  return responseData;
}
// async function redisDelete(exchangeAccountId) {
//   const apiUrl = `https://tdb.mooncryp.to/api/redis/delete?exchangeAccountId=${exchangeAccountId}`;
//   const response = await fetch(apiUrl, { method: 'GET' });
//   if (!response.ok) {
//     throw new Error(`Redis delete, failed to fetch data: ${response.statusText}`);
//   }
//   const responseData = await response.json(); // Assuming response is JSON
//   console.log('Redis delete, response:', responseData); // Print response data
//   return responseData;
// }
