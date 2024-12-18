export {default as default} from "./TopBar"

export interface SystemNotification {
    id: number;
    sendTime: string;
    titlePlainText: string;
    contentHtml: string;
    checked: boolean;
    link?: string|null;
}
