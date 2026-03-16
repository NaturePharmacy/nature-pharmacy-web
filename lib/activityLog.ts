import connectDB from '@/lib/mongodb';
import ActivityLog from '@/models/ActivityLog';

interface LogActivityParams {
  adminId: string;
  adminEmail: string;
  adminName: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  resourceLabel?: string;
  before?: Record<string, any>;
  after?: Record<string, any>;
  meta?: Record<string, any>;
  ipAddress?: string;
}

export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    await connectDB();
    await ActivityLog.create(params);
  } catch (err) {
    // Non-blocking — log errors should never crash the main operation
    console.error('[ActivityLog] Failed to write log:', err);
  }
}
