'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview, FB_PIXEL_ID } from '@/lib/pixel';

export default function FacebookPixel() {
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
        });
    }
  }, []);

  useEffect(() => {
    // Track page changes
    pageview();
  }, [pathname, searchParams]);

  return null;
}