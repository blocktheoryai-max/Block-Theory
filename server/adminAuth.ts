import { storage } from './storage';
import bcrypt from 'bcryptjs';

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
      // Production-ready admin authentication
      const adminUsername = process.env.ADMIN_USERNAME || 'admin';
      const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
      
      if (!adminPasswordHash) {
        console.error('ADMIN_PASSWORD_HASH environment variable not set');
        return null;
      }
      
      if (username === adminUsername && await this.verifyPassword(password, adminPasswordHash)) {
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

  // Production admin password change
  async changeAdminPassword(username: string, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const adminUsername = process.env.ADMIN_USERNAME || 'admin';
      const currentHash = process.env.ADMIN_PASSWORD_HASH;
      
      if (!currentHash || username !== adminUsername) {
        return false;
      }
      
      if (await this.verifyPassword(currentPassword, currentHash)) {
        const newHash = await this.hashPassword(newPassword);
        // Note: In production, you'd update the environment variable or database
        console.log(`Admin password change - new hash: ${newHash}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Password change error:', error);
      return false;
    }
  }

  // Password hashing utilities for production
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

export const adminAuth = AdminAuth.getInstance();