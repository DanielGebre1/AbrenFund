import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground">
              Last Updated: April 9, 2025
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
            <p>
              AbrenFund ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our website, 
              services, and applications (collectively, the "Services").
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-bold mt-6 mb-3">2.1 Personal Information</h3>
            <p>
              We may collect personal information that you provide to us, such as:
            </p>
            <ul className="list-disc pl-6">
              <li>Name, email address, and contact information</li>
              <li>University affiliation and student/faculty ID</li>
              <li>Payment information (processed securely through our payment processors)</li>
              <li>Profile information, including photos and biographical details</li>
              <li>Information about the Campaigns you create or support</li>
            </ul>
            
            <h3 className="text-xl font-bold mt-6 mb-3">2.2 Usage Information</h3>
            <p>
              We may automatically collect certain information about your use of the Services, including:
            </p>
            <ul className="list-disc pl-6">
              <li>IP address and device information</li>
              <li>Browser type and operating system</li>
              <li>Pages you view and links you click</li>
              <li>Time spent on the Services</li>
              <li>Referral source</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">3. How We Use Your Information</h2>
            <p>
              We may use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc pl-6">
              <li>Providing, maintaining, and improving the Services</li>
              <li>Processing transactions and sending related information</li>
              <li>Verifying your university affiliation</li>
              <li>Communicating with you about Campaigns and the Services</li>
              <li>Responding to your inquiries and providing customer support</li>
              <li>Analyzing usage patterns and optimizing the Services</li>
              <li>Protecting against fraudulent or unauthorized activity</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">4. Information Sharing</h2>
            <p>
              We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6">
              <li>With service providers who help us operate the Services</li>
              <li>With Campaign Creators if you back their Campaign</li>
              <li>With Wollo University administration for verification purposes</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and the safety of users</li>
              <li>In connection with a business transaction, such as a merger or acquisition</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your information. 
              However, no method of transmission over the Internet or electronic storage is 100% secure, 
              and we cannot guarantee absolute security.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">6. Your Rights</h2>
            <p>
              You have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6">
              <li>Accessing and updating your information</li>
              <li>Requesting deletion of your information</li>
              <li>Objecting to certain processing activities</li>
              <li>Withdrawing consent for optional processing</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided below.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">7. Cookies and Similar Technologies</h2>
            <p>
              We use cookies and similar technologies to enhance your experience with the Services. 
              You can manage your cookie preferences through your browser settings.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">8. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. If we make material changes, 
              we will notify you through the Services or by other means.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">9. Contact Information</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at privacy@abrenfund.edu.et.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;