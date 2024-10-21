import { expect, it, describe } from 'vitest';
import run from '../src/bundle-builder';
import { InputQuery, CurrencyCode } from '../generated/api';

describe('bundle builder', () => {
  it('applies fixed bundle discounts correctly', () => {
    const input: InputQuery = {
      cart: {
        buyerIdentity: null,
        lines: [
          {
            id: "gid://shopify/CartLine/0",
            quantity: 3,
            sellingPlanAllocation: null,
            cost: {
              amountPerQuantity: {
                amount: "10.95",
                currencyCode: CurrencyCode.Eur
              }
            },
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/39370591273049",
              product: {
                id: "gid://shopify/Product/Apple",
                inAnyCollection: true
              }
            }
          },
          {
            id: "gid://shopify/CartLine/1",
            quantity: 3,
            sellingPlanAllocation: null,
            cost: {
              amountPerQuantity: {
                amount: "10.95",
                currencyCode: CurrencyCode.Eur
              }
            },
            merchandise: {
              __typename: "ProductVariant",
              id: "gid://shopify/ProductVariant/32385157005401",
              product: {
                id: "gid://shopify/Product/Banana",
                inAnyCollection: false
              }
            }
          }
        ]
      },
      discountNode: {
        metafield: {
          value: JSON.stringify({
            id: "148",
            tiers: [
              { title: "Buy 3 fruits for $10", amount: 10, quantity: 3, type: "FIXED_BUNDLE" },
              { title: "Buy 6 fruits for $17", amount: 17, quantity: 6, type: "FIXED_BUNDLE" },
            ],
            products: ["gid://shopify/Product/Apple", "gid://shopify/Product/Banana"],
            discountType: "FIXED_BUNDLE",
            title: "Fruit Bundle Discounts"
          })
        }
      }
    };

    const result = run(input);
    console.log(JSON.stringify(result, null, 2)); 
    expect(result.discounts.length).toBe(1);
    expect(result.discounts[0].message).toContain('Buy 6 fruits for $17');
    const discountAmount = parseFloat(result.discounts[0]?.value?.fixedAmount?.amount ?? '0');
    expect(discountAmount).toBeCloseTo(48.7, 2); 
  });
});
