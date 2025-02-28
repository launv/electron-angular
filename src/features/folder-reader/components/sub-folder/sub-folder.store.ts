import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

type SubFolderState = {
  systems: string[];

  symptom: string[];

  isLoading: boolean;

  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: SubFolderState = {
  systems: [],

  symptom: [],

  isLoading: false,

  filter: { query: '', order: 'asc' },
};

export const SubFolderStore = signalStore(
  withState(initialState),

  withMethods((store) => ({
    updateQuery(query: string): void {
      patchState(store, (state) => ({ filter: { ...state.filter, query } }));
    },

    updateOrder(order: 'asc' | 'desc'): void {
      patchState(store, (state) => ({ filter: { ...state.filter, order } }));
    },

    setSystems(systems: string[]): void {
      patchState(store, { systems });
    },

    setSymptom(symptom: string[]): void {
      patchState(store, { symptom });
    },
  }))
);
