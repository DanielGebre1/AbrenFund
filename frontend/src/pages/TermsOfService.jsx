import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-muted-foreground">
              Last Updated: April 9, 2025
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to AbrenFund, the crowdfunding platform for Wollo University. These Terms of Service 
              ("Terms") govern your access to and use of AbrenFund's website, services, and applications 
              (collectively, the "Services"). By accessing or using our Services, you agree to be bound by 
              these Terms and our Privacy Policy.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">2. Definitions</h2>
            <p>
              <strong>"AbrenFund," "we," "us,"</strong> and <strong>"our"</strong> refer to Wollo University's crowdfunding platform.
            </p>
            <p>
              <strong>"User," "you,"</strong> and <strong>"your"</strong> refer to any individual or entity using our Services.
            </p>
            <p>
              <strong>"Campaign"</strong> refers to a fundraising project created on AbrenFund.
            </p>
            <p>
              <strong>"Campaign Creator"</strong> refers to a User who creates a Campaign.
            </p>
            <p>
              <strong>"Backer"</strong> refers to a User who contributes funds to a Campaign.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">3. Account Registration</h2>
            <p>
              To access certain features of the Services, you must register for an account. When you register, 
              you agree to provide accurate, current, and complete information about yourself. You are responsible 
              for maintaining the confidentiality of your account credentials and for all activities that occur 
              under your account.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">4. Campaigns</h2>
            <h3 className="text-xl font-bold mt-6 mb-3">4.1 Creating a Campaign</h3>
            <p>
              Campaign Creators must be affiliated with Wollo University (students, faculty, or staff) and must 
              provide accurate and complete information about their Campaign. Campaign Creators are solely 
              responsible for fulfilling any promises made in their Campaign.
            </p>
            
            <h3 className="text-xl font-bold mt-6 mb-3">4.2 Campaign Review</h3>
            <p>
              All Campaigns are subject to review by AbrenFund. We reserve the right to reject, cancel, or remove 
              any Campaign at any time for any reason.
            </p>
            
            <h3 className="text-xl font-bold mt-6 mb-3">4.3 Funding</h3>
            <p>
              When a Campaign reaches its funding goal, AbrenFund will process the funds and transfer them to the 
              Campaign Creator, less any applicable fees. If a Campaign does not reach its funding goal, all 
              contributions will be returned to the Backers.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">5. Prohibited Activities</h2>
            <p>
              Users may not use the Services to:
            </p>
            <ul className="list-disc pl-6">
              <li>Violate any applicable law or regulation</li>
              <li>Infringe on the intellectual property rights of others</li>
              <li>Create or support Campaigns for illegal activities</li>
              <li>Harass, threaten, or intimidate any person</li>
              <li>Provide false or misleading information</li>
              <li>Distribute malware or other harmful code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
            </ul>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">6. Limitation of Liability</h2>
            <p>
              AbrenFund is not responsible for the actions of Campaign Creators or the content of Campaigns. 
              We do not guarantee that any Campaign will be successful or that Campaign Creators will fulfill 
              their obligations. Our liability is limited to the maximum extent permitted by law.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">7. Termination</h2>
            <p>
              We may terminate or suspend your account at any time for any reason without notice. Upon 
              termination, your right to use the Services will immediately cease.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">8. Changes to Terms</h2>
            <p>
              We may modify these Terms at any time. If we make material changes, we will provide notice 
              through the Services or by other means. Your continued use of the Services after such notice 
              constitutes your acceptance of the modified Terms.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">9. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at support@abrenfund.edu.et.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;