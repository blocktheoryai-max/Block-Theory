import sgMail from '@sendgrid/mail';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'blocktheoryai@gmail.com';
const PLATFORM_NAME = 'Block Theory';
const PLATFORM_URL = process.env.REPLIT_DOMAINS?.split(',')[0] ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}` : 'https://blocktheory.com';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private static instance: EmailService;

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!process.env.SENDGRID_API_KEY) {
      console.warn('SendGrid API key not configured. Email not sent:', options.subject);
      return false;
    }

    try {
      await sgMail.send({
        to: options.to,
        from: FROM_EMAIL,
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html),
      });
      
      console.log(`Email sent successfully: ${options.subject} to ${options.to}`);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  // Welcome email for new users
  async sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; }
        .header { background: linear-gradient(135deg, #8B5CF6, #6366F1); padding: 30px; text-align: center; color: white; }
        .content { padding: 30px; background: white; }
        .button { display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to ${PLATFORM_NAME}! 🚀</h1>
          <p>Your journey to crypto mastery begins now</p>
        </div>
        
        <div class="content">
          <h2>Hi ${userName},</h2>
          
          <p>Welcome to <strong>${PLATFORM_NAME}</strong> - the Netflix of crypto education! We're excited to have you join thousands of traders learning to navigate the crypto markets with confidence.</p>
          
          <h3>🎯 What You Get:</h3>
          <ul>
            <li><strong>100+ Professional Lessons</strong> - From beginner basics to expert strategies</li>
            <li><strong>Risk-Free Trading Simulator</strong> - Practice with $10K virtual portfolio</li>
            <li><strong>AI-Powered Analysis Tools</strong> - Whitepaper analyzer & market insights</li>
            <li><strong>Community Forum</strong> - Connect with fellow crypto traders</li>
          </ul>
          
          <h3>🚀 Get Started:</h3>
          <p>Start with our foundation track and unlock your 14-day Pro trial to access advanced features.</p>
          
          <a href="${PLATFORM_URL}/learn" class="button">Start Learning Now</a>
          
          <p>Questions? Reply to this email - we're here to help!</p>
          
          <p>Happy Trading,<br>The ${PLATFORM_NAME} Team</p>
        </div>
        
        <div class="footer">
          <p>${PLATFORM_NAME} - Your Gateway to Crypto Success</p>
          <p><a href="${PLATFORM_URL}/privacy-policy">Privacy Policy</a> | <a href="${PLATFORM_URL}/terms-of-service">Terms of Service</a></p>
        </div>
      </div>
    </body>
    </html>`;

    return this.sendEmail({
      to: userEmail,
      subject: `Welcome to ${PLATFORM_NAME} - Start Your Crypto Journey! 🚀`,
      html,
    });
  }

  // Trial started notification
  async sendTrialStartedEmail(userEmail: string, userName: string, trialEndDate: Date): Promise<boolean> {
    const endDateStr = trialEndDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; }
        .header { background: linear-gradient(135deg, #10B981, #059669); padding: 30px; text-align: center; color: white; }
        .content { padding: 30px; background: white; }
        .button { display: inline-block; background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .highlight { background: #f0fdf4; padding: 20px; border-left: 4px solid #10B981; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your 14-Day Pro Trial is Active! ⭐</h1>
          <p>Unlock advanced features and accelerate your learning</p>
        </div>
        
        <div class="content">
          <h2>Hi ${userName},</h2>
          
          <div class="highlight">
            <h3>🎉 Trial Activated!</h3>
            <p><strong>Your 14-day Pro trial ends on ${endDateStr}</strong></p>
            <p>Full access to all premium features until then!</p>
          </div>
          
          <h3>🚀 Pro Features Now Available:</h3>
          <ul>
            <li><strong>Complete Lesson Library</strong> - All 100+ lessons unlocked</li>
            <li><strong>Advanced Trading Simulator</strong> - $10K virtual portfolio</li>
            <li><strong>Real-time Market Data</strong> - Live prices and alerts</li>
            <li><strong>AI Trading Signals</strong> - Smart market insights</li>
            <li><strong>Priority Support</strong> - Get help when you need it</li>
          </ul>
          
          <a href="${PLATFORM_URL}/learn" class="button">Explore Pro Features</a>
          
          <p>Make the most of your trial - dive into advanced lessons and test strategies in the simulator!</p>
          
          <p>Best regards,<br>The ${PLATFORM_NAME} Team</p>
        </div>
      </div>
    </body>
    </html>`;

    return this.sendEmail({
      to: userEmail,
      subject: `Your ${PLATFORM_NAME} Pro Trial is Now Active! ⭐`,
      html,
    });
  }

  // Subscription confirmation
  async sendSubscriptionConfirmationEmail(userEmail: string, userName: string, planName: string, amount: number, isYearly: boolean): Promise<boolean> {
    const billing = isYearly ? 'annually' : 'monthly';
    const nextBilling = new Date();
    nextBilling.setMonth(nextBilling.getMonth() + (isYearly ? 12 : 1));

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; }
        .header { background: linear-gradient(135deg, #8B5CF6, #6366F1); padding: 30px; text-align: center; color: white; }
        .content { padding: 30px; background: white; }
        .receipt { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Subscription Confirmed! ✅</h1>
          <p>Welcome to ${planName}</p>
        </div>
        
        <div class="content">
          <h2>Hi ${userName},</h2>
          
          <p>Thank you for subscribing to <strong>${PLATFORM_NAME}</strong>! Your ${planName} subscription is now active.</p>
          
          <div class="receipt">
            <h3>📋 Subscription Details</h3>
            <p><strong>Plan:</strong> ${planName}</p>
            <p><strong>Amount:</strong> $${(amount / 100).toFixed(2)} (billed ${billing})</p>
            <p><strong>Next Billing:</strong> ${nextBilling.toLocaleDateString()}</p>
          </div>
          
          <h3>🎯 Your Benefits:</h3>
          <ul>
            <li>Full access to your plan features</li>
            <li>No interruption to your learning journey</li>
            <li>Premium support and updates</li>
            <li>Cancel or modify anytime</li>
          </ul>
          
          <a href="${PLATFORM_URL}/learn" class="button">Continue Learning</a>
          
          <p>Questions about your subscription? Just reply to this email.</p>
          
          <p>Happy Trading,<br>The ${PLATFORM_NAME} Team</p>
        </div>
      </div>
    </body>
    </html>`;

    return this.sendEmail({
      to: userEmail,
      subject: `${PLATFORM_NAME} Subscription Confirmed - ${planName} ✅`,
      html,
    });
  }

  // Trial ending soon notification
  async sendTrialEndingSoonEmail(userEmail: string, userName: string, daysLeft: number): Promise<boolean> {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; }
        .header { background: linear-gradient(135deg, #F59E0B, #D97706); padding: 30px; text-align: center; color: white; }
        .content { padding: 30px; background: white; }
        .button { display: inline-block; background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .warning { background: #fef3cd; padding: 20px; border-left: 4px solid #F59E0B; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Trial Ending Soon ⏰</h1>
          <p>Don't lose access to your Pro features</p>
        </div>
        
        <div class="content">
          <h2>Hi ${userName},</h2>
          
          <div class="warning">
            <h3>⚠️ Your Pro Trial Ends in ${daysLeft} Day${daysLeft > 1 ? 's' : ''}</h3>
            <p>Continue your crypto education journey without interruption</p>
          </div>
          
          <p>Your 14-day Pro trial has been amazing! To keep access to all premium features:</p>
          
          <ul>
            <li>Complete lesson library (100+ lessons)</li>
            <li>Advanced trading simulator</li>
            <li>Real-time market data & signals</li>
            <li>Priority support</li>
          </ul>
          
          <a href="${PLATFORM_URL}/pricing" class="button">Choose Your Plan</a>
          
          <p>Questions? Reply to this email and we'll help you find the perfect plan.</p>
          
          <p>Best regards,<br>The ${PLATFORM_NAME} Team</p>
        </div>
      </div>
    </body>
    </html>`;

    return this.sendEmail({
      to: userEmail,
      subject: `${PLATFORM_NAME} Trial Ends in ${daysLeft} Day${daysLeft > 1 ? 's' : ''} ⏰`,
      html,
    });
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  }
}

export const emailService = EmailService.getInstance();