import {Await, Link} from 'react-router';
import {Suspense, useId, useState, useEffect} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {DarkHeader} from './DarkHeader';
import {DarkFooter} from './DarkFooter';
import {DarkCartMain} from './DarkCartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';

interface DarkPageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function DarkPageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}: DarkPageLayoutProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <Aside.Provider>
      <DarkCartAside cart={cart} />
      <DarkSearchAside />
      <DarkMobileMenuAside
        header={header}
        publicStoreDomain={publicStoreDomain}
      />

      <div className="relative min-h-screen bg-black overflow-hidden">
        {/* Animated Background Grid */}
        <div className="fixed inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black"></div>
        </div>

        {/* Gradient Overlays */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Content */}
        <div className={`relative z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {header && (
            <DarkHeader
              header={header}
              cart={cart}
              isLoggedIn={isLoggedIn}
              publicStoreDomain={publicStoreDomain}
            />
          )}
          <main className="min-h-[60vh]">{children}</main>
          <DarkFooter
            footer={footer}
            header={header}
            publicStoreDomain={publicStoreDomain}
          />
        </div>
      </div>
    </Aside.Provider>
  );
}

function DarkCartAside({cart}: {cart: DarkPageLayoutProps['cart']}) {
  return (
    <Aside type="cart" heading="CART">
      <div className="h-full bg-black">
        {/* Glass overlay */}
        <div className="h-full bg-gray-900/90 backdrop-blur-sm">
          {/* Gradient accent */}
          <div className="h-1 bg-gradient-to-r from-cyan-500 to-pink-500"></div>

          <div className="p-6">
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-32">
                  <div className="text-cyan-400 animate-pulse">
                    Loading cart...
                  </div>
                </div>
              }
            >
              <Await resolve={cart}>
                {(cart) => {
                  return <DarkCartMain cart={cart} layout="aside" />;
                }}
              </Await>
            </Suspense>
          </div>
        </div>
      </div>
    </Aside>
  );
}

function DarkSearchAside() {
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading="SEARCH">
      <div className="h-full bg-black">
        {/* Glass overlay */}
        <div className="h-full bg-gray-900/90 backdrop-blur-sm">
          {/* Gradient accent */}
          <div className="h-1 bg-gradient-to-r from-cyan-500 to-pink-500"></div>

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
                        className="w-full px-4 py-3 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                      />
                      <button
                        onClick={goToSearch}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                      >
                        Search
                      </button>
                    </div>
                  </div>
                )}
              </SearchFormPredictive>

              <SearchResultsPredictive>
                {({items, total, term, state, closeSearch}) => {
                  const {articles, collections, pages, products, queries} =
                    items;

                  if (state === 'loading' && term.current) {
                    return (
                      <div className="mt-8 text-center">
                        <div className="text-cyan-400 animate-pulse">
                          Searching...
                        </div>
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
                        <div className="p-4 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800">
                          <h3 className="text-cyan-400 font-bold mb-3">
                            Products
                          </h3>
                          <SearchResultsPredictive.Products
                            products={products}
                            closeSearch={closeSearch}
                            term={term}
                          />
                        </div>
                      )}

                      {collections.length > 0 && (
                        <div className="p-4 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800">
                          <h3 className="text-pink-400 font-bold mb-3">
                            Collections
                          </h3>
                          <SearchResultsPredictive.Collections
                            collections={collections}
                            closeSearch={closeSearch}
                            term={term}
                          />
                        </div>
                      )}

                      {pages.length > 0 && (
                        <div className="p-4 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800">
                          <h3 className="text-cyan-400 font-bold mb-3">
                            Pages
                          </h3>
                          <SearchResultsPredictive.Pages
                            pages={pages}
                            closeSearch={closeSearch}
                            term={term}
                          />
                        </div>
                      )}

                      {articles.length > 0 && (
                        <div className="p-4 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800">
                          <h3 className="text-pink-400 font-bold mb-3">
                            Articles
                          </h3>
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
                          className="block text-center py-3 px-6 bg-gray-900/50 border border-gray-800 rounded-lg text-cyan-400 hover:bg-gray-900/70 transition-all duration-300"
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

function DarkMobileMenuAside({
  header,
  publicStoreDomain,
}: {
  header: DarkPageLayoutProps['header'];
  publicStoreDomain: DarkPageLayoutProps['publicStoreDomain'];
}) {
  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="mobile" heading="MENU">
        <div className="h-full bg-black">
          {/* Glass overlay */}
          <div className="h-full bg-gray-900/90 backdrop-blur-sm">
            {/* Gradient accent */}
            <div className="h-1 bg-gradient-to-r from-cyan-500 to-pink-500"></div>

            <div className="p-6">
              <nav className="space-y-2">
                <DarkHeaderMenu
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

// Re-export DarkHeaderMenu from DarkHeader
import {DarkHeaderMenu} from './DarkHeader';
