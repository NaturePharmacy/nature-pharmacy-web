import { APIRequestContext } from '@playwright/test';

/**
 * Helper functions for creating test data via API.
 * Used in beforeEach/beforeAll to set up preconditions.
 */

export async function getProducts(api: APIRequestContext, params: Record<string, string> = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`/api/products?${query}`);
  return res.json();
}

export async function getProductById(api: APIRequestContext, id: string) {
  const res = await api.get(`/api/products/${id}`);
  return res.json();
}

export async function getCategories(api: APIRequestContext) {
  const res = await api.get('/api/categories');
  return res.json();
}

export async function getSellerProducts(api: APIRequestContext) {
  const res = await api.get('/api/seller/products');
  return res.json();
}

export async function getSellerStats(api: APIRequestContext) {
  const res = await api.get('/api/seller/stats');
  return res.json();
}

export async function getOrders(api: APIRequestContext) {
  const res = await api.get('/api/orders');
  return res.json();
}

export async function getWishlist(api: APIRequestContext) {
  const res = await api.get('/api/wishlist');
  return res.json();
}

export async function addToWishlist(api: APIRequestContext, productId: string) {
  const res = await api.post('/api/wishlist', { data: { productId } });
  return res.json();
}

export async function validateCoupon(api: APIRequestContext, code: string) {
  const res = await api.post('/api/coupons/validate', { data: { code } });
  return res.json();
}

export async function getNotifications(api: APIRequestContext) {
  const res = await api.get('/api/notifications');
  return res.json();
}

export async function getUserProfile(api: APIRequestContext) {
  const res = await api.get('/api/user/profile');
  return res.json();
}
