import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const q = request.nextUrl.searchParams.get('q')?.trim();
    if (!q || q.length < 2) {
      return NextResponse.json({ results: [] });
    }

    await connectDB();

    const regex = { $regex: q, $options: 'i' };

    const [orders, products, users] = await Promise.all([
      Order.find({ $or: [{ orderNumber: regex }] })
        .populate('buyer', 'name email')
        .select('orderNumber totalPrice status createdAt buyer')
        .limit(5)
        .lean(),
      Product.find({ $or: [{ 'name.fr': regex }, { 'name.en': regex }] })
        .select('name slug images isActive approvalStatus')
        .limit(5)
        .lean(),
      User.find({ $or: [{ name: regex }, { email: regex }] })
        .select('name email role isEmailVerified')
        .limit(5)
        .lean(),
    ]);

    const results = [
      ...orders.map((o: any) => ({
        type: 'order',
        id: o._id,
        label: o.orderNumber,
        sub: `${o.buyer?.name || ''} — ${o.totalPrice} USD`,
        status: o.status,
        href: `/admin/orders`,
      })),
      ...products.map((p: any) => ({
        type: 'product',
        id: p._id,
        label: p.name?.fr || p.name?.en,
        sub: p.approvalStatus,
        href: `/admin/products`,
      })),
      ...users.map((u: any) => ({
        type: 'user',
        id: u._id,
        label: u.name,
        sub: u.email,
        role: u.role,
        href: `/admin/users`,
      })),
    ];

    return NextResponse.json({ results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
