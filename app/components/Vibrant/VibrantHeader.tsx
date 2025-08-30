import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';

interface VibrantHeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function VibrantHeader({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: VibrantHeaderProps) {
  const {shop, menu} = header;

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xl border-b border-white/10"></div>

      {/* Gradient Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-violet-600 via-orange-600 to-blue-600"></div>

      {/* Header Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <NavLink
            prefetch="intent"
            to="/"
            className="group relative"
          >
            <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-violet-400 via-orange-400 to-blue-400 bg-clip-text text-transparent hover:from-violet-500 hover:via-orange-500 hover:to-blue-500 transition-all duration-300">
              {shop.name}
            </span>
            <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-violet-500 to-orange-500 group-hover:w-full transition-all duration-300"></div>
          </NavLink>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            <VibrantHeaderMenu
              menu={menu}
              viewport="desktop"
              primaryDomainUrl={header.shop.primaryDomain.url}
              publicStoreDomain={publicStoreDomain}
            />
          </nav>

          {/* CTAs */}
          <VibrantHeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
        </div>
      </div>
    </header>
  );
}

export function VibrantHeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: VibrantHeaderProps['header']['menu'];
  primaryDomainUrl: VibrantHeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: VibrantHeaderProps['publicStoreDomain'];
}) {
  const {close} = useAside();

  return (
    <>
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          to="/"
          className={({isActive}) =>
            `block px-4 py-3 text-lg font-medium transition-all duration-300 ${
              isActive
                ? 'text-transparent bg-gradient-to-r from-violet-400 to-orange-400 bg-clip-text'
                : 'text-gray-300 hover:text-white'
            }`
          }
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;

        return (
          <NavLink
            key={item.id}
            end
            onClick={close}
            prefetch="intent"
            to={url}
            className={({isActive}) =>
              viewport === 'mobile'
                ? `block px-4 py-3 text-lg font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-transparent bg-gradient-to-r from-violet-400 to-orange-400 bg-clip-text'
                      : 'text-gray-300 hover:text-white'
                  }`
                : `relative text-gray-300 hover:text-white font-medium transition-all duration-300 group ${
                    isActive ? 'text-white' : ''
                  }`
            }
          >
            {item.title}
            {viewport === 'desktop' && (
              <span className={({isActive}: any) =>
                `absolute -bottom-2 left-0 w-0 h-[2px] bg-gradient-to-r from-violet-500 to-orange-500 group-hover:w-full transition-all duration-300 ${
                  isActive ? 'w-full' : ''
                }`
              }></span>
            )}
          </NavLink>
        );
      })}
    </>
  );
}

function VibrantHeaderCtas({
  isLoggedIn,
  cart,
}: Pick<VibrantHeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="flex items-center gap-4" role="navigation">
      <VibrantHeaderMenuMobileToggle />

      <NavLink
        prefetch="intent"
        to="/account"
        className={({isActive}) =>
          `hidden md:flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
            isActive
              ? 'bg-gradient-to-r from-violet-600/20 to-orange-600/20 text-violet-400 border border-violet-500/30'
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          }`
        }
      >
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>

      <VibrantSearchToggle />
      <VibrantCartToggle cart={cart} />
    </nav>
  );
}

function VibrantHeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="md:hidden p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
      onClick={() => open('mobile')}
    >
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}

function VibrantSearchToggle() {
  const {open} = useAside();
  return (
    <button
      className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-gradient-to-r hover:from-violet-600/20 hover:to-orange-600/20 transition-all duration-300 group"
      onClick={() => open('search')}
    >
      <svg className="w-5 h-5 text-gray-300 group-hover:text-violet-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>
  );
}

function VibrantCartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
        } as CartViewPayload);
      }}
      className="relative p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-gradient-to-r hover:from-violet-600/20 hover:to-orange-600/20 transition-all duration-300 group"
    >
      <svg className="w-5 h-5 text-gray-300 group-hover:text-violet-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {count !== null && count > 0 && (
        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}

function VibrantCartToggle({cart}: Pick<VibrantHeaderProps, 'cart'>) {
  return (
    <Suspense
      fallback={<VibrantCartBadge count={null} />}
    >
      <Await resolve={cart}>
        <CartCount />
      </Await>
    </Suspense>
  );
}

function CartCount() {
  const cart = useAsyncValue() as CartApiQueryFragment | null;
  const count = cart?.totalQuantity || 0;
  return <VibrantCartBadge count={count} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};
