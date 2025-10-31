'use client';

/**
 * A component to display a sticky ad banner across the site.
 * It uses dangerouslySetInnerHTML to render the raw HTML and CSS provided for the ad code.
 */
export function StickyAdBanner() {
  const adCode = `
    <div style="position: fixed; z-index: 99999; top: 0; right: 0; width: 15%; height: 100%; min-width: 100px;">
      <input autocomplete="off" type="checkbox" id="aadsstickymhf5jl90" hidden />
      <div style="width:100%;height:100%;position:relative;text-align:center;font-size:0;">
        <label for="aadsstickymhf5jl90" style="bottom: 24px;margin:0 auto;right:0;left:0;max-width:24px; position: absolute;border-radius: 4px; background: rgba(248, 248, 249, 0.70); padding: 4px;z-index: 99999;cursor:pointer">
          <svg fill="#000000" height="16px" width="16px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490 490">
            <polygon points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490 489.292,457.678 277.331,245.004 489.292,32.337 "/>
          </svg>
        </label>
        <div id="frame" style="width: 100%;margin: auto;position: relative; z-index: 99998;height:100%; display: flex;flex-direction: column; justify-content: center">
            <iframe data-aa='2415574' src='//acceptable.a-ads.com/2415574/?size=Adaptive' style='border:0; padding:0; width:70%; height:70%; overflow:hidden; margin: 0 auto'></iframe>
        </div>
      </div>
      <style>
        #aadsstickymhf5jl90:checked + div {
          display: none;
        }
      </style>
    </div>
  `;

  return <div dangerouslySetInnerHTML={{ __html: adCode }} />;
}
