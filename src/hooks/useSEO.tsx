
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { seoConfig, SEOConfig } from '@/data/seoConfig';

export const useSEO = (customConfig?: Partial<SEOConfig>) => {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    const config = seoConfig[pathname] || seoConfig['/'];
    const finalConfig = { ...config, ...customConfig };

    // Update document title
    document.title = finalConfig.title;

    // Handle noindex pages
    if (finalConfig.noindex) {
      updateMetaTag('robots', 'noindex,nofollow', 'name');
    } else {
      updateMetaTag('robots', 'index, follow', 'name');
    }

    // Update meta description
    updateMetaTag('description', finalConfig.description);

    // Update keywords
    if (finalConfig.keywords && finalConfig.keywords.length > 0) {
      updateMetaTag('keywords', finalConfig.keywords.join(', '));
    }

    // Update Open Graph tags
    updateMetaTag('og:title', finalConfig.title, 'property');
    updateMetaTag('og:description', finalConfig.description, 'property');
    updateMetaTag('og:type', finalConfig.type || 'website', 'property');
    const pageUrl = `https://standardplaybook.com${pathname === '/' ? '' : pathname}`;
    updateMetaTag('og:url', pageUrl, 'property');

    const ogImage = finalConfig.ogImage || 'https://standardplaybook.com/og-image.png';
    updateMetaTag('og:image', ogImage, 'property');

    // Update Twitter Card tags
    updateMetaTag('twitter:title', finalConfig.title, 'name');
    updateMetaTag('twitter:description', finalConfig.description, 'name');
    updateMetaTag('twitter:image', ogImage, 'name');

    // Update canonical URL — self-referencing per page
    const canonicalUrl = finalConfig.canonical || `https://standardplaybook.com${pathname === '/' ? '' : pathname}`;
    updateCanonicalUrl(canonicalUrl);

    // Add per-page structured data (dynamic schemas from seoConfig)
    if (finalConfig.structuredData && finalConfig.structuredData.length > 0) {
      updateStructuredData(finalConfig.structuredData);
    } else {
      // Remove any previously added dynamic schemas
      removeDynamicStructuredData();
    }

  }, [location.pathname, customConfig]);

  return null;
};

const updateMetaTag = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.content = content;
};

const updateCanonicalUrl = (url: string) => {
  let element = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }

  element.href = url;
};

const updateStructuredData = (dataArray: object[]) => {
  // Remove previously added dynamic schemas (marked with data-dynamic)
  removeDynamicStructuredData();

  // Add each schema block as a separate script tag
  dataArray.forEach((data) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-dynamic', 'true');
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  });
};

const removeDynamicStructuredData = () => {
  document.querySelectorAll('script[type="application/ld+json"][data-dynamic="true"]').forEach((el) => {
    el.remove();
  });
};
