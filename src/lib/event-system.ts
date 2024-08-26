// TODO: move as a separate npm package since this is used in game-server too
type VoidListener = () => void;
type MessageListener<T> = (message: T) => void;

type Listener<T> = T extends void ? VoidListener : MessageListener<T>;

interface EventMap {
  [eventName: string]: Listener<any>[];
}

export class EventSystem<
  T extends { [K in keyof T]: T[K] extends void ? void : object },
> {
  private eventMap: EventMap;

  constructor() {
    this.eventMap = {};
  }

  on = <K extends keyof T>(eventName: K, listener: Listener<T[K]>): void => {
    if (!this.eventMap[eventName as string]) {
      this.eventMap[eventName as string] = [];
    }
    this.eventMap[eventName as string].push(listener);
  };

  emit = <K extends keyof T>(eventName: K, message: T[K]): void => {
    const listeners = this.eventMap[eventName as string];
    if (listeners) {
      listeners.forEach((listener) => {
        if (message === undefined) {
          (listener as VoidListener)();
        } else {
          (listener as MessageListener<T[K]>)(message);
        }
      });
    }
  };

  off = <K extends keyof T>(
    eventName: K,
    listenerToRemove: Listener<T[K]>,
  ): void => {
    const listeners = this.eventMap[eventName as string];
    if (listeners) {
      this.eventMap[eventName as string] = listeners.filter(
        (listener) => listener !== listenerToRemove,
      );
    }
  };
}
