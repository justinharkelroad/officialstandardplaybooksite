
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
    
    // Add noindex for /thechallenge
    if (pathname === '/thechallenge') {
      updateMetaTag('robots', 'noindex,nofollow', 'name');
    }
    
    // Update meta description
    updateMetaTag('description', finalConfig.description);
    
    // Update keywords
    if (finalConfig.keywords) {
      updateMetaTag('keywords', finalConfig.keywords.join(', '));
    }
    
    // Update Open Graph tags
    updateMetaTag('og:title', finalConfig.title, 'property');
    updateMetaTag('og:description', finalConfig.description, 'property');
    updateMetaTag('og:type', finalConfig.type || 'website', 'property');
    updateMetaTag('og:url', `https://standardplaybook.com${pathname}`, 'property');
    
    if (finalConfig.ogImage) {
      updateMetaTag('og:image', finalConfig.ogImage, 'property');
    }
    
    // Update Twitter Card tags
    updateMetaTag('twitter:title', finalConfig.title, 'name');
    updateMetaTag('twitter:description', finalConfig.description, 'name');
    if (finalConfig.ogImage) {
      updateMetaTag('twitter:image', finalConfig.ogImage, 'name');
    }
    
    // Update canonical URL
    updateCanonicalUrl(`https://standardplaybook.com${pathname}`);
    
    // Add structured data
    if (finalConfig.structuredData) {
      updateStructuredData(finalConfig.structuredData);
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

const updateStructuredData = (data: any) => {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }
  
  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};
