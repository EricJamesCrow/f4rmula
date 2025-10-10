export type iGeneralSlice = {
    cartOpen: boolean;
    setCartOpen: (cartOpen: boolean) => void;
    searchOpen: boolean;
    setSearchOpen: (searchOpen: boolean) => void;
    mobileOpen: boolean;
    setMobileOpen: (mobileOpen: boolean) => void;
};
// no default export; use named type import