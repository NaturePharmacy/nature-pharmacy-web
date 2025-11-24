import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ShippingZone from '@/models/ShippingZone';

// POST /api/shipping/calculate - Calculate shipping cost for cart
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { country, region, orderTotal } = await request.json();

    if (!country || orderTotal === undefined) {
      return NextResponse.json(
        { error: 'Country and order total are required' },
        { status: 400 }
      );
    }

    // Find matching zones
    let query: any = {
      countries: country,
      isActive: true,
    };

    // If region is specified, try to find specific match
    if (region) {
      const regionSpecificZone = await ShippingZone.findOne({
        ...query,
        regions: region,
      })
        .sort({ priority: 1 })
        .lean();

      if (regionSpecificZone) {
        const shippingCost = regionSpecificZone.freeShippingThreshold &&
          orderTotal >= regionSpecificZone.freeShippingThreshold
          ? 0
          : regionSpecificZone.shippingCost;

        return NextResponse.json({
          zone: regionSpecificZone,
          shippingCost,
          isFreeShipping: shippingCost === 0,
          estimatedDeliveryDays: regionSpecificZone.estimatedDeliveryDays,
        });
      }
    }

    // Find general zone for country
    const zone = await ShippingZone.findOne(query)
      .sort({ priority: 1 })
      .lean();

    if (!zone) {
      return NextResponse.json(
        { error: 'No shipping available for this location' },
        { status: 404 }
      );
    }

    const shippingCost = zone.freeShippingThreshold && orderTotal >= zone.freeShippingThreshold
      ? 0
      : zone.shippingCost;

    return NextResponse.json({
      zone,
      shippingCost,
      isFreeShipping: shippingCost === 0,
      estimatedDeliveryDays: zone.estimatedDeliveryDays,
      freeShippingThreshold: zone.freeShippingThreshold,
      amountUntilFreeShipping: zone.freeShippingThreshold && !shippingCost
        ? 0
        : zone.freeShippingThreshold
        ? Math.max(0, zone.freeShippingThreshold - orderTotal)
        : null,
    });
  } catch (error: any) {
    console.error('Error calculating shipping:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate shipping' },
      { status: 500 }
    );
  }
}
