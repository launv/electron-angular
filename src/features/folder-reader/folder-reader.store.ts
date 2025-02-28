import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { environment } from 'environments/environment';
import { filter, includes, slice, join } from 'lodash';

type FolderState = {
  folders: string[];

  isLoading: boolean;

  filter: { query: string; order: 'asc' | 'desc' };

  stack: string[];
};

const initialState: FolderState = {
  folders: [],

  isLoading: false,

  filter: { query: '', order: 'asc' },

  stack: [environment.dir],
};

export const FolderReaderStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed(({ stack, folders }) => ({
    dir: computed(() => join(stack(), '/')),

    foldersCount: computed(() => folders().length),

    fileredFolders: computed(() => filter(folders(), (f) => !includes(f, '.'))),
  })),

  withMethods((store) => ({
    updateQuery(query: string): void {
      patchState(store, (state) => ({ filter: { ...state.filter, query } }));
    },

    updateOrder(order: 'asc' | 'desc'): void {
      patchState(store, (state) => ({ filter: { ...state.filter, order } }));
    },

    setFolders(folders: string[]): void {
      patchState(store, { folders });
    },

    setStack(stack: string[]): void {
      patchState(store, { stack });
    },

    addStack(value: string): void {
      patchState(store, ({ stack }) => ({ stack: [...stack, value] }));
    },

    popStack(): void {
      patchState(store, ({ stack }) => {
        console.log(slice(stack));

        return { stack: slice(stack) };
      });
    },
  }))
);
