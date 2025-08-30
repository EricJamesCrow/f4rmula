import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

export function DarkProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;

  return (
    <Link
      className="group relative block"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <div className="relative overflow-hidden rounded-lg bg-gray-900/50 backdrop-blur-sm border border-gray-800 transition-all duration-300 group-hover:border-cyan-500/50">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

        {image && (
          <div className="aspect-square overflow-hidden">
            <Image
              alt={image.altText || product.title}
              aspectRatio="1/1"
              data={image}
              loading={loading}
              sizes="(min-width: 45em) 400px, 100vw"
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        <div className="p-4">
          <h4 className="text-white font-semibold mb-2 group-hover:text-cyan-400 transition-colors">
            {product.title}
          </h4>
          <div className="text-gray-400">
            <Money data={product.priceRange.minVariantPrice} />
          </div>
        </div>
      </div>
    </Link>
  );
}
