import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Dispute from '@/models/Dispute';
import { createNotification } from '@/lib/notifications';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    await connectDB();

    const { id } = await params;

    const dispute = await Dispute.findById(id)
      .populate('order', 'orderNumber totalPrice')
      .populate('buyer', 'name email')
      .populate('seller', 'name email')
      .populate('messages.sender', 'name email')
      .lean();

    if (!dispute) {
      return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });
    }

    return NextResponse.json({ dispute });
  } catch (error: any) {
    console.error('Error fetching dispute:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch dispute' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { status, resolution, refundAmount, message } = body;

    const dispute = await Dispute.findById(id);

    if (!dispute) {
      return NextResponse.json({ error: 'Dispute not found' }, { status: 404 });
    }

    const previousStatus = dispute.status;

    // Update fields
    if (status !== undefined) dispute.status = status;
    if (resolution !== undefined) dispute.resolution = resolution;
    if (refundAmount !== undefined) dispute.refundAmount = refundAmount;

    // Mark as resolved if status is a resolution status
    if (
      status &&
      ['resolved_buyer', 'resolved_seller', 'closed'].includes(status) &&
      !dispute.resolvedAt
    ) {
      dispute.resolvedAt = new Date();
    }

    // Add admin message if provided
    if (message && message.trim()) {
      dispute.messages.push({
        sender: session.user.id as any,
        senderRole: 'admin',
        message: message.trim(),
        createdAt: new Date(),
      });
    }

    await dispute.save();

    // Notify buyer and seller when status changes
    if (status && status !== previousStatus) {
      const statusLabels: Record<string, { fr: string; en: string; es: string }> = {
        open: { fr: 'Ouvert', en: 'Open', es: 'Abierto' },
        under_review: { fr: 'En cours d\'examen', en: 'Under review', es: 'En revisión' },
        resolved_buyer: { fr: 'Résolu en faveur de l\'acheteur', en: 'Resolved in buyer\'s favor', es: 'Resuelto a favor del comprador' },
        resolved_seller: { fr: 'Résolu en faveur du vendeur', en: 'Resolved in seller\'s favor', es: 'Resuelto a favor del vendedor' },
        closed: { fr: 'Fermé', en: 'Closed', es: 'Cerrado' },
      };

      const label = statusLabels[status] || { fr: status, en: status, es: status };

      // Notify buyer
      await createNotification({
        userId: dispute.buyer.toString(),
        type: 'system',
        title: {
          fr: 'Mise à jour de votre litige',
          en: 'Your dispute has been updated',
          es: 'Tu disputa ha sido actualizada',
        },
        message: {
          fr: `Le statut de votre litige #${dispute.disputeNumber} a été mis à jour : ${label.fr}`,
          en: `Your dispute #${dispute.disputeNumber} status has been updated: ${label.en}`,
          es: `El estado de tu disputa #${dispute.disputeNumber} ha sido actualizado: ${label.es}`,
        },
        link: `/account/orders`,
      });

      // Notify seller
      await createNotification({
        userId: dispute.seller.toString(),
        type: 'system',
        title: {
          fr: 'Mise à jour d\'un litige',
          en: 'A dispute has been updated',
          es: 'Una disputa ha sido actualizada',
        },
        message: {
          fr: `Le statut du litige #${dispute.disputeNumber} a été mis à jour : ${label.fr}`,
          en: `Dispute #${dispute.disputeNumber} status has been updated: ${label.en}`,
          es: `El estado de la disputa #${dispute.disputeNumber} ha sido actualizado: ${label.es}`,
        },
        link: `/seller/orders`,
      });
    }

    const updated = await Dispute.findById(id)
      .populate('order', 'orderNumber totalPrice')
      .populate('buyer', 'name email')
      .populate('seller', 'name email')
      .populate('messages.sender', 'name email')
      .lean();

    return NextResponse.json({ dispute: updated });
  } catch (error: any) {
    console.error('Error updating dispute:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update dispute' },
      { status: 500 }
    );
  }
}
