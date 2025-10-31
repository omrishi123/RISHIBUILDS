'use client';

// A simple component to display an ad banner.
export function AdBanner() {
  // IMPORTANT: This now contains your live ad code.
  const adCode = `
    <div id="frame" style="width: 100%;margin: auto;position: relative; z-index: 99998;">
      <iframe data-aa='2415571' src='//acceptable.a-ads.com/2415571/?size=Adaptive'
                        style='border:0; padding:0; width:70%; height:auto; overflow:hidden;display: block;margin: auto'></iframe>
    </div>
  `;

  return (
    <div 
      className="my-8 w-full flex justify-center"
      dangerouslySetInnerHTML={{ __html: adCode }} 
    />
  );
}
