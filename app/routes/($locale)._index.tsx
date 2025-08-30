import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from 'react-router';
import {Suspense, useState, useEffect} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';
import ComingSoon from '~/components/ComingSoon/ComingSoon';
import SimpleComingSoon from '~/components/ComingSoon/SimpleComingSoon';
import VibrantComingSoon from '~/components/ComingSoon/VibrantComingSoon';
import NeonComingSoon from '~/components/ComingSoon/NeonComingSoon';

// export const meta: MetaFunction = () => {
//   return [{title: 'Hydrogen | Home'}];
// };

export const meta: MetaFunction = () => {
  return [
    {title: 'f4rmula - Coming Soon'},
    {
      name: 'description',
      content:
        'Something special is coming. Be the first to know when f4rmula launches.',
    },
    {property: 'og:title', content: 'f4rmula - Coming Soon'},
    {
      property: 'og:description',
      content:
        'Something special is coming. Be the first to know when f4rmula launches.',
    },
    {property: 'og:type', content: 'website'},
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
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
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 overflow-hidden">
      {/* Dynamic Gradient Background */}
      <div
        className="absolute inset-0 opacity-30 transition-all duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)`,
        }}
      />

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0">
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
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 px-4 py-12">
        <FeaturedCollection collection={data.featuredCollection} />
        <RecommendedProducts products={data.recommendedProducts} />
      </div>
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="group block max-w-7xl mx-auto mb-16 relative overflow-hidden rounded-3xl"
      to={`/collections/${collection.handle}`}
    >
      <div className="relative p-[2px] rounded-3xl bg-gradient-to-r from-violet-600 via-orange-600 to-blue-600">
        <div className="relative bg-slate-950/90 backdrop-blur-xl rounded-3xl overflow-hidden">
          {image && (
            <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10"></div>
              <Image
                data={image}
                sizes="100vw"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
          )}
          <div className="p-8 md:p-12">
            <h1 className="font-black tracking-tighter">
              <span className="text-4xl md:text-6xl lg:text-7xl bg-gradient-to-r from-violet-400 via-orange-400 to-blue-400 bg-clip-text text-transparent">
                {collection.title}
              </span>
            </h1>
            <p className="mt-4 text-gray-400 text-lg">Explore Collection →</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="font-black tracking-tighter mb-4">
          <span className="text-4xl md:text-5xl lg:text-6xl bg-gradient-to-r from-violet-400 via-orange-400 to-blue-400 bg-clip-text text-transparent">
            Featured Products
          </span>
        </h2>
        <p className="text-gray-400 text-lg">Discover our latest collection</p>
      </div>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-64">
            <div className="text-violet-400 animate-pulse">
              Loading products...
            </div>
          </div>
        }
      >
        <Await resolve={products}>
          {(response) => (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {response
                ? response.products.nodes.map((product, index) => (
                    <div
                      key={product.id}
                      className="opacity-0 animate-fade-in"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: 'forwards',
                      }}
                    >
                      <VibrantProductItem product={product} />
                    </div>
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

function VibrantProductItem({product}: {product: any}) {
  return (
    <Link to={`/products/${product.handle}`} className="group block relative">
      <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-violet-600/50 via-orange-600/50 to-blue-600/50 hover:from-violet-600 hover:via-orange-600 hover:to-blue-600 transition-all duration-300">
        <div className="relative bg-slate-950/90 backdrop-blur-xl rounded-2xl overflow-hidden p-4">
          {product.featuredImage && (
            <div className="relative h-64 w-full overflow-hidden rounded-xl mb-4">
              <Image
                data={product.featuredImage}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          )}
          <h3 className="font-bold text-white text-lg mb-2 group-hover:text-violet-400 transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center justify-between">
            <Money
              data={product.priceRange.minVariantPrice}
              className="text-xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent"
            />
            <span className="text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity">
              View →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
