console.log("EventBus initialized");
import { EventEmitter } from 'events';
const eventBus = new EventEmitter();
const CLEAR_FILTERS_EXCEPT = 'clear-filters-except';
export { eventBus, CLEAR_FILTERS_EXCEPT };