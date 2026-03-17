/**
 * Multi-vendor shipping calculator.
 *
 * Strategy:
 * 1. Group cart items by seller.
 * 2. For each seller, look up their VendorShippingSettings.
 *    - If they have a country-specific rule → use it.
 *    - Else if they have a default cost → use it.
 *    - Else fall back to the global ShippingZone table.
 * 3. Apply freeShippingThreshold per seller sub-total.
 * 4. Sum all per-vendor shipping costs → total shippingCost.
 *
 * All amounts are in USD (same as product prices in DB).
 */

import connectDB from '@/lib/mongodb';
import ShippingZone from '@/models/ShippingZone';
import VendorShippingSettings from '@/models/VendorShippingSettings';

export interface CartItem {
  productId: string;
  sellerId: string;
  sellerName?: string;
  price: number; // USD
  quantity: number;
}

export interface VendorShippingResult {
  sellerId: string;
  sellerName: string;
  subtotal: number; // USD — sum of items for this vendor
  shippingCost: number; // USD
  isFreeShipping: boolean;
  zoneId?: string;
  zoneName?: string;
  estimatedDeliveryDays?: { min: number; max: number };
}

export interface ShippingCalculationResult {
  vendors: VendorShippingResult[];
  totalShipping: number; // USD — sum of all vendor shipping costs
  breakdown: Array<{
    sellerId: string;
    sellerName: string;
    shippingCost: number;
    zoneId?: string;
    zoneName?: string;
  }>;
}

/**
 * Calculate shipping for a multi-vendor cart.
 * @param items  Cart items (must include sellerId + price + quantity)
 * @param buyerCountry  ISO 3166-1 alpha-2 country code of the buyer
 * @param buyerRegion   Optional region / city name
 */
export async function calculateMultiVendorShipping(
  items: CartItem[],
  buyerCountry: string,
  buyerRegion?: string
): Promise<ShippingCalculationResult> {
  await connectDB();

  // 1. Group items by seller
  const vendorMap = new Map<string, { sellerName: string; items: CartItem[] }>();
  for (const item of items) {
    const existing = vendorMap.get(item.sellerId);
    if (existing) {
      existing.items.push(item);
    } else {
      vendorMap.set(item.sellerId, {
        sellerName: item.sellerName ?? item.sellerId,
        items: [item],
      });
    }
  }

  // 2. Load vendor-specific settings (bulk)
  const sellerIds = Array.from(vendorMap.keys());
  const vendorSettings = await VendorShippingSettings.find({
    seller: { $in: sellerIds },
    isActive: true,
  }).lean();
  const settingsMap = new Map(
    vendorSettings.map((s) => [s.seller.toString(), s])
  );

  // 3. Load global zone for buyer country (one fallback for all vendors)
  const globalZone = await ShippingZone.findOne({
    countries: buyerCountry.toUpperCase(),
    isActive: true,
  })
    .sort({ priority: 1 })
    .lean();

  // 4. Compute per-vendor shipping
  const vendors: VendorShippingResult[] = [];

  for (const [sellerId, { sellerName, items: vendorItems }] of vendorMap) {
    const subtotal = vendorItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const settings = settingsMap.get(sellerId);

    let shippingCost = 0;
    let isFreeShipping = false;
    let zoneId: string | undefined;
    let zoneName: string | undefined;
    let estimatedDeliveryDays: { min: number; max: number } | undefined;

    if (settings) {
      // Global free shipping flag
      if (settings.globalFreeShipping) {
        isFreeShipping = true;
        shippingCost = 0;
      } else {
        // Country-specific rule first
        const countryRule = settings.countryRules.find(
          (r) => r.country === buyerCountry.toUpperCase()
        );

        const cost = countryRule?.shippingCost ?? settings.defaultShippingCost;
        const threshold = countryRule?.freeShippingThreshold ?? settings.freeShippingThreshold;

        if (threshold !== undefined && subtotal >= threshold) {
          isFreeShipping = true;
          shippingCost = 0;
        } else {
          shippingCost = cost;
        }

        if (countryRule?.estimatedDeliveryDays) {
          estimatedDeliveryDays = countryRule.estimatedDeliveryDays as { min: number; max: number };
        }
      }
    } else if (globalZone) {
      // Fall back to global ShippingZone
      zoneId = globalZone._id.toString();
      zoneName = globalZone.name?.en ?? globalZone.name?.fr;

      const threshold = globalZone.freeShippingThreshold;
      // Note: globalZone.shippingCost is in globalZone.currency — for now we assume USD
      // (currency conversion can be added later via lib/currency.ts)
      if (threshold && subtotal >= threshold) {
        isFreeShipping = true;
        shippingCost = 0;
      } else {
        shippingCost = globalZone.shippingCost;
      }

      estimatedDeliveryDays = globalZone.estimatedDeliveryDays as { min: number; max: number };
    }
    // else: no zone, no vendor settings → free (0)

    vendors.push({
      sellerId,
      sellerName,
      subtotal,
      shippingCost,
      isFreeShipping,
      zoneId,
      zoneName,
      estimatedDeliveryDays,
    });
  }

  const totalShipping = vendors.reduce((s, v) => s + v.shippingCost, 0);

  return {
    vendors,
    totalShipping,
    breakdown: vendors.map((v) => ({
      sellerId: v.sellerId,
      sellerName: v.sellerName,
      shippingCost: v.shippingCost,
      zoneId: v.zoneId,
      zoneName: v.zoneName,
    })),
  };
}
