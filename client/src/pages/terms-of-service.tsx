import React from "react";

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl" data-testid="page-terms-of-service">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <p className="text-muted-foreground mb-6">
          <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">⚠️ IMPORTANT FINANCIAL DISCLAIMER</h3>
          <p className="text-red-700 font-medium">
            Block Theory is an educational platform only. We do not provide financial, investment, or trading advice. 
            All content is for educational purposes. Cryptocurrency trading involves substantial risk of loss. 
            Never invest more than you can afford to lose.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing and using Block Theory ("the Platform", "our service", "we", "us"), you accept and agree to be bound by the terms and provision of this agreement. 
          If you do not agree to these terms, please do not use our platform.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description of Service</h2>
        <p className="mb-4">Block Theory provides:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Educational content about cryptocurrency and blockchain technology</li>
          <li>Simulated trading environment for learning purposes</li>
          <li>AI-powered analysis tools for educational use</li>
          <li>Community features for learning and discussion</li>
          <li>Market analysis tools and resources</li>
        </ul>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
          <p className="text-yellow-800 font-medium">
            <strong>Important:</strong> All trading on our platform is simulated and educational. 
            No real money or cryptocurrency is involved in our trading simulator.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Educational Purpose Only</h2>
        <p className="mb-4">
          <strong>Block Theory is strictly for educational purposes.</strong> Our platform provides:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Educational content about cryptocurrency markets</li>
          <li>Simulated trading experiences using virtual funds</li>
          <li>Analysis tools for learning market behavior</li>
          <li>Historical data and market information for educational use</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Not Financial Advice</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">
            <strong>NOTHING ON THIS PLATFORM CONSTITUTES FINANCIAL, INVESTMENT, OR TRADING ADVICE.</strong>
            All information, tools, and content are provided for educational purposes only. 
            You should consult with a licensed financial advisor before making any investment decisions.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Risk Warnings</h2>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-orange-800 mb-2">Cryptocurrency Trading Risks</h3>
          <ul className="list-disc pl-6 space-y-1 text-orange-700">
            <li>Cryptocurrency markets are extremely volatile and unpredictable</li>
            <li>You may lose some or all of your invested capital</li>
            <li>Past performance does not guarantee future results</li>
            <li>Regulatory changes may impact cryptocurrency values</li>
            <li>Technical issues may affect market access and trading</li>
            <li>Cryptocurrency investments are not insured or guaranteed</li>
          </ul>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. User Responsibilities</h2>
        <p className="mb-4">By using our platform, you agree to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Use the platform for educational purposes only</li>
          <li>Provide accurate and truthful information</li>
          <li>Maintain the confidentiality of your account credentials</li>
          <li>Not attempt to manipulate or exploit platform features</li>
          <li>Respect other users and maintain professional conduct</li>
          <li>Not use the platform for any illegal activities</li>
          <li>Understand that simulated trading results do not guarantee real trading success</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Subscription and Payments</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Subscription fees are charged monthly or annually as selected</li>
          <li>Payments are processed securely through Stripe</li>
          <li>Subscriptions automatically renew unless cancelled</li>
          <li>Refunds are provided according to our refund policy</li>
          <li>We may change subscription prices with 30 days notice</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Intellectual Property</h2>
        <p className="mb-4">
          All content, trademarks, and intellectual property on Block Theory are owned by us or our licensors. 
          You may not copy, reproduce, distribute, or create derivative works without our written permission.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. User-Generated Content</h2>
        <p className="mb-4">
          When you post content on our platform (comments, forum posts, etc.), you grant us a non-exclusive, 
          royalty-free license to use, modify, and display that content. You remain responsible for your content 
          and must ensure it doesn't violate any laws or rights of others.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Prohibited Uses</h2>
        <p className="mb-4">You may not use our platform to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide financial advice to other users</li>
          <li>Promote specific cryptocurrency investments</li>
          <li>Share referral links or promotional codes for trading platforms</li>
          <li>Manipulate or exploit platform features</li>
          <li>Harass, abuse, or harm other users</li>
          <li>Post spam, malware, or malicious content</li>
          <li>Violate any applicable laws or regulations</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">11. Platform Availability</h2>
        <p className="mb-4">
          We strive to maintain platform availability but cannot guarantee uninterrupted service. 
          We may temporarily suspend or limit access for maintenance, updates, or technical issues.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">12. Limitation of Liability</h2>
        <div className="bg-gray-50 border rounded-lg p-4 mb-6">
          <p className="font-medium">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, BLOCK THEORY SHALL NOT BE LIABLE FOR ANY 
            INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE PLATFORM, 
            INCLUDING BUT NOT LIMITED TO TRADING LOSSES, INVESTMENT DECISIONS, OR DATA LOSS.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">13. Indemnification</h2>
        <p className="mb-4">
          You agree to indemnify and hold Block Theory harmless from any claims, damages, or expenses 
          arising from your use of the platform, violation of these terms, or infringement of any rights.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">14. Termination</h2>
        <p className="mb-4">
          We may terminate or suspend your account at any time for violation of these terms. 
          You may cancel your subscription at any time through your account settings.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">15. Governing Law</h2>
        <p className="mb-4">
          These terms are governed by the laws of [Your Jurisdiction]. Any disputes will be resolved 
          in the courts of [Your Jurisdiction].
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">16. Changes to Terms</h2>
        <p className="mb-4">
          We may update these terms at any time. Material changes will be communicated via email 
          or platform notification. Continued use after changes constitutes acceptance of new terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">17. Contact Information</h2>
        <div className="bg-gray-50 border rounded-lg p-4">
          <p><strong>Email:</strong> legal@blocktheory.io</p>
          <p><strong>Address:</strong> [Your Business Address]</p>
          <p><strong>Customer Support:</strong> support@blocktheory.io</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Final Reminder</h3>
          <p className="text-blue-700">
            Block Theory is an educational platform designed to teach cryptocurrency concepts through simulation. 
            Always do your own research and consult with qualified financial professionals before making 
            investment decisions with real money.
          </p>
        </div>
      </div>
    </div>
  );
}