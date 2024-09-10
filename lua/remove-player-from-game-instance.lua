-- Remove entry from a field that holds an array
local key = KEYS[1]    -- Redis key for the hash
local field = ARGV[1]  -- Hash field that holds the array
local entryToRemove = ARGV[2] -- The entry to remove

-- Get the current array from the hash field
local array = redis.call('HGET', key, field)
local decodedArray

-- If the array is not null, decode it (assuming it's a JSON string)
if array then
    decodedArray = cjson.decode(array)
else
    decodedArray = {}
end

-- Iterate over the array to find and remove the entry
for i, v in ipairs(decodedArray) do
    if v == entryToRemove then
        table.remove(decodedArray, i)
        break
    end
end

-- Save the updated array (encode it back to JSON)
local updatedArray = cjson.encode(decodedArray)
redis.call('HSET', key, field, updatedArray)

return updatedArray