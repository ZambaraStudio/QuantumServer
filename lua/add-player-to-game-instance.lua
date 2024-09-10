-- Add entry to a field that holds an array
local key = KEYS[1]    -- Redis key for the hash
local field = ARGV[1]   -- Hash field that holds the array
local newEntry = ARGV[2] -- The entry to add

-- Get the current array from the hash field
local array = redis.call('HGET', key, field)
local decodedArray

-- If the array is not null, decode it (assuming it's a JSON string)
if array then
    decodedArray = cjson.decode(array)
else
    decodedArray = {}
end

-- Add the new entry to the array
table.insert(decodedArray, newEntry)

-- Save the updated array (encode it back to JSON)
local updatedArray = cjson.encode(decodedArray)
redis.call('HSET', key, field, updatedArray)

return updatedArray