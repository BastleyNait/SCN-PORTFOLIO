import { createContext, useContext } from 'react';

/** Lives apart from the provider component so Fast Refresh stays reliable:
 *  a module that exports both a component and a hook loses its refresh
 *  boundary and forces a full reload on every edit. */
export const AppContext = createContext(null);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used inside an AppProvider');
  }
  return context;
}
