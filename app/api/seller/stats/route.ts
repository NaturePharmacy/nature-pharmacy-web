import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';

// GET /api/seller/stats - Obtenir les statistiques du vendeur
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'seller' && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    const sellerId = session.user.id;

    // Récupérer les produits du vendeur
    const products = await Product.find({ seller: sellerId });
    const productIds = products.map(p => p._id);

    // Statistiques des produits
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.isActive).length;
    const outOfStockProducts = products.filter(p => p.stock === 0).length;
    const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= 10).length;

    // Récupérer les commandes contenant les produits du vendeur
    const orders = await Order.find({
      'items.product': { $in: productIds }
    });

    // Calculer le chiffre d'affaires et les ventes
    let totalRevenue = 0;
    let totalSales = 0;
    let pendingOrders = 0;
    let processingOrders = 0;
    let shippedOrders = 0;
    let deliveredOrders = 0;

    const recentOrders: any[] = [];

    orders.forEach(order => {
      // Calculer le revenu pour ce vendeur
      order.items.forEach((item: any) => {
        if (productIds.some(id => id.toString() === item.product.toString())) {
          totalRevenue += item.price * item.quantity;
          totalSales += item.quantity;
        }
      });

      // Compter les statuts
      switch (order.status) {
        case 'pending': pendingOrders++; break;
        case 'processing': processingOrders++; break;
        case 'shipped': shippedOrders++; break;
        case 'delivered': deliveredOrders++; break;
      }

      // Ajouter aux commandes récentes (max 5)
      if (recentOrders.length < 5) {
        recentOrders.push({
          _id: order._id,
          orderNumber: order.orderNumber,
          status: order.status,
          totalPrice: order.totalPrice,
          createdAt: order.createdAt,
          itemCount: order.items.length
        });
      }
    });

    // Produits les plus vendus
    const productSales = new Map();
    orders.forEach(order => {
      order.items.forEach((item: any) => {
        if (productIds.some(id => id.toString() === item.product.toString())) {
          const current = productSales.get(item.product.toString()) || { quantity: 0, revenue: 0 };
          productSales.set(item.product.toString(), {
            quantity: current.quantity + item.quantity,
            revenue: current.revenue + (item.price * item.quantity)
          });
        }
      });
    });

    const topProducts = await Promise.all(
      Array.from(productSales.entries())
        .sort((a, b) => b[1].quantity - a[1].quantity)
        .slice(0, 5)
        .map(async ([productId, stats]) => {
          const product = products.find(p => p._id.toString() === productId);
          return {
            _id: productId,
            name: product?.name,
            slug: product?.slug,
            image: product?.images[0],
            sold: stats.quantity,
            revenue: stats.revenue
          };
        })
    );

    return NextResponse.json({
      stats: {
        totalProducts,
        activeProducts,
        outOfStockProducts,
        lowStockProducts,
        totalRevenue,
        totalSales,
        totalOrders: orders.length,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders
      },
      recentOrders,
      topProducts
    });
  } catch (error) {
    console.error('Error fetching seller stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
