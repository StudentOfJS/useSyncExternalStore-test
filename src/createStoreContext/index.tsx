import {
  useRef,
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  useEffect,
  type ReactNode
} from 'react';
  
  export default function createStoreContext<Store>(
    initialState: Store,
    persist?: 'sessionStorage' | 'localStorage'
  ) {
    function useStoreData(): {
      get: () => Store;
      set: (value: Partial<Store>) => void;
      subscribe: (callback: () => void) => () => void;
    } {
      const store = useRef(initialState);
  
      const get = useCallback(() => store.current, []);
  
      const subscribers = useRef(new Set<() => void>());
  
      const set = useCallback((value: Partial<Store>) => {
        store.current = { ...store.current, ...value };
        subscribers.current.forEach((callback) => callback());
        if (persist && window) {
          let keys = Object.keys(value);
          keys.forEach((key) => {
            let val = (value as Record<string, any>)[key];
            key && window[persist].setItem(key, JSON.stringify(val));
          });
        }
      }, []);
  
      const subscribe = useCallback((callback: () => void) => {
        subscribers.current.add(callback);
        return () => subscribers.current.delete(callback);
      }, []);
  
      useEffect(() => {
        if (initialState && persist) {
          Object.keys(initialState).forEach((key) => {
            let dataString = (window && window[persist].getItem(key)) ?? '';
            try {
              let value = dataString ? JSON.parse(dataString) : undefined;
              value && set({ [key]: value } as Partial<Store>);
            } catch (_) {
              return undefined;
            }
          });
        }
      }, [initialState, persist]);
  
      return {
        get,
        set,
        subscribe,
      };
    }
  
    type UseStoreDataReturnType = ReturnType<typeof useStoreData>;
  
    const StoreContext = createContext<UseStoreDataReturnType | null>(null);
  
    function Provider({ children }: { children: ReactNode }) {
      return (
        <StoreContext.Provider value={useStoreData()}>
          {children}
        </StoreContext.Provider>
      );
    }
  
    function useStore<SelectorOutput>(
      selector: (store: Store) => SelectorOutput
    ): [SelectorOutput, (value: Partial<Store>) => void] {
      const store = useContext(StoreContext);
      if (!store) {
        throw new Error('Store not found');
      }
  
      const state = useSyncExternalStore(
        store.subscribe,
        () => selector(store.get()),
        () => selector(initialState)
      );
  
      return [state, store.set];
    }
  
    return {
      Provider,
      useStore,
    };
  }
  
  export const removeStoreData = (
    storeKeys: Array<string>,
    storeType: 'localStorage' | 'sessionStorage' = 'sessionStorage'
  ) => {
    if (window) {
      storeKeys.forEach((storeKey) => {
        window[storeType].removeItem(storeKey);
      });
    }
  };
  