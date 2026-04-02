const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-black text-foreground mb-8">Privacy Policy</h1>
      
      <div className="space-y-6 text-foreground/80">
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">Introduction</h2>
          <p>
            Welcome to dawntik. We respect your privacy and are committed to protecting your personal data. 
            This privacy policy explains how we handle your information when you use our TikTok video download service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">Information We Collect</h2>
          <p className="mb-2">When you use our service, we may collect:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Video URLs that you submit for downloading</li>
            <li>Basic usage data and analytics to improve our service</li>
            <li>Device information and browser type</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">How We Use Your Information</h2>
          <p className="mb-2">We use the collected information to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Process your video download requests</li>
            <li>Improve and optimize our service</li>
            <li>Monitor and analyze usage patterns</li>
            <li>Ensure the security and integrity of our platform</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">Data Storage and Security</h2>
          <p>
            We do not store your downloaded videos on our servers. Video processing happens in real-time, 
            and no permanent copies are kept. We implement appropriate technical and organizational measures 
            to protect your data against unauthorized access, alteration, or destruction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">Third-Party Services</h2>
          <p>
            Our service may interact with third-party platforms (such as TikTok) to fetch video content. 
            We are not responsible for the privacy practices of these third-party services. We encourage 
            you to review their privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">Cookies</h2>
          <p>
            We may use cookies and similar tracking technologies to enhance your experience on our website. 
            You can control cookie preferences through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">Your Rights</h2>
          <p className="mb-2">You have the right to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by 
            posting the new policy on this page with an updated revision date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:{" "}
            <a href="mailto:mhsajidali143@gmail.com" className="text-primary hover:underline">
              mhsajidali143@gmail.com
            </a>
          </p>
        </section>

        <p className="text-sm text-muted-foreground mt-8">
          Last updated: January 2025
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
