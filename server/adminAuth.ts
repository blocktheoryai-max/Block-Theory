import bcrypt from 'bcryptjs';
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
    const adminUsername = 'admin';
    const adminPassword = 'BlockTheory2025!'; // Strong default password
    const adminEmail = 'blocktheoryai@gmail.com';

    try {
      // Check if admin user already exists
      const existingUsers = await storage.getAllUsers();
      const adminUser = existingUsers.find(u => u.username === adminUsername);

      if (!adminUser) {
        // Hash the password
        const hashedPassword = await bcrypt.hash(adminPassword, 12);

        // Create admin user
        await storage.upsertUser({
          id: 'admin-owner-account',
          username: adminUsername,
          email: adminEmail,
          password: hashedPassword,
          firstName: 'Block Theory',
          lastName: 'Owner',
          subscriptionTier: 'elite', // Full access
          subscriptionStatus: 'active',
          // Admin-specific fields
          totalXp: 999999,
          currentLevel: 100,
        });

        console.log('✅ Admin account created successfully');
        console.log(`📧 Username: ${adminUsername}`);
        console.log(`🔑 Password: ${adminPassword}`);
        console.log('⚠️  Please change the password after first login');
      }
    } catch (error) {
      console.error('Failed to initialize admin account:', error);
    }
  }

  // Authenticate admin user
  async authenticateAdmin(username: string, password: string): Promise<any> {
    try {
      const users = await storage.getAllUsers();
      const user = users.find(u => u.username === username);

      if (!user || !user.password) {
        return null;
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return null;
      }

      // Return user data (excluding password)
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Admin authentication error:', error);
      return null;
    }
  }

  // Change admin password
  async changeAdminPassword(username: string, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const users = await storage.getAllUsers();
      const user = users.find(u => u.username === username);

      if (!user || !user.password) {
        return false;
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return false;
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // Update user
      await storage.upsertUser({
        ...user,
        password: hashedNewPassword,
      });

      return true;
    } catch (error) {
      console.error('Failed to change admin password:', error);
      return false;
    }
  }
}

export const adminAuth = AdminAuth.getInstance();