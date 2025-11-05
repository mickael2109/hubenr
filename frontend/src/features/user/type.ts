import type { UserInterface } from "../../types/UserInterface";


export interface a_UserState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    users: UserInterface[];
    userSelected: UserInterface | null;
    userConnected: UserInterface | null;
}

