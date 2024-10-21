// discountUtilities.ts
import { Discount } from '../generated/api'; // Ensure you have the right import


/**
 * Combines multiple discounts into a single discount array.
 * @param discounts An array of Discount objects
 * @param fallbackTitle A default title to use for the combined discount
 * @returns An array of Discount objects
 */
export function combineDiscounts(discounts: Discount[], fallbackTitle: string): Discount[] {
  if (discounts.length === 0) {
    return []; // Ensure to return an empty array if no discounts to combine
  }

  if (discounts.length === 1) {
    return discounts; // Return as is if only one discount
  }

  // Assuming discounts can be combined into one for simplification
  const combinedDiscount: Discount = {
    message: fallbackTitle,
    targets: [], // Initialize empty targets, you would combine these as necessary
    value: { fixedAmount: { amount: 0 } } // Modify according to your Discount value structure
  };

  discounts.forEach(discount => {
    if (discount.value && discount.value.fixedAmount && combinedDiscount.value.fixedAmount) {
      // Assuming value is a fixed amount for simplification
      combinedDiscount.value.fixedAmount.amount += discount.value.fixedAmount.amount;
      combinedDiscount.targets = [...combinedDiscount.targets, ...discount.targets];
    }
  });
  

  return [combinedDiscount]; // Return an array containing the single combined discount
}
