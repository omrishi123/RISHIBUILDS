
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 container mx-auto py-12 px-4 md:px-6">
        <div className="prose prose-lg max-w-4xl mx-auto">
          <h1>Terms of Service</h1>

          <h2>1. Terms</h2>
          <p>By accessing the website at RishiBuilds, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.</p>

          <h2>2. Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials (information or software) on RishiBuilds's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose, or for any public display (commercial or non-commercial); attempt to decompile or reverse engineer any software contained on RishiBuilds's website; remove any copyright or other proprietary notations from the materials; or transfer the materials to another person or "mirror" the materials on any other server.</p>

          <h2>3. Disclaimer</h2>
          <p>The materials on RishiBuilds's website are provided on an 'as is' basis. RishiBuilds makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

          <h2>4. Limitations</h2>
          <p>In no event shall RishiBuilds or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on RishiBuilds's website, even if RishiBuilds or a RishiBuilds authorized representative has been notified orally or in writing of the possibility of such damage.</p>

          <h2>5. Governing Law</h2>
          <p>These terms and conditions are governed by and construed in accordance with the laws of our state and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
