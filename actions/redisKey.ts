import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv()

const setRedisKey = async (key: string, value: string) => {
    if (key && value) {
        await redis.set(key, value)
        // console.log('setRedisKey: ', value);
        return value;
    }
    return null;
};

const getRedisKey = async (key: string) => {
    if (key) {
      const value = await redis.get(key);
      // console.log('getRedisKey: ', value);
      return value;
    }
    return null;
  };

const setRedisArray = async (key: string, values: string[]): Promise<string[] | null> => {
  if (key && values.length > 0) {
    // Ensure the key does not already exist or delete it if it does
    const existingValue = await redis.exists(key);
    if (existingValue) {
        await redis.del(key);
    }
    await redis.lpush(key, ...values);
    return values;
  }
  return null;
};

const getRedisArray = async (key: string): Promise<string[] | null> => {
    if (key) {
        const values = await redis.lrange(key, 0, -1);
        return values;
    }
    return null;
};

export { setRedisKey, getRedisKey, setRedisArray, getRedisArray };