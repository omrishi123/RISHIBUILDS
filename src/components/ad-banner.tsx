'use client';

// A simple component to display an ad banner.
export function AdBanner() {
  // IMPORTANT: Replace the HTML string below with the ad code you received from your ad provider (like A-Ads).
  const adCode = `
    <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 90px; background-color: #f0f0f0; border: 1px dashed #ccc; border-radius: 8px;">
      <p style="color: #666; font-family: sans-serif;">Your 728x90 Ad Banner Here</p>
    </div>
  `;

  return (
    <div 
      className="my-8 w-full flex justify-center"
      dangerouslySetInnerHTML={{ __html: adCode }} 
    />
  );
}
