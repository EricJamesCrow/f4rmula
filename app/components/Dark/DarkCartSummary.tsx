import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from './DarkCartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useRef} from 'react';
import {FetcherWithComponents} from 'react-router';

type DarkCartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function DarkCartSummary({cart, layout}: DarkCartSummaryProps) {
  return (
    <div className="mt-8 pt-8 border-t border-gray-800">
      <h4 className="text-xl font-bold text-white mb-4">Order Summary</h4>

      <dl className="space-y-4">
        <div className="flex justify-between">
          <dt className="text-gray-400">Subtotal</dt>
          <dd className="text-white font-semibold">
            {cart.cost?.subtotalAmount?.amount ? (
              <Money data={cart.cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </dd>
        </div>
      </dl>

      <DarkCartDiscounts discountCodes={cart.discountCodes} />
      <DarkCartGiftCard giftCardCodes={cart.appliedGiftCards} />
      <DarkCartCheckoutActions checkoutUrl={cart.checkoutUrl} />
    </div>
  );
}

function DarkCartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <div className="mt-8">
      <a
        href={checkoutUrl}
        target="_self"
        className="block w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-pink-500 text-white text-center font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
      >
        Continue to Checkout →
      </a>
    </div>
  );
}

function DarkCartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="mt-6">
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length} className="mb-4">
        <div className="flex justify-between items-center">
          <dt className="text-gray-400">Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="flex items-center gap-2">
              <code className="text-cyan-400 bg-gray-900/50 px-2 py-1 rounded">
                {codes?.join(', ')}
              </code>
              <button className="text-gray-500 hover:text-red-400 text-sm">
                Remove
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex gap-2">
          <input
            type="text"
            name="discountCode"
            placeholder="Discount code"
            className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Apply
          </button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function DarkCartGiftCard({
  giftCardCodes,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) {
  const appliedGiftCardCodes = useRef<string[]>([]);
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const codes: string[] =
    giftCardCodes?.map(({lastCharacters}) => `***${lastCharacters}`) || [];

  function saveAppliedCode(code: string) {
    const formattedCode = code.replace(/\s/g, ''); // Remove spaces
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
    giftCardCodeInput.current!.value = '';
  }

  function removeAppliedCode() {
    appliedGiftCardCodes.current = [];
  }

  return (
    <div className="mt-4">
      {/* Have existing gift card applied, display it with a remove option */}
      <dl hidden={!codes.length} className="mb-4">
        <div className="flex justify-between items-center">
          <dt className="text-gray-400">Gift Card(s)</dt>
          <UpdateGiftCardForm>
            <div className="flex items-center gap-2">
              <code className="text-pink-400 bg-gray-900/50 px-2 py-1 rounded">
                {codes?.join(', ')}
              </code>
              <button
                onSubmit={() => removeAppliedCode}
                className="text-gray-500 hover:text-red-400 text-sm"
              >
                Remove
              </button>
            </div>
          </UpdateGiftCardForm>
        </div>
      </dl>

      {/* Show an input to apply a gift card */}
      <UpdateGiftCardForm
        giftCardCodes={appliedGiftCardCodes.current}
        saveAppliedCode={saveAppliedCode}
      >
        <div className="flex gap-2">
          <input
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
            className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition-colors"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Apply
          </button>
        </div>
      </UpdateGiftCardForm>
    </div>
  );
}

function UpdateGiftCardForm({
  giftCardCodes,
  saveAppliedCode,
  children,
}: {
  giftCardCodes?: string[];
  saveAppliedCode?: (code: string) => void;
  removeAppliedCode?: () => void;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) {
          saveAppliedCode(code as string);
        }
        return children;
      }}
    </CartForm>
  );
}
