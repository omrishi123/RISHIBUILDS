
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 container mx-auto py-12 px-4 md:px-6">
        <div className="prose prose-lg max-w-4xl mx-auto">
          <h1>About RishiBuilds</h1>
          <p>
            Welcome to RishiBuilds, your number one source for the latest and greatest application builds. 
            We're dedicated to giving you the very best of apps, with a focus on dependability, 
            customer service, and uniqueness.
          </p>
          <p>
            Founded in {new Date().getFullYear()}, RishiBuilds has come a long way from its beginnings. 
            When we first started out, our passion for providing top-tier application access drove us 
            to do intense research, and gave us the impetus to turn hard work and inspiration into to a booming online portal. 
            We now serve customers all over the world, and are thrilled to be a part of the quirky, 
            eco-friendly, fair trade wing of the tech industry.
          </p>
          <p>
            We hope you enjoy our products as much as we enjoy offering them to you. If you have any 
            questions or comments, please don't hesitate to contact us.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
