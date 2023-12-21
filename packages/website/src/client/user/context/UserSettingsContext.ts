import { UserSettings } from '@pcpartdb/shared';
import { createContext, useContext } from 'react';

export interface UserSettingsContextState {
  userSettings: UserSettings;
  updateUserSettings: (settings: UserSettings) => void;
}

export const UserSettingsContext = createContext<UserSettingsContextState>({
  userSettings: {},
  updateUserSettings: () => {},
});

export const useUserSettings = () => {
  return useContext(UserSettingsContext);
};
