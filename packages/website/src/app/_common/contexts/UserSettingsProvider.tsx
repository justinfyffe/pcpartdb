'use client';

import { UserSettings } from '@pcpartdb/shared';
import React, { createContext, useContext, useState } from 'react';

export interface UserSettingsContextState {
  userSettings: UserSettings;
  setUserSettings: (userSettings: UserSettings) => void;
}

export const UserSettingsContext = createContext<UserSettingsContextState>({
  userSettings: {},
  setUserSettings: null,
});

export function useUserSettings() {
  return useContext(UserSettingsContext);
}

export interface UserSettingsProviderProps {
  userSettings: UserSettings;
  children: React.ReactNode;
}

export function UserSettingsProvider(props: UserSettingsProviderProps) {
  const [userSettings, setUserSettings] = useState(props.userSettings);

  return (
    <UserSettingsContext.Provider value={{ userSettings, setUserSettings }}>
      {props.children}
    </UserSettingsContext.Provider>
  );
}
