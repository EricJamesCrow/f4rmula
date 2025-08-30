import {Await, Link} from 'react-router';
import {Suspense, useId, useState, useEffect} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {VibrantHeader} from './VibrantHeader';
import {VibrantFooter} from './VibrantFooter';
import {CartMain} from '~/components/CartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';

interface VibrantPageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function VibrantPageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}: VibrantPageLayoutProps) {
  const [mousePosition, setMousePosition] = useState({x: 0, y: 0});

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <Aside.Provider>
      <VibrantCartAside cart={cart} />
      <VibrantSearchAside />
      <VibrantMobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />

      <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 overflow-hidden">
        {/* Dynamic Gradient Background */}
        <div
          className="fixed inset-0 opacity-30 transition-all duration-300"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)`,
          }}
        />

        {/* Animated Gradient Orbs */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div
            className="absolute top-1/2 -right-20 w-96 h-96 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full blur-3xl opacity-20 animate-pulse"
            style={{animationDelay: '0.7s'}}
          ></div>
          <div
            className="absolute -bottom-20 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse"
            style={{animationDelay: '1s'}}
          ></div>
        </div>

        {/* Noise Texture Overlay */}
        <div
          className="fixed inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {header && (
            <VibrantHeader
              header={header}
              cart={cart}
              isLoggedIn={isLoggedIn}
              publicStoreDomain={publicStoreDomain}
            />
          )}
          <main className="min-h-[60vh]">{children}</main>
          <VibrantFooter
            footer={footer}
            header={header}
            publicStoreDomain={publicStoreDomain}
          />
        </div>
      </div>
    </Aside.Provider>
  );
}

function VibrantCartAside({cart}: {cart: VibrantPageLayoutProps['cart']}) {
  return (
    <Aside type="cart" heading="CART">
      <div className="h-full bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        {/* Glass overlay */}
        <div className="h-full bg-slate-950/80 backdrop-blur-xl">
          {/* Gradient accent */}
          <div className="h-1 bg-gradient-to-r from-violet-600 via-orange-600 to-blue-600"></div>

          <div className="p-6">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-32">
                  <div className="text-violet-400 animate-pulse">Loading cart...</div>
                </div>
              }
            >
              <Await resolve={cart}>
                {(cart) => {
                  return <CartMain cart={cart} layout="aside" />;
                }}
              </Await>
            </Suspense>
          </div>
        </div>
      </div>
    </Aside>
  );
}

function VibrantSearchAside() {
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading="SEARCH">
      <div className="h-full bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        {/* Glass overlay */}
        <div className="h-full bg-slate-950/80 backdrop-blur-xl">
          {/* Gradient accent */}
          <div className="h-1 bg-gradient-to-r from-violet-600 via-orange-600 to-blue-600"></div>

          <div className="p-6">
            <div className="predictive-search">
              <SearchFormPredictive>
                {({fetchResults, goToSearch, inputRef}) => (
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        name="q"
                        onChange={fetchResults}
                        onFocus={fetchResults}
                        placeholder="Search products..."
                        ref={inputRef}
                        type="search"
                        list={queriesDatalistId}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-violet-500 focus:bg-white/15 transition-all duration-300"
                      />
                      <button
                        onClick={goToSearch}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-violet-600 to-orange-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300"
                      >
                        Search
                      </button>
                    </div>
                  </div>
                )}
              </SearchFormPredictive>

              <SearchResultsPredictive>
                {({items, total, term, state, closeSearch}) => {
                  const {articles, collections, pages, products, queries} = items;

                  if (state === 'loading' && term.current) {
                    return (
                      <div className="mt-8 text-center">
                        <div className="text-violet-400 animate-pulse">Searching...</div>
                      </div>
                    );
                  }

                  if (!total) {
                    return <SearchResultsPredictive.Empty term={term} />;
                  }

                  return (
                    <div className="mt-6 space-y-6">
                      <SearchResultsPredictive.Queries
                        queries={queries}
                        queriesDatalistId={queriesDatalistId}
                      />

                      {products.length > 0 && (
                        <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                          <h3 className="text-violet-400 font-bold mb-3">Products</h3>
                          <SearchResultsPredictive.Products
                            products={products}
                            closeSearch={closeSearch}
                            term={term}
                          />
                        </div>
                      )}

                      {collections.length > 0 && (
                        <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                          <h3 className="text-orange-400 font-bold mb-3">Collections</h3>
                          <SearchResultsPredictive.Collections
                            collections={collections}
                            closeSearch={closeSearch}
                            term={term}
                          />
                        </div>
                      )}

                      {pages.length > 0 && (
                        <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                          <h3 className="text-blue-400 font-bold mb-3">Pages</h3>
                          <SearchResultsPredictive.Pages
                            pages={pages}
                            closeSearch={closeSearch}
                            term={term}
                          />
                        </div>
                      )}

                      {articles.length > 0 && (
                        <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                          <h3 className="text-pink-400 font-bold mb-3">Articles</h3>
                          <SearchResultsPredictive.Articles
                            articles={articles}
                            closeSearch={closeSearch}
                            term={term}
                          />
                        </div>
                      )}

                      {term.current && total ? (
                        <Link
                          onClick={closeSearch}
                          to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                          className="block text-center py-3 px-6 bg-gradient-to-r from-violet-600/20 to-orange-600/20 border border-violet-500/30 rounded-xl text-violet-400 hover:from-violet-600/30 hover:to-orange-600/30 transition-all duration-300"
                        >
                          View all results for "{term.current}" →
                        </Link>
                      ) : null}
                    </div>
                  );
                }}
              </SearchResultsPredictive>
            </div>
          </div>
        </div>
      </div>
    </Aside>
  );
}

function VibrantMobileMenuAside({
  header,
  publicStoreDomain,
}: {
  header: VibrantPageLayoutProps['header'];
  publicStoreDomain: VibrantPageLayoutProps['publicStoreDomain'];
}) {
  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="mobile" heading="MENU">
        <div className="h-full bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
          {/* Glass overlay */}
          <div className="h-full bg-slate-950/80 backdrop-blur-xl">
            {/* Gradient accent */}
            <div className="h-1 bg-gradient-to-r from-violet-600 via-orange-600 to-blue-600"></div>

            <div className="p-6">
              <nav className="space-y-2">
                <VibrantHeaderMenu
                  menu={header.menu}
                  viewport="mobile"
                  primaryDomainUrl={header.shop.primaryDomain.url}
                  publicStoreDomain={publicStoreDomain}
                />
              </nav>
            </div>
          </div>
        </div>
      </Aside>
    )
  );
}

// Re-export VibrantHeaderMenu from VibrantHeader
import {VibrantHeaderMenu} from './VibrantHeader';
