const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-black text-foreground mb-8">Terms of Service</h1>
      
      <div className="space-y-6 text-foreground/80">
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">Agreement to Terms</h2>
          <p>
            By accessing and using dawntik's video download service, you agree to be bound by these 
            Terms of Service. If you do not agree to these terms, please do not use our service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">Use of Service</h2>
          <p className="mb-2">You agree to use our service only for lawful purposes. You must not:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Download content that you do not have the right to download</li>
            <li>Violate any intellectual property rights of content creators</li>
            <li>Use the service to distribute or share copyrighted content without permission</li>
            <li>Attempt to circumvent any security measures or rate limits</li>
            <li>Use automated systems or bots to access the service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">Intellectual Property</h2>
          <p>
            All content downloaded through our service remains the property of the original content creators. 
            We do not claim any ownership rights over the videos you download. You are responsible for 
            ensuring that your use of downloaded content complies with applicable copyright laws and 
            the terms of service of the source platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">Personal Use Only</h2>
          <p>
            Our service is intended for personal, non-commercial use only. You may download videos for 
            your own viewing purposes, but you may not redistribute, sell, or use downloaded content 
            for commercial purposes without obtaining proper permissions from the copyright holders.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">Service Availability</h2>
          <p>
            We strive to maintain high availability of our service, but we do not guarantee uninterrupted 
            access. We reserve the right to modify, suspend, or discontinue the service at any time 
            without prior notice. We are not liable for any service interruptions or limitations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">Disclaimer of Warranties</h2>
          <p>
            Our service is provided "as is" without any warranties, express or implied. We do not 
            guarantee the accuracy, completeness, or quality of any content downloaded through our service. 
            We are not responsible for any errors, interruptions, or defects in the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, dawntik and its operators shall not be liable for 
            any indirect, incidental, special, consequential, or punitive damages arising from your 
            use of the service. This includes, but is not limited to, damages for loss of data, 
            revenue, or profits.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">Third-Party Content</h2>
          <p>
            We are not affiliated with TikTok or any other video platform. We simply provide a tool 
            to access publicly available content. We are not responsible for the content, accuracy, 
            or legality of videos downloaded through our service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless dawntik and its operators from any claims, 
            damages, or expenses arising from your use of the service or violation of these terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. Changes will be effective 
            immediately upon posting. Your continued use of the service after changes are posted 
            constitutes acceptance of the modified terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">Governing Law</h2>
          <p>
            These Terms of Service shall be governed by and construed in accordance with applicable 
            laws, without regard to conflict of law provisions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-foreground mb-3">Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:{" "}
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

export default TermsOfService;
