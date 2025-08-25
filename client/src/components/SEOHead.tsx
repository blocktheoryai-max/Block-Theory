import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'video';
  keywords?: string;
}

export function SEOHead({ 
  title, 
  description, 
  canonical,
  ogImage = '/og-image.png',
  ogType = 'website',
  keywords 
}: SEOProps) {
  const siteName = 'Block Theory';
  const baseUrl = window.location.origin;
  const fullTitle = `${title} | ${siteName}`;
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : window.location.href;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Helper function to update meta tag
    const updateMetaTag = (property: string, content: string, useProperty = false) => {
      const selector = useProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
      let tag = document.querySelector(selector) as HTMLMetaElement;
      
      if (!tag) {
        tag = document.createElement('meta');
        if (useProperty) {
          tag.setAttribute('property', property);
        } else {
          tag.setAttribute('name', property);
        }
        document.head.appendChild(tag);
      }
      
      tag.setAttribute('content', content);
    };

    // Basic SEO meta tags
    updateMetaTag('description', description);
    if (keywords) updateMetaTag('keywords', keywords);
    updateMetaTag('author', 'Block Theory Team');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Open Graph tags
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:url', fullCanonical, true);
    updateMetaTag('og:site_name', siteName, true);
    updateMetaTag('og:image', `${baseUrl}${ogImage}`, true);
    updateMetaTag('og:image:width', '1200', true);
    updateMetaTag('og:image:height', '630', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', `${baseUrl}${ogImage}`);

    // Canonical URL
    let canonicalTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.rel = 'canonical';
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.href = fullCanonical;

    // Structured data for cryptocurrency education
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": siteName,
      "description": description,
      "url": baseUrl,
      "logo": `${baseUrl}/logo.png`,
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Support",
        "email": "blocktheoryai@gmail.com"
      },
      "offers": {
        "@type": "Offer",
        "category": "Educational Course",
        "description": "Comprehensive cryptocurrency trading education"
      }
    };

    let jsonLdTag = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!jsonLdTag) {
      jsonLdTag = document.createElement('script');
      jsonLdTag.type = 'application/ld+json';
      document.head.appendChild(jsonLdTag);
    }
    jsonLdTag.textContent = JSON.stringify(structuredData);

  }, [title, description, canonical, ogImage, ogType, keywords, fullTitle, fullCanonical, baseUrl]);

  return null; // This component doesn't render anything
}

// SEO presets for common pages
export const SEO_PRESETS = {
  home: {
    title: 'Learn Crypto Trading',
    description: 'Master cryptocurrency trading with 100+ video lessons, risk-free simulator, and AI-powered analysis tools. Join thousands learning crypto fundamentals.',
    keywords: 'cryptocurrency trading, crypto education, bitcoin trading, blockchain learning, trading simulator'
  },
  learn: {
    title: 'Crypto Trading Lessons',
    description: 'Comprehensive cryptocurrency education from beginner to expert. 100+ professional video lessons covering Bitcoin, DeFi, NFTs, and advanced trading strategies.',
    keywords: 'crypto lessons, trading education, blockchain course, cryptocurrency tutorial, bitcoin learning'
  },
  simulate: {
    title: 'Trading Simulator',
    description: 'Practice crypto trading risk-free with our advanced simulator. $10K virtual portfolio to test strategies before investing real money.',
    keywords: 'crypto trading simulator, paper trading, virtual portfolio, risk-free trading, trading practice'
  },
  analyze: {
    title: 'Market Analysis Tools',
    description: 'Advanced cryptocurrency market analysis with AI-powered whitepaper analyzer, whale tracking, and technical indicators.',
    keywords: 'crypto analysis, market data, whale tracker, technical analysis, cryptocurrency research'
  },
  community: {
    title: 'Trading Community',
    description: 'Connect with fellow crypto traders, share strategies, and learn from experienced investors in our active community forum.',
    keywords: 'crypto community, trading forum, cryptocurrency discussion, trader network'
  },
  pricing: {
    title: 'Subscription Plans',
    description: 'Choose your crypto education plan. Free lessons, Pro features, and Elite access to complete curriculum with advanced tools.',
    keywords: 'crypto course pricing, trading education cost, subscription plans'
  }
};