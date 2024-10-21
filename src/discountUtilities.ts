// discountUtilities.ts
import { Discount } from '../generated/api';


/**
 * Combines multiple discounts into a single discount array.
 * @param discounts An array of Discount objects
 * @param fallbackTitle A default title to use for the combined discount
 * @returns An array of Discount objects
 */
export function combineDiscounts(discounts: Discount[], fallbackTitle: string): Discount[] {
  if (discounts.length === 0) {
    return []; 
  }

  if (discounts.length === 1) {
    return discounts; 
  }

  const combinedDiscount: Discount = {
    message: fallbackTitle,
    targets: [],
    value: { fixedAmount: { amount: 0 } }
  };

  discounts.forEach(discount => {
    if (discount.value && discount.value.fixedAmount && combinedDiscount.value.fixedAmount) {
      combinedDiscount.value.fixedAmount.amount += discount.value.fixedAmount.amount;
      combinedDiscount.targets = [...combinedDiscount.targets, ...discount.targets];
    }
  });
  

  return [combinedDiscount];
}
