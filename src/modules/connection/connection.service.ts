import { Injectable } from '@nestjs/common';
import {
  FromGSEventMessageMappingType,
  ToGSEventMessageMappingType,
} from 'src/common/message/game-server.message';
import {
  FromPlayerEventMessageMappingType,
  ToPlayerEventMessageMappingType,
} from 'src/common/message/player.message';
import { EventSystem } from 'src/lib/event-system';

@Injectable()
export class ConnectionService {
  public readonly fromPlayerEvents: EventSystem<ToPlayerEventMessageMappingType>;
  public readonly toPlayerEvents: EventSystem<FromPlayerEventMessageMappingType>;
  public readonly toGSEvents: EventSystem<ToGSEventMessageMappingType>;
  public readonly fromGSEvents: EventSystem<FromGSEventMessageMappingType>;
  constructor() {
    this.fromPlayerEvents = new EventSystem<ToPlayerEventMessageMappingType>();
    this.toPlayerEvents = new EventSystem<FromPlayerEventMessageMappingType>();
    this.toGSEvents = new EventSystem<ToGSEventMessageMappingType>();
    this.fromGSEvents = new EventSystem<FromGSEventMessageMappingType>();
  }
}
