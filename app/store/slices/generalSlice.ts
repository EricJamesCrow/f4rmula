import { StateCreator } from "zustand";

// types
import type { iGeneralSlice } from "../types/iGeneralSlice.ts";

const createGeneralSlice: StateCreator<iGeneralSlice> = (set) => ({
    cartOpen: false,
    setCartOpen: (cartOpen: boolean) => set({ cartOpen }),
    searchOpen: false,
    setSearchOpen: (searchOpen: boolean) => set({ searchOpen }),
    mobileOpen: false,
    setMobileOpen: (mobileOpen: boolean) => set({ mobileOpen }),
});

export default createGeneralSlice;