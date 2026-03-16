import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Dispute from '@/models/Dispute';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '15');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const query: any = {};

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    let disputesQuery = Dispute.find(query)
      .populate('order', 'orderNumber totalPrice')
      .populate('buyer', 'name email')
      .populate('seller', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // If searching by order number, we need to handle it after population
    // or use aggregation. For simplicity, fetch and filter if search provided.
    let disputes;
    let total;

    if (search) {
      // Fetch without limit to filter by populated orderNumber
      const allDisputes = await Dispute.find(query)
        .populate('order', 'orderNumber totalPrice')
        .populate('buyer', 'name email')
        .populate('seller', 'name email')
        .sort({ createdAt: -1 })
        .lean();

      const filtered = allDisputes.filter((d: any) =>
        d.order?.orderNumber?.toLowerCase().includes(search.toLowerCase())
      );

      total = filtered.length;
      disputes = filtered.slice(skip, skip + limit);
    } else {
      [disputes, total] = await Promise.all([
        Dispute.find(query)
          .populate('order', 'orderNumber totalPrice')
          .populate('buyer', 'name email')
          .populate('seller', 'name email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Dispute.countDocuments(query),
      ]);
    }

    // Stats
    const [totalCount, openCount, resolvedBuyerCount, resolvedSellerCount] = await Promise.all([
      Dispute.countDocuments({}),
      Dispute.countDocuments({ status: 'open' }),
      Dispute.countDocuments({ status: 'resolved_buyer' }),
      Dispute.countDocuments({ status: 'resolved_seller' }),
    ]);

    return NextResponse.json({
      disputes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        total: totalCount,
        open: openCount,
        resolvedBuyer: resolvedBuyerCount,
        resolvedSeller: resolvedSellerCount,
      },
    });
  } catch (error: any) {
    console.error('Error fetching disputes:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch disputes' },
      { status: 500 }
    );
  }
}
