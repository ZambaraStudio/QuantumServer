import { RedisClientType } from 'redis';
import { getGameInstanceKey } from 'src/common/access-patterns/access-patterns';
import { PlayerData } from 'src/modules/player-gateway/types/player.types';

const luaScript = `
-- Add entry to a field that holds an array
local key = KEYS[1]    -- Redis key for the hash
local field = ARGV[1]   -- Hash field that holds the array
local newEntryJson = ARGV[2] -- The new entry to add (as a JSON string)

-- Decode the new entry
local newEntry = cjson.decode(newEntryJson)
local newEntryId = newEntry.id

-- Get the current array from the hash field
local array = redis.call('HGET', key, field)
local decodedArray

-- If the array is not null, decode it (assuming it's a JSON string)
if array then
    decodedArray = cjson.decode(array)
else
    decodedArray = {}
end

-- Check if an entry with the same id already exists
for i, entry in ipairs(decodedArray) do
    if entry.id == newEntryId then
        -- Entry with the same id already exists, return the current array without changes
        return cjson.encode(decodedArray)
    end
end

-- If no entry with the same id was found, add the new entry to the array
table.insert(decodedArray, newEntry)

-- Save the updated array (encode it back to JSON)
local updatedArray = cjson.encode(decodedArray)
redis.call('HSET', key, field, updatedArray)

-- Return the updated array
return updatedArray
`;

export const addPlayerToGameInstance = async (
  redisClient: RedisClientType,
  playerData: PlayerData,
  gameInstanceId: string,
) => {
  await redisClient.eval(luaScript, {
    keys: [getGameInstanceKey(gameInstanceId)],
    arguments: ['players', JSON.stringify(playerData)],
  });
};
