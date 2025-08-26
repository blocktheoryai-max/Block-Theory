interface Slide {
  id: number;
  title: string;
  content: string;
  keyPoints: string[];
  visualType?: 'diagram' | 'chart' | 'list' | 'comparison';
  icon?: string;
}

// Generate slides from lesson content using AI-powered parsing
export function generateSlidesFromContent(lessonContent: string, lessonTitle: string): Slide[] {
  // Parse HTML content and extract key concepts
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = lessonContent;
  
  const headings = Array.from(tempDiv.querySelectorAll('h1, h2, h3'));
  const lists = Array.from(tempDiv.querySelectorAll('ul, ol'));
  
  const slides: Slide[] = [];
  
  // Introduction slide
  slides.push({
    id: 0,
    title: `Welcome to ${lessonTitle}`,
    content: "Get ready to master key concepts with this interactive breakdown. Click through each slide to build your understanding step by step.",
    keyPoints: [
      "Interactive learning experience",
      "Key concepts broken down",
      "Step-by-step progression",
      "Visual learning aids"
    ],
    visualType: 'chart',
    icon: '🎯'
  });

  // Process main headings into slides
  headings.forEach((heading, index) => {
    if (heading.tagName === 'H1' || heading.tagName === 'H2') {
      const nextHeading = headings[index + 1];
      let content = '';
      let keyPoints: string[] = [];

      // Extract content between this heading and the next
      let currentElement = heading.nextElementSibling;
      while (currentElement && currentElement !== nextHeading) {
        if (currentElement.tagName === 'P') {
          content += currentElement.textContent + ' ';
        }
        if (currentElement.tagName === 'UL' || currentElement.tagName === 'OL') {
          const listItems = Array.from(currentElement.querySelectorAll('li'));
          keyPoints = listItems.map(li => li.textContent || '').filter(Boolean);
        }
        currentElement = currentElement.nextElementSibling;
      }

      // Determine visual type based on content
      let visualType: 'diagram' | 'chart' | 'list' | 'comparison' = 'list';
      const headingText = heading.textContent?.toLowerCase() || '';
      
      if (headingText.includes('vs') || headingText.includes('comparison') || headingText.includes('pros') || headingText.includes('cons')) {
        visualType = 'comparison';
      } else if (headingText.includes('process') || headingText.includes('flow') || headingText.includes('steps')) {
        visualType = 'diagram';
      } else if (headingText.includes('metrics') || headingText.includes('types') || headingText.includes('categories')) {
        visualType = 'chart';
      }

      slides.push({
        id: slides.length,
        title: heading.textContent || `Concept ${index + 1}`,
        content: content.trim() || `Learn about ${heading.textContent}`,
        keyPoints: keyPoints.slice(0, 6), // Limit to 6 key points for readability
        visualType,
        icon: getIconForHeading(heading.textContent || '')
      });
    }
  });

  // Summary slide
  if (slides.length > 2) {
    const allKeyPoints = slides.slice(1, -1).flatMap(slide => slide.keyPoints).slice(0, 8);
    slides.push({
      id: slides.length,
      title: 'Key Takeaways',
      content: "Review the most important concepts from this lesson to reinforce your understanding.",
      keyPoints: allKeyPoints,
      visualType: 'chart',
      icon: '📋'
    });
  }

  return slides;
}

// Get appropriate icon based on heading content
function getIconForHeading(heading: string): string {
  const h = heading.toLowerCase();
  
  if (h.includes('security') || h.includes('wallet')) return '🔐';
  if (h.includes('trading') || h.includes('exchange')) return '📈';
  if (h.includes('defi') || h.includes('protocol')) return '⚡';
  if (h.includes('bitcoin') || h.includes('btc')) return '₿';
  if (h.includes('ethereum') || h.includes('eth')) return '🔷';
  if (h.includes('analysis') || h.includes('research')) return '🔍';
  if (h.includes('portfolio') || h.includes('investment')) return '📊';
  if (h.includes('blockchain') || h.includes('technology')) return '⛓️';
  if (h.includes('regulation') || h.includes('legal')) return '⚖️';
  if (h.includes('risk') || h.includes('management')) return '⚠️';
  if (h.includes('staking') || h.includes('yield')) return '🌱';
  if (h.includes('nft') || h.includes('collectible')) return '🎨';
  
  return '💡';
}

// Generate slides for specific lesson categories
export function generateCategorySpecificSlides(category: string, title: string): Slide[] {
  const baseSlides = [
    {
      id: 0,
      title: `${title} Overview`,
      content: `Master the fundamentals of ${title.toLowerCase()} with this comprehensive breakdown.`,
      keyPoints: [],
      visualType: 'chart' as const,
      icon: '🎯'
    }
  ];

  switch (category) {
    case 'security':
      return [
        ...baseSlides,
        {
          id: 1,
          title: 'Security Fundamentals',
          content: 'Understanding the core principles that keep your cryptocurrency assets safe.',
          keyPoints: [
            'Private key protection',
            'Wallet security best practices',
            'Multi-factor authentication',
            'Cold storage benefits',
            'Backup and recovery'
          ],
          visualType: 'list',
          icon: '🔐'
        },
        {
          id: 2,
          title: 'Threat Assessment',
          content: 'Identify and understand common security threats in the cryptocurrency space.',
          keyPoints: [
            'Phishing attacks',
            'Social engineering',
            'Exchange hacks',
            'Smart contract vulnerabilities',
            'Physical security risks'
          ],
          visualType: 'diagram',
          icon: '⚠️'
        }
      ];

    case 'trading':
      return [
        ...baseSlides,
        {
          id: 1,
          title: 'Trading Fundamentals',
          content: 'Essential concepts every cryptocurrency trader needs to understand.',
          keyPoints: [
            'Market analysis techniques',
            'Order types and execution',
            'Risk management principles',
            'Portfolio allocation',
            'Emotional discipline'
          ],
          visualType: 'chart',
          icon: '📈'
        },
        {
          id: 2,
          title: 'Analysis Methods',
          content: 'Compare different approaches to analyzing cryptocurrency markets.',
          keyPoints: [
            'Technical analysis: Chart patterns and indicators',
            'Fundamental analysis: Project evaluation',
            'Sentiment analysis: Market psychology',
            'On-chain analysis: Blockchain metrics'
          ],
          visualType: 'comparison',
          icon: '🔍'
        }
      ];

    case 'defi':
      return [
        ...baseSlides,
        {
          id: 1,
          title: 'DeFi Ecosystem',
          content: 'Explore the building blocks of decentralized finance.',
          keyPoints: [
            'Smart contracts and automation',
            'Liquidity pools and AMMs',
            'Lending and borrowing protocols',
            'Yield farming strategies',
            'Governance tokens'
          ],
          visualType: 'diagram',
          icon: '⚡'
        },
        {
          id: 2,
          title: 'Risks vs Rewards',
          content: 'Understanding the trade-offs in DeFi participation.',
          keyPoints: [
            'High yield potential',
            '24/7 global access',
            'Composable protocols',
            'Smart contract risks',
            'Impermanent loss',
            'Regulatory uncertainty'
          ],
          visualType: 'comparison',
          icon: '⚖️'
        }
      ];

    default:
      return [
        ...baseSlides,
        {
          id: 1,
          title: 'Key Concepts',
          content: `Essential knowledge for understanding ${title.toLowerCase()}.`,
          keyPoints: [
            'Foundation principles',
            'Practical applications',
            'Best practices',
            'Common pitfalls to avoid'
          ],
          visualType: 'list',
          icon: '💡'
        }
      ];
  }
}