export {default as default} from "./Calendar";

export interface CalendarEvent {
    type: string;
    date: Date;
    name: string;
}
