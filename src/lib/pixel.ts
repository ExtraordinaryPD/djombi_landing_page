export const FB_PIXEL_ID = process.env.FB_PIXEL_ID!
export const LINKEDIN_PARTNER_ID = process.env.LINKEDIN_PARTNER_ID!

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    lintrk: (...args: any[]) => void;
  }
}

// Meta Pixel functions
export const pageview = () => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "PageView");
  }
};

export const event = (name: string, options: Record<string, any> = {}) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", name, options);
  }
};

// LinkedIn Pixel functions
export const linkedinPageview = () => {
  if (typeof window !== "undefined" && window.lintrk) {
    window.lintrk("track", { conversion_id: LINKEDIN_PARTNER_ID });
  }
};

export const linkedinEvent = (
  conversionId: string,
  options: Record<string, any> = {}
) => {
  if (typeof window !== "undefined" && window.lintrk) {
    window.lintrk("track", { conversion_id: conversionId, ...options });
  }
};
