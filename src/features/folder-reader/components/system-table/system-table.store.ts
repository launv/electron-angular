import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

type SystemTableState = {
  systems: string[];

  selectedSystem: string;

  symptom: string[];

  isLoading: boolean;

  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: SystemTableState = {
  systems: [],

  selectedSystem: '',

  symptom: [],

  isLoading: false,

  filter: { query: '', order: 'asc' },
};

export const SystemTableStore = signalStore(
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

    setSelectedSystem(selectedSystem: string): void {
      patchState(store, { selectedSystem });
    },

    setSymptom(symptom: string[]): void {
      patchState(store, { symptom });
    },

    reset() {
      patchState(store, initialState);
    },
  }))
);
