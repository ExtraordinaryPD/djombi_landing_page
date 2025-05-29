'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview, FB_PIXEL_ID } from '@/lib/pixel';

// Separate component that uses search params
function FacebookPixelContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Initialize pixel on mount
    if (typeof window !== 'undefined') {
      import('react-facebook-pixel')
        .then((x) => x.default)
        .then((ReactPixel) => {
          ReactPixel.init(FB_PIXEL_ID);
          ReactPixel.pageView();
        })
        .catch((error) => {
          console.log('Facebook Pixel failed to load:', error);
        });
    }
  }, []);

  useEffect(() => {
    // Track page changes
    try {
      pageview();
    } catch (error) {
      console.log('Pageview tracking failed:', error);
    }
  }, [pathname, searchParams]);

  return null;
}

// Main component with Suspense boundary
export default function FacebookPixel() {
  return (
    <Suspense fallback={null}>
      <FacebookPixelContent />
    </Suspense>
  );
}