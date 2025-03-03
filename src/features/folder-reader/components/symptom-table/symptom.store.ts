import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Product } from '../../../../../shared/interfaces/product.interface';

type SymptomState = {
  products: Product[];
};

const initialState: SymptomState = {
  products: [],
};

export const SymptomStore = signalStore(
  withState(initialState),

  withMethods((store) => ({
    setProducts(products: Product[]): void {
      patchState(store, { products });
    },
  }))
);
