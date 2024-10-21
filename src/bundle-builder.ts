import {
  InputQuery,
  FunctionResult,
  DiscountApplicationStrategy,
  ProductVariant,
  DiscountAllocationMethod,
} from "../generated/api";
import { combineDiscounts } from "./discountUtilities"; 

const EMPTY_DISCOUNT: FunctionResult = {
  discountApplicationStrategy: DiscountApplicationStrategy.Maximum,
  discounts: [],
};

type Tier = {
  quantity: number;
  amount: number;
  title: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FIXED_BUNDLE';
};

type MetafieldValue = {
  title: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FIXED_BUNDLE';
  products: string[];
  collections: string[];
  tiers: Tier[];
};

type CartItem = InputQuery['cart']['lines'][number];

export function groupBy<T, K extends string | number | symbol>(
  collection: T[],
  iteratee: (obj: T) => K
): Record<string, T[]> {
  const result: Record<string, T[]> = {};
  for (const item of collection) {
    const key = iteratee(item).toString();
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
  }
  return result;
}

function calculateBestDiscountCombo(
  lineItems: CartItem[],
  tiers: Tier[],
  options: { discountType: string; title: string; }
) {
  tiers.sort((a, b) => b.quantity - a.quantity);
  const totalQuantity = lineItems.reduce((sum, item) => sum + item.quantity, 0);

  const appliedTier = tiers.find(tier => tier.quantity <= totalQuantity);

  if (appliedTier) {
    const totalOriginalPrice = lineItems.reduce(
      (sum, item) => sum + parseFloat(item.cost.amountPerQuantity.amount) * item.quantity,
      0
    );

    const totalDiscountAmount = totalOriginalPrice - appliedTier.amount;

    return [{
      message: appliedTier.title || options.title,
      value: {
        fixedAmount: {
          amount: totalDiscountAmount.toFixed(2),
        }
      },
      targets: lineItems.map(item => ({
        productVariant: {
          id: item.merchandise.id,
          quantity: item.quantity
        }
      })),
      allocationMethod: DiscountAllocationMethod.Across
    }];
  }

  return [];
}

export default function run(input: InputQuery): FunctionResult {
  const definition: MetafieldValue = JSON.parse(
    input?.discountNode?.metafield?.value ?? "{}"
  );

  if (input.cart.buyerIdentity?.purchasingCompany?.company?.id) {
    return EMPTY_DISCOUNT;
  }

  const { discountType, products, tiers, title } = definition;

  const isCartItemValid = (line: CartItem) => {
    if (line.sellingPlanAllocation) return false;
    if (products.length > 0) return products.includes((line.merchandise as ProductVariant).product?.id);
    return (line.merchandise as ProductVariant).product.inAnyCollection;
  };
  
  const filteredLineItems = input.cart.lines.filter(isCartItemValid);
  const discounts = calculateBestDiscountCombo(filteredLineItems, tiers, {
    discountType,
    title,
  });

  const result: FunctionResult = {
    discountApplicationStrategy: DiscountApplicationStrategy.Maximum,
    discounts: combineDiscounts(discounts, title)
  };
  if (!result.discounts.length) return EMPTY_DISCOUNT;
  return result;
}
