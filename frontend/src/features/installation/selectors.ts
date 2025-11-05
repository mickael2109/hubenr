import type { RootState } from "../../app/store";



export const getAllInstallations = (state: RootState) => state.installation.installations;
export const getInstallationSelected = (state: RootState) => state.installation.installationSelected;