import {Link, useNavigate} from 'react-router';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import type {ProductFragment} from 'storefrontapi.generated';

export function DarkProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();

  return (
    <div className="space-y-6">
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;

        return (
          <div key={option.name}>
            <h5 className="text-gray-400 text-sm uppercase tracking-wider mb-3">
              {option.name}
            </h5>
            <div className="flex flex-wrap gap-3">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                if (isDifferentProduct) {
                  return (
                    <Link
                      className={`
                        px-4 py-2 rounded-lg border transition-all duration-300
                        ${
                          selected
                            ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                            : 'border-gray-800 bg-gray-900/50 text-gray-400 hover:border-gray-700 hover:text-white'
                        }
                        ${!available ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                    >
                      <DarkProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  return (
                    <button
                      type="button"
                      className={`
                        px-4 py-2 rounded-lg border transition-all duration-300
                        ${
                          selected
                            ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                            : 'border-gray-800 bg-gray-900/50 text-gray-400 hover:border-gray-700 hover:text-white'
                        }
                        ${!available ? 'opacity-50 cursor-not-allowed' : ''}
                        ${!exists ? 'cursor-not-allowed' : 'cursor-pointer'}
                      `}
                      key={option.name + name}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <DarkProductOptionSwatch swatch={swatch} name={name} />
                    </button>
                  );
                }
              })}
            </div>
          </div>
        );
      })}

      <div
        className={`
        [&>form>button]:w-full [&>form>button]:py-4 [&>form>button]:px-6 [&>form>button]:rounded-lg [&>form>button]:font-bold [&>form>button]:transition-all [&>form>button]:duration-300
        ${
          selectedVariant?.availableForSale
            ? '[&>form>button]:bg-gradient-to-r [&>form>button]:from-cyan-500 [&>form>button]:to-pink-500 [&>form>button]:text-white [&>form>button:hover]:shadow-lg [&>form>button:hover]:shadow-cyan-500/25'
            : '[&>form>button]:bg-gray-800 [&>form>button]:text-gray-500 [&>form>button]:cursor-not-allowed'
        }
      `}
      >
        <AddToCartButton
          disabled={!selectedVariant || !selectedVariant.availableForSale}
          onClick={() => {
            open('cart');
          }}
          lines={
            selectedVariant
              ? [
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: 1,
                    selectedVariant,
                  },
                ]
              : []
          }
        >
          {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
        </AddToCartButton>
      </div>
    </div>
  );
}

function DarkProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return <span>{name}</span>;

  return (
    <div aria-label={name} className="flex items-center gap-2">
      {(image || color) && (
        <span
          className="w-6 h-6 rounded-full border border-gray-700"
          style={{
            backgroundColor: color || 'transparent',
            backgroundImage: image ? `url(${image})` : undefined,
            backgroundSize: 'cover',
          }}
        />
      )}
      <span>{name}</span>
    </div>
  );
}
