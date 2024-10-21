# Shopify Fixed Bundle Discount
## Overview

This project implements a Fixed Bundle Price Discount feature for a shopping cart, following the requirements specified in the task. The main goal is to update the existing discount function to support a new discount type where customers can buy a specific number of items from a list of products for a fixed total price.

## Task Summary

1. Objective: Implement a new discount application called Fixed Bundle Price.

2. Discount Logic:
Tiered Discounts:
Buy 3 items from a list of products for a total of $10.
Buy 6 items from a list of products for a total of $17.
Buy 9 items from a list of products for a total of $20.

3. Requirements:
Update bundle-builder.ts to handle the new discount type.
Modify the test file bundle.test.ts to test the new discount application.
Ensure that the discount is distributed equally across all eligible items.
The discount function should return the correct targets with the appropriate discount values.

## Project Structure

    src/
        bundle-builder.ts: Contains the main logic for calculating and applying discounts to the cart.
        discountUtilities.ts: Provides utility functions to combine discounts.
    tests/
        bundle.test.ts: Contains test cases to validate the discount logic.
    generated/
        api.ts: Defines TypeScript types and enums based on the Shopify Function API.

### Implementation Details

bundle-builder.ts

Purpose: Calculate and apply the fixed bundle price discounts to the cart.
Key Functions:
**calculateBestDiscountCombo:**
    - Determines the best applicable discount tier based on the total quantity of eligible items in the cart.
    - Calculates the total original price of eligible items.
    - Computes the total discount amount as the difference between the original price and the fixed bundle price.
    - Distributes the discount across all eligible items using the allocationMethod set to ACROSS.
**run:**
    - Parses the discount definition from the discountNode metafield.
    - Filters cart items to identify eligible products.
    - Calls calculateBestDiscountCombo to obtain applicable discounts.
    - Returns the final discount result to be applied to the cart.

discountUtilities.ts

Purpose: Provide utility functions to handle discounts.
Key Functions:
combineDiscounts:
- Combines multiple discount objects into a single discount.
- Ensures that discounts are correctly aggregated and applied.

bundle.test.ts

Purpose: Test the fixed bundle price discount logic.
Test Case:
- Sets up a cart with 6 eligible items (3 Apples and 3 Bananas).
- Defines discount tiers for buying 3 and 6 fruits at fixed prices.
- Expects the discount to correctly apply the "Buy 6 fruits for $17" tier.
- Validates that the total discount amount is accurately calculated and distributed.

## How the Code Meets the Requirements

1. Fixed Bundle Price Implementation:
    - Introduced a new discount type 'FIXED_BUNDLE' to handle fixed bundle pricing.
    - Updated the calculateBestDiscountCombo function to calculate the total discount amount based on the fixed bundle price tiers.
2. Discount Calculation Logic:
    - Calculates the total original price of all eligible items.
    - Determines the appropriate discount tier based on the total quantity.
    - Computes the total discount amount as totalOriginalPrice - fixedBundlePrice.
    - Ensures the discount is allocated across all eligible items using the allocationMethod: 'ACROSS'.
3. Test Coverage:
    - Added a test case in bundle.test.ts to validate the fixed bundle price logic.
    - Tests both the calculation of the discount amount and the correct application of the discount message.
4. TypeScript Types and Enums:
    - Updated api.ts to include the DiscountAllocationMethod enum and the allocationMethod property in the Discount type.
    - Ensured that all TypeScript types and interfaces are consistent with the Shopify Function API.

## Setup and Testing Instructions
### Prerequisites

Node.js installed on your machine.
npm (Node Package Manager) for managing dependencies.

### Installation

    Clone the Repository:
```bash

git clone <repository-url>
cd <repository-directory>
```

Install Dependencies:

```bash

    npm install
```

### Running the Tests

Execute the following command to run the test suite:

```bash

npm test
```

### Expected Test Output

    - The test suite should pass without any errors.
    - The console will display detailed output of the discount calculation for verification.

### Code Execution Flow

- Cart Input:
    The function receives an InputQuery object containing cart details and discount definitions.
- Discount Definition Parsing:
    The discount definitions are parsed from the discountNode metafield.
- Eligible Items Filtering:
    Cart items are filtered to include only those eligible for the discount based on the products list.
- Discount Calculation:
    The calculateBestDiscountCombo function:
        Sorts the tiers to find the most applicable one based on quantity.
        Calculates the total original price of eligible items.
        Computes the total discount amount.
        Constructs the discount object with the calculated discount value, targets, and allocation method.
- Discount Application:
    The calculated discount is applied to the cart.
    The discount is distributed across all eligible items proportionally.
- Result Return:
    The function returns a FunctionResult object containing the discount application strategy and the list of discounts to apply.

### Important Considerations

- Discount Allocation Method:
    Set to 'ACROSS' to ensure the discount is proportionally distributed across all eligible items.
- TypeScript Types:
    Updated api.ts to include necessary enums and types for DiscountAllocationMethod and allocationMethod.
- Extensibility:
    The code is designed to support additional discount types by extending the Tier type and updating the calculation logic accordingly.
- Error Handling:
    If no applicable discount tier is found, the function returns an empty discount result.