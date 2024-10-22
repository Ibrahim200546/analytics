import {User as NextUser} from "next-auth";

export interface User extends NextUser {
    exp: number;
    iat: number;
    token: string;
    roles: string[];
};
