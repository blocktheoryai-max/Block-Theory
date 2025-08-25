import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl" data-testid="page-privacy-policy">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <p className="text-muted-foreground mb-6">
          <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">GDPR Compliance Notice</h3>
          <p className="text-blue-700">
            This privacy policy complies with the General Data Protection Regulation (GDPR) and other applicable privacy laws. 
            If you are a resident of the European Union, you have specific rights regarding your personal data as outlined below.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Personal Information</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Account information (name, email address, username)</li>
          <li>Payment information (processed securely through Stripe)</li>
          <li>Profile information you choose to provide</li>
          <li>Communication preferences and subscription settings</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Usage Data</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Learning progress and course completion data</li>
          <li>Simulated trading activity and portfolio data</li>
          <li>Platform interaction and navigation patterns</li>
          <li>Device information and technical data</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Cookies and Tracking</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Essential cookies for platform functionality</li>
          <li>Analytics cookies to improve user experience</li>
          <li>Preference cookies to remember your settings</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide and maintain our educational services</li>
          <li>Process payments and manage subscriptions</li>
          <li>Track learning progress and provide personalized recommendations</li>
          <li>Send important account and service notifications</li>
          <li>Improve our platform and develop new features</li>
          <li>Ensure platform security and prevent fraud</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Information Sharing</h2>
        <p className="mb-4">We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Service Providers:</strong> Trusted partners who help us operate our platform (Stripe for payments, hosting providers)</li>
          <li><strong>Legal Requirements:</strong> When required by law, regulation, or valid legal process</li>
          <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          <li><strong>Safety and Security:</strong> To protect the rights, property, or safety of our users or others</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Your Rights (GDPR)</h2>
        <p className="mb-4">If you are a EU resident, you have the following rights:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Right of Access:</strong> Request copies of your personal data</li>
          <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data</li>
          <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
          <li><strong>Right to Restrict Processing:</strong> Request restriction of processing your data</li>
          <li><strong>Right to Data Portability:</strong> Request transfer of your data to another service</li>
          <li><strong>Right to Object:</strong> Object to processing of your data for certain purposes</li>
          <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
        <p className="mb-4">We implement appropriate technical and organizational measures to protect your personal information:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Encryption of data in transit and at rest</li>
          <li>Regular security assessments and monitoring</li>
          <li>Access controls and authentication measures</li>
          <li>Secure payment processing through Stripe</li>
          <li>Regular software updates and security patches</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Data Retention</h2>
        <p className="mb-4">We retain your personal information for as long as necessary to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide our services to you</li>
          <li>Comply with legal obligations</li>
          <li>Resolve disputes and enforce agreements</li>
          <li>Maintain learning progress and historical data for your benefit</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. International Data Transfers</h2>
        <p className="mb-4">
          Your data may be transferred to and processed in countries other than your residence. 
          We ensure appropriate safeguards are in place for such transfers, including:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Adequacy decisions by the European Commission</li>
          <li>Standard contractual clauses approved by the European Commission</li>
          <li>Certification schemes and codes of conduct</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Children's Privacy</h2>
        <p className="mb-4">
          Our platform is not intended for children under 16 years of age. We do not knowingly collect 
          personal information from children under 16. If you become aware that a child has provided 
          us with personal information, please contact us immediately.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. We will notify you of any material 
          changes by posting the new policy on this page and updating the effective date. 
          Your continued use of our platform after changes constitutes acceptance of the new policy.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy or wish to exercise your rights, 
          please contact us at:
        </p>
        <div className="bg-gray-50 border rounded-lg p-4">
          <p><strong>Email:</strong> privacy@blocktheory.io</p>
          <p><strong>Address:</strong> [Your Business Address]</p>
          <p><strong>Data Protection Officer:</strong> dpo@blocktheory.io</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-8">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Important Crypto Trading Disclaimer</h3>
          <p className="text-red-700">
            Block Theory provides educational content only. All information is for educational purposes and 
            should not be considered as financial, investment, or trading advice. Cryptocurrency trading 
            involves substantial risk of loss and is not suitable for every investor.
          </p>
        </div>
      </div>
    </div>
  );
}