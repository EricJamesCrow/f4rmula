import {Link} from 'react-router';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams, type RegularSearchReturn} from '~/lib/search';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type DarkSearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & {term: string}) => React.ReactNode;
};

export function DarkSearchResults({
  term,
  result,
  children,
}: Omit<DarkSearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

DarkSearchResults.Articles = DarkSearchResultsArticles;
DarkSearchResults.Pages = DarkSearchResultsPages;
DarkSearchResults.Products = DarkSearchResultsProducts;
DarkSearchResults.Empty = DarkSearchResultsEmpty;

function DarkSearchResultsArticles({
  term,
  articles,
}: PartialSearchResult<'articles'>) {
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">Articles</h2>
      <div className="grid gap-4">
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <Link
              key={article.id}
              prefetch="intent"
              to={articleUrl}
              className="block p-4 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg hover:border-cyan-500/50 transition-colors"
            >
              <h3 className="text-white hover:text-cyan-400 transition-colors">
                {article.title}
              </h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function DarkSearchResultsPages({term, pages}: PartialSearchResult<'pages'>) {
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-pink-400 mb-4">Pages</h2>
      <div className="grid gap-4">
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <Link
              key={page.id}
              prefetch="intent"
              to={pageUrl}
              className="block p-4 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg hover:border-pink-500/50 transition-colors"
            >
              <h3 className="text-white hover:text-pink-400 transition-colors">
                {page.title}
              </h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function DarkSearchResultsProducts({
  term,
  products,
}: PartialSearchResult<'products'>) {
  if (!products?.nodes.length) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent mb-4">
        Products
      </h2>
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => {
          const ItemsMarkup = nodes.map((product) => {
            const productUrl = urlWithTrackingParams({
              baseUrl: `/products/${product.handle}`,
              trackingParams: product.trackingParameters,
              term,
            });

            const price = product?.selectedOrFirstAvailableVariant?.price;
            const image = product?.selectedOrFirstAvailableVariant?.image;

            return (
              <Link
                key={product.id}
                prefetch="intent"
                to={productUrl}
                className="group flex gap-4 p-4 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg hover:border-cyan-500/50 transition-all"
              >
                {image && (
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Image
                      data={image}
                      alt={product.title}
                      width={80}
                      height={80}
                      className="relative rounded-lg object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-white group-hover:text-cyan-400 transition-colors font-semibold">
                    {product.title}
                  </p>
                  {price && (
                    <div className="text-gray-400 mt-1">
                      <Money data={price} />
                    </div>
                  )}
                </div>
              </Link>
            );
          });

          return (
            <div>
              <div className="mb-4">
                <PreviousLink className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  {isLoading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    <span>← Load previous</span>
                  )}
                </PreviousLink>
              </div>

              <div className="grid gap-4">
                {ItemsMarkup}
              </div>

              <div className="mt-4">
                <NextLink className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  {isLoading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    <span>Load more →</span>
                  )}
                </NextLink>
              </div>
            </div>
          );
        }}
      </Pagination>
    </div>
  );
}

function DarkSearchResultsEmpty() {
  return (
    <div className="text-center py-12">
      <div className="mb-4">
        <svg className="w-16 h-16 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <p className="text-gray-400">No results found. Try a different search.</p>
    </div>
  );
}
