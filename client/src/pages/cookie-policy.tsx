import React from "react";

export default function CookiePolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl" data-testid="page-cookie-policy">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
        
        <p className="text-muted-foreground mb-6">
          <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">What Are Cookies?</h3>
          <p className="text-blue-700">
            Cookies are small text files that are placed on your device when you visit our website. 
            They help us provide you with a better user experience and analyze how our platform is used.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. How We Use Cookies</h2>
        <p className="mb-4">Block Theory uses cookies for the following purposes:</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Essential Cookies (Required)</h3>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-700 mb-2">These cookies are necessary for the platform to function properly:</p>
          <ul className="list-disc pl-6 space-y-1 text-green-700">
            <li>Authentication and session management</li>
            <li>Security and fraud prevention</li>
            <li>Platform functionality and features</li>
            <li>User preferences and settings</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Analytics Cookies (Optional)</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-yellow-700 mb-2">These cookies help us understand how users interact with our platform:</p>
          <ul className="list-disc pl-6 space-y-1 text-yellow-700">
            <li>Page views and user navigation patterns</li>
            <li>Popular content and features</li>
            <li>Platform performance and error tracking</li>
            <li>User engagement and learning progress</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Preference Cookies (Optional)</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-700 mb-2">These cookies remember your choices and personalize your experience:</p>
          <ul className="list-disc pl-6 space-y-1 text-blue-700">
            <li>Language and region preferences</li>
            <li>Theme and display settings</li>
            <li>Customized dashboard layouts</li>
            <li>Notification preferences</li>
          </ul>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Third-Party Cookies</h2>
        <p className="mb-4">We may use third-party services that set their own cookies:</p>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Service</th>
                <th className="px-4 py-2 text-left font-semibold">Purpose</th>
                <th className="px-4 py-2 text-left font-semibold">Cookie Type</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2">Stripe</td>
                <td className="px-4 py-2">Payment processing and fraud prevention</td>
                <td className="px-4 py-2">Essential</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Google Analytics</td>
                <td className="px-4 py-2">Website analytics and performance</td>
                <td className="px-4 py-2">Analytics</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2">Content Delivery Network</td>
                <td className="px-4 py-2">Fast content delivery and performance</td>
                <td className="px-4 py-2">Essential</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Cookie Duration</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
          <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until manually deleted</li>
          <li><strong>Essential Cookies:</strong> Typically last for the duration of your session</li>
          <li><strong>Analytics Cookies:</strong> Usually expire after 1-2 years</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Managing Your Cookie Preferences</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Platform Settings</h3>
        <div className="bg-gray-50 border rounded-lg p-4 mb-4">
          <p className="mb-2">You can manage your cookie preferences through your account settings:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Go to Account Settings → Privacy</li>
            <li>Choose your cookie preferences</li>
            <li>Save your settings</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">Browser Settings</h3>
        <p className="mb-4">You can also control cookies through your browser settings:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
          <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
          <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
          <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
        </ul>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 my-6">
          <h3 className="text-lg font-semibold text-orange-800 mb-2">⚠️ Important Note</h3>
          <p className="text-orange-700">
            Disabling essential cookies may affect platform functionality. Some features may not work properly 
            without these cookies. Analytics and preference cookies can be disabled without affecting core functionality.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Cookie Consent</h2>
        <p className="mb-4">
          When you first visit Block Theory, you'll see a cookie consent banner. You can:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Accept all cookies for the full experience</li>
          <li>Customize your preferences</li>
          <li>Accept only essential cookies</li>
          <li>Change your preferences at any time in account settings</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Data Protection</h2>
        <p className="mb-4">
          Cookie data is protected using the same security measures as other personal information. 
          We do not share cookie data with unauthorized third parties and use it only for the 
          purposes described in this policy.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Updates to This Policy</h2>
        <p className="mb-4">
          We may update this Cookie Policy to reflect changes in our practices or applicable laws. 
          We'll notify you of significant changes and update the effective date at the top of this page.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact Us</h2>
        <p className="mb-4">
          If you have questions about our use of cookies or this policy, please contact us:
        </p>
        <div className="bg-gray-50 border rounded-lg p-4">
          <p><strong>Email:</strong> privacy@blocktheory.io</p>
          <p><strong>Subject:</strong> Cookie Policy Inquiry</p>
          <p><strong>Address:</strong> [Your Business Address]</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-8">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Educational Platform Reminder</h3>
          <p className="text-red-700">
            Remember that Block Theory is an educational platform for learning about cryptocurrency trading. 
            All trading activities are simulated and for educational purposes only.
          </p>
        </div>
      </div>
    </div>
  );
}