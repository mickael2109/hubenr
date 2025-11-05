import type { InstallationInterface } from "../../types/InstallationInterface";


export interface installationState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    installations: InstallationInterface[];
    installationSelected: InstallationInterface | null;
}

