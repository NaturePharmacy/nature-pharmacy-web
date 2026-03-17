import { NextRequest, NextResponse } from 'next/server';
import { calculateMultiVendorShipping, CartItem } from '@/lib/shippingCalculator';
import connectDB from '@/lib/mongodb';
import ShippingZone from '@/models/ShippingZone';
import Product from '@/models/Product';

// POST /api/shipping/calculate
// Body: { country, region?, items? }
//   - items: CartItem[] (with sellerId) OR [{ productId, quantity, price? }] for multi-vendor calculation
//   - For legacy single-zone lookup: { country, region, orderTotal }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { country, region, orderTotal, items } = body;

    if (!country) {
      return NextResponse.json(
        { error: 'country is required' },
        { status: 400 }
      );
    }

    // Multi-vendor path: items array provided
    if (Array.isArray(items) && items.length > 0) {
      await connectDB();

      // Resolve sellerId from productId if not already present
      const resolvedItems: CartItem[] = await Promise.all(
        items.map(async (item: { productId?: string; sellerId?: string; sellerName?: string; price?: number; quantity: number }) => {
          if (item.sellerId) {
            return item as CartItem;
          }
          // Look up product to get seller
          const product = await Product.findById(item.productId)
            .populate('seller', 'name')
            .lean() as any;
          return {
            productId: item.productId ?? '',
            sellerId: product?.seller?._id?.toString() ?? 'unknown',
            sellerName: product?.seller?.name ?? 'Vendeur',
            price: item.price ?? product?.price ?? 0,
            quantity: item.quantity,
          } as CartItem;
        })
      );

      const result = await calculateMultiVendorShipping(resolvedItems, country, region);
      return NextResponse.json(result);
    }

    // Legacy single-zone path (used by non-multi-vendor callers)
    if (orderTotal === undefined) {
      return NextResponse.json(
        { error: 'orderTotal is required for single-zone calculation' },
        { status: 400 }
      );
    }

    await connectDB();

    const query: Record<string, unknown> = {
      countries: country.toUpperCase(),
      isActive: true,
    };

    // Region-specific match first
    if (region) {
      const regionZone = await ShippingZone.findOne({
        ...query,
        regions: region,
      })
        .sort({ priority: 1 })
        .lean();

      if (regionZone) {
        const shippingCost =
          regionZone.freeShippingThreshold && orderTotal >= regionZone.freeShippingThreshold
            ? 0
            : regionZone.shippingCost;

        return NextResponse.json({
          zone: regionZone,
          shippingCost,
          isFreeShipping: shippingCost === 0,
          estimatedDeliveryDays: regionZone.estimatedDeliveryDays,
        });
      }
    }

    // General country zone
    const zone = await ShippingZone.findOne(query).sort({ priority: 1 }).lean();

    if (!zone) {
      return NextResponse.json(
        { error: 'No shipping available for this location' },
        { status: 404 }
      );
    }

    const shippingCost =
      zone.freeShippingThreshold && orderTotal >= zone.freeShippingThreshold
        ? 0
        : zone.shippingCost;

    return NextResponse.json({
      zone,
      shippingCost,
      isFreeShipping: shippingCost === 0,
      estimatedDeliveryDays: zone.estimatedDeliveryDays,
      freeShippingThreshold: zone.freeShippingThreshold,
      amountUntilFreeShipping: zone.freeShippingThreshold
        ? Math.max(0, zone.freeShippingThreshold - orderTotal)
        : null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to calculate shipping';
    console.error('Error calculating shipping:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
