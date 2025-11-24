import connectDB from './mongodb';
import Notification from '@/models/Notification';

interface CreateNotificationParams {
  userId: string;
  type: 'order' | 'message' | 'review' | 'product' | 'system';
  title: { fr: string; en: string; es: string };
  message: { fr: string; en: string; es: string };
  link?: string;
  data?: any;
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    await connectDB();

    const notification = await Notification.create({
      user: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      link: params.link,
      data: params.data || {},
      isRead: false,
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}

// Notification templates
export const NotificationTemplates = {
  // Order notifications
  orderPlaced: (orderId: string) => ({
    type: 'order' as const,
    title: {
      fr: 'Commande confirmée',
      en: 'Order confirmed',
      es: 'Pedido confirmado',
    },
    message: {
      fr: `Votre commande #${orderId.slice(-8)} a été confirmée`,
      en: `Your order #${orderId.slice(-8)} has been confirmed`,
      es: `Su pedido #${orderId.slice(-8)} ha sido confirmado`,
    },
    link: `/orders/${orderId}`,
  }),

  orderProcessing: (orderId: string) => ({
    type: 'order' as const,
    title: {
      fr: 'Commande en traitement',
      en: 'Order processing',
      es: 'Pedido en proceso',
    },
    message: {
      fr: `Votre commande #${orderId.slice(-8)} est en cours de traitement`,
      en: `Your order #${orderId.slice(-8)} is being processed`,
      es: `Su pedido #${orderId.slice(-8)} está siendo procesado`,
    },
    link: `/orders/${orderId}`,
  }),

  orderShipped: (orderId: string) => ({
    type: 'order' as const,
    title: {
      fr: 'Commande expédiée',
      en: 'Order shipped',
      es: 'Pedido enviado',
    },
    message: {
      fr: `Votre commande #${orderId.slice(-8)} a été expédiée`,
      en: `Your order #${orderId.slice(-8)} has been shipped`,
      es: `Su pedido #${orderId.slice(-8)} ha sido enviado`,
    },
    link: `/orders/${orderId}`,
  }),

  orderDelivered: (orderId: string) => ({
    type: 'order' as const,
    title: {
      fr: 'Commande livrée',
      en: 'Order delivered',
      es: 'Pedido entregado',
    },
    message: {
      fr: `Votre commande #${orderId.slice(-8)} a été livrée`,
      en: `Your order #${orderId.slice(-8)} has been delivered`,
      es: `Su pedido #${orderId.slice(-8)} ha sido entregado`,
    },
    link: `/orders/${orderId}`,
  }),

  // Seller order notifications
  newOrder: (orderId: string, buyerName: string) => ({
    type: 'order' as const,
    title: {
      fr: 'Nouvelle commande',
      en: 'New order',
      es: 'Nuevo pedido',
    },
    message: {
      fr: `${buyerName} a passé une commande #${orderId.slice(-8)}`,
      en: `${buyerName} placed an order #${orderId.slice(-8)}`,
      es: `${buyerName} realizó un pedido #${orderId.slice(-8)}`,
    },
    link: `/seller/orders/${orderId}`,
  }),

  // Message notifications
  newMessage: (senderName: string, conversationId: string) => ({
    type: 'message' as const,
    title: {
      fr: 'Nouveau message',
      en: 'New message',
      es: 'Nuevo mensaje',
    },
    message: {
      fr: `${senderName} vous a envoyé un message`,
      en: `${senderName} sent you a message`,
      es: `${senderName} te envió un mensaje`,
    },
    link: `/messages/${conversationId}`,
  }),

  // Review notifications
  newReview: (productName: string, rating: number, productId: string) => ({
    type: 'review' as const,
    title: {
      fr: 'Nouvel avis',
      en: 'New review',
      es: 'Nueva reseña',
    },
    message: {
      fr: `Votre produit "${productName}" a reçu un avis ${rating}★`,
      en: `Your product "${productName}" received a ${rating}★ review`,
      es: `Su producto "${productName}" recibió una reseña de ${rating}★`,
    },
    link: `/seller/products/${productId}`,
  }),

  // Product notifications
  productOutOfStock: (productName: string, productId: string) => ({
    type: 'product' as const,
    title: {
      fr: 'Produit en rupture',
      en: 'Product out of stock',
      es: 'Producto agotado',
    },
    message: {
      fr: `Votre produit "${productName}" est en rupture de stock`,
      en: `Your product "${productName}" is out of stock`,
      es: `Su producto "${productName}" está agotado`,
    },
    link: `/seller/products/${productId}`,
  }),

  productLowStock: (productName: string, stock: number, productId: string) => ({
    type: 'product' as const,
    title: {
      fr: 'Stock faible',
      en: 'Low stock',
      es: 'Stock bajo',
    },
    message: {
      fr: `Votre produit "${productName}" a un stock faible (${stock} restants)`,
      en: `Your product "${productName}" has low stock (${stock} remaining)`,
      es: `Su producto "${productName}" tiene stock bajo (${stock} restantes)`,
    },
    link: `/seller/products/${productId}`,
  }),
};
