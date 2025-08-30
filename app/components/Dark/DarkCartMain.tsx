import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {DarkCartLineItem} from './DarkCartLineItem';
import {DarkCartSummary} from './DarkCartSummary';

export type CartLayout = 'page' | 'aside';

export type DarkCartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export function DarkCartMain({layout, cart: originalCart}: DarkCartMainProps) {
  const cart = useOptimisticCart(originalCart);
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className="text-white">
      <DarkCartEmpty hidden={linesCount} layout={layout} />
      <div className="space-y-4">
        <div aria-labelledby="cart-lines">
          <ul className="space-y-4">
            {(cart?.lines?.nodes ?? []).map((line) => (
              <DarkCartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>
        {cartHasItems && <DarkCartSummary cart={cart} layout={layout} />}
      </div>
    </div>
  );
}

function DarkCartEmpty({
  hidden = false,
  layout,
}: {
  hidden: boolean;
  layout?: DarkCartMainProps['layout'];
}) {
  const {close} = useAside();

  if (hidden) return null;

  return (
    <div className="text-center py-12">
      <div className="mb-4">
        <svg className="w-16 h-16 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <p className="text-gray-400 mb-6">
        Your cart is empty
      </p>
      <Link
        to="/collections"
        onClick={close}
        prefetch="viewport"
        className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
      >
        Continue shopping →
      </Link>
    </div>
  );
}
