import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { createNotification } from '@/lib/notifications';
import { logActivity } from '@/lib/activityLog';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await connectDB();

    const { action, reason } = await request.json();

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const prevStatus = (product as any).approvalStatus;

    if (action === 'approve') {
      (product as any).approvalStatus = 'approved';
      product.isActive = true;
    } else {
      (product as any).approvalStatus = 'rejected';
      product.isActive = false;
    }

    await product.save();

    const productName = product.name?.fr || product.name?.en || String(product._id);

    // Notify seller
    if (product.seller) {
      const notif =
        action === 'approve'
          ? {
              type: 'product' as const,
              title: 'Produit approuvé',
              message: `Votre produit "${productName}" a été approuvé et est maintenant visible.`,
              link: `/products/${product.slug}`,
            }
          : {
              type: 'product' as const,
              title: 'Produit refusé',
              message: `Votre produit "${productName}" a été refusé.${reason ? ` Raison : ${reason}` : ''}`,
              link: `/seller/products`,
            };

      await createNotification({
        userId: product.seller.toString(),
        ...notif,
      });
    }

    await logActivity({
      adminId: (session.user as any).id,
      adminEmail: session.user.email!,
      adminName: session.user.name || 'Admin',
      action: action === 'approve' ? 'product.approve' : 'product.reject',
      resourceType: 'product',
      resourceId: product._id.toString(),
      resourceLabel: productName,
      before: { approvalStatus: prevStatus, isActive: !product.isActive },
      after: {
        approvalStatus: (product as any).approvalStatus,
        isActive: product.isActive,
      },
      meta: reason ? { reason } : undefined,
    });

    return NextResponse.json({
      success: true,
      approvalStatus: (product as any).approvalStatus,
    });
  } catch (error: any) {
    console.error('Product approval error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
