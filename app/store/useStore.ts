import { create } from 'zustand';

// slices
import createGeneralSlice from './slices/generalSlice';

// typees
import { iGeneralSlice } from './types/iGeneralSlice';

type StoreState = iGeneralSlice;

const useStore = create<StoreState>()((...a) => ({
    ...createGeneralSlice(...a),
}));

export default useStore;