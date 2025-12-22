/**
 * Central model registry to ensure all models are loaded together
 * This prevents MissingSchemaError in development with hot reloading
 */

import Category from '@/models/Category';
import Product from '@/models/Product';
import User from '@/models/User';
import Order from '@/models/Order';
import Review from '@/models/Review';
import ShippingZone from '@/models/ShippingZone';

// Export all models
export { Category, Product, User, Order, Review, ShippingZone };

// Re-export default (you can import any model as default)
export default {
  Category,
  Product,
  User,
  Order,
  Review,
  ShippingZone,
};
