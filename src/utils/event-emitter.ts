import type { Handler } from '@/types/base';
import { asArray } from './utils';

export const createEventEmitter = <MessageMap extends object>() => {
    const handlers = new Map<keyof MessageMap, Set<Handler<MessageMap>>>();
    const allEventsHandler = new Set<(event: keyof MessageMap, payload: MessageMap[keyof MessageMap]) => void>();

    /** Публикует событие */
    const emit = <T extends keyof MessageMap>(eventName: T, payload: MessageMap[T]) => {
        getHandlers(eventName).forEach(handle => handle(payload));
        allEventsHandler.forEach(handle => handle(eventName, payload));
    };

    /**
     * Добавляет обработчик события
     */
    const on = <T extends keyof MessageMap>(eventName: T | T[], handler: Handler<MessageMap, T>) => {
        asArray(eventName).forEach(evt => {
            if (!handlers.has(evt)) {
                handlers.set(evt, new Set());
            }

            handlers.get(evt)?.add(handler as Handler<MessageMap, keyof MessageMap>);
        });
    };

    /**
     * Добавляет обработчик события
     */
    const onAll = (handler: (event: keyof MessageMap, payload: MessageMap[keyof MessageMap]) => void) => {
        allEventsHandler.add(handler); 
    };

    const getHandlers = (eventName: keyof MessageMap): Set<Handler<MessageMap>> => {
        return handlers.get(eventName) || new Set();
    };

    return { on, emit, onAll };
};
