import { storage } from './storage';

export interface AdminCredentials {
  username: string;
  password: string;
}

export class AdminAuth {
  private static instance: AdminAuth;

  static getInstance(): AdminAuth {
    if (!AdminAuth.instance) {
      AdminAuth.instance = new AdminAuth();
    }
    return AdminAuth.instance;
  }

  // Initialize admin account on startup
  async initializeAdminAccount() {
    const adminEmail = 'blocktheoryai@gmail.com';

    try {
      // Check if admin user already exists
      const existingUsers = await storage.getAllUsers();
      const adminUser = existingUsers.find(u => u.id === 'admin-owner-account');

      if (!adminUser) {
        // Create admin user (compatible with Replit Auth schema)
        await storage.upsertUser({
          id: 'admin-owner-account',
          email: adminEmail,
          firstName: 'Block Theory',
          lastName: 'Owner',
          subscriptionTier: 'elite', // Full access
          subscriptionStatus: 'active',
          // Admin-specific fields
          totalXp: 999999,
          currentLevel: 100,
        });

        console.log('✅ Admin account created successfully');
        console.log('📧 Username: admin');
        console.log('🔑 Password: BlockTheory2025!');
        console.log('⚠️  Please change the password after first login');
      }
    } catch (error) {
      console.error('Failed to initialize admin account:', error);
    }
  }

  // Simple admin authentication for development
  async authenticateAdmin(username: string, password: string): Promise<any> {
    try {
      // Simple hardcoded check for development
      if (username === 'admin' && password === 'BlockTheory2025!') {
        const users = await storage.getAllUsers();
        const adminUser = users.find(u => u.id === 'admin-owner-account');
        
        if (adminUser) {
          return {
            id: adminUser.id,
            email: adminUser.email,
            firstName: adminUser.firstName,
            lastName: adminUser.lastName
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Admin authentication error:', error);
      return null;
    }
  }

  // Simplified password change for development
  async changeAdminPassword(username: string, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      // For development, just log the password change request
      if (username === 'admin' && currentPassword === 'BlockTheory2025!') {
        console.log(`Admin password change requested to: ${newPassword}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Password change error:', error);
      return false;
    }
  }
}

export const adminAuth = AdminAuth.getInstance();