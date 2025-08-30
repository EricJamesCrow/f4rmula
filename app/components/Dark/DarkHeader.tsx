import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';

interface DarkHeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function DarkHeader({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: DarkHeaderProps) {
  const {shop, menu} = header;

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800"></div>

      {/* Gradient Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink
            prefetch="intent"
            to="/"
            end
            className={({isActive}) =>
              `text-xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity ${
                isActive ? 'opacity-100' : 'opacity-90'
              }`
            }
          >
            {shop.name}
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <DarkHeaderMenu
              menu={menu}
              viewport="desktop"
              primaryDomainUrl={header.shop.primaryDomain.url}
              publicStoreDomain={publicStoreDomain}
            />
          </nav>

          {/* CTAs */}
          <DarkHeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
        </div>
      </div>
    </header>
  );
}

export function DarkHeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: DarkHeaderProps['header']['menu'];
  primaryDomainUrl: DarkHeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: DarkHeaderProps['publicStoreDomain'];
}) {
  const {close} = useAside();
  const className = viewport === 'mobile' ? 'space-y-4' : 'flex items-center gap-8';

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          to="/"
          className={({isActive}) =>
            `block px-4 py-2 rounded-lg text-white transition-all duration-300 ${
              isActive
                ? 'bg-gradient-to-r from-cyan-500/20 to-pink-500/20 border border-cyan-500/30'
                : 'hover:bg-gray-800'
            }`
          }
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;

        return (
          <NavLink
            className={({isActive}) =>
              viewport === 'mobile'
                ? `block px-4 py-2 rounded-lg text-white transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-pink-500/20 border border-cyan-500/30'
                      : 'hover:bg-gray-800'
                  }`
                : `text-gray-400 hover:text-cyan-400 transition-colors duration-300 ${
                    isActive ? 'text-cyan-400' : ''
                  }`
            }
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function DarkHeaderCtas({
  isLoggedIn,
  cart,
}: Pick<DarkHeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="flex items-center gap-4" role="navigation">
      <DarkHeaderMenuMobileToggle />

      <NavLink
        prefetch="intent"
        to="/account"
        className={({isActive}) =>
          `hidden md:flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            isActive
              ? 'bg-gradient-to-r from-cyan-500/20 to-pink-500/20 text-cyan-400 border border-cyan-500/30'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`
        }
      >
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>

      <DarkSearchToggle />
      <DarkCartToggle cart={cart} />
    </nav>
  );
}

function DarkHeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="md:hidden p-2 rounded-lg bg-gray-900/80 backdrop-blur-sm hover:bg-gray-800 transition-all duration-300"
      onClick={() => open('mobile')}
    >
      <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}

function DarkSearchToggle() {
  const {open} = useAside();
  return (
    <button
      className="p-2 rounded-lg bg-gray-900/80 backdrop-blur-sm hover:bg-gray-800 transition-all duration-300 text-gray-400 hover:text-cyan-400"
      onClick={() => open('search')}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>
  );
}

function DarkCartBadge({count}: {count: number | null}) {
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
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      className="relative p-2 rounded-lg bg-gray-900/80 backdrop-blur-sm hover:bg-gray-800 transition-all duration-300 text-gray-400 hover:text-cyan-400"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {count !== null && count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-gradient-to-r from-cyan-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}

function DarkCartToggle({cart}: Pick<DarkHeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<DarkCartBadge count={null} />}>
      <Await resolve={cart}>
        <CartCount />
      </Await>
    </Suspense>
  );
}

function CartCount() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <DarkCartBadge count={cart?.totalQuantity ?? 0} />;
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
