
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 container mx-auto py-12 px-4 md:px-6">
        <div className="prose prose-lg max-w-4xl mx-auto">
          <h1>Privacy Policy</h1>
          <p>Your privacy is important to us. It is RishiBuilds's policy to respect your privacy regarding any information we may collect from you across our website.</p>
          
          <h2>1. Information we collect</h2>
          <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>

          <h2>2. How we use your information</h2>
          <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</p>

          <h2>3. Sharing of information</h2>
          <p>We don’t share any personally identifying information publicly or with third-parties, except when required to by law.</p>

          <h2>4. Links to other sites</h2>
          <p>Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.</p>

          <p>Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us.</p>
          
          <p>This policy is effective as of {new Date().toLocaleDateString()}.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
