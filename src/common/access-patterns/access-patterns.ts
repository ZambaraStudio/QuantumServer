export const getGameInstanceKey = (instanceId: string) => {
  return `${instanceId}:game_instance`;
};

export const getGameInstanceMessagesKey = (instanceId: string) => {
  return `${getGameInstanceKey(instanceId)}:messages`;
};

export const getGameInstanceMessagesKeyWithRedisGameInstanceKey = (
  redisGameInstanceKey: string,
) => {
  return `${redisGameInstanceKey}:messages`;
};

export const getPlayerHeartbeatKey = (playerId: string) => {
  return `${playerId}:heartbeat`;
};

export const getPlayerMessageChannelKey = (playerId: string) => {
  return `${playerId}:output_to_player`;
};

export const getUpdatedGameInstancesKey = () => {
  return `updated_game_instances`;
};
