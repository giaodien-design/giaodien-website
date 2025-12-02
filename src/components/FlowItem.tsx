'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';

interface Screen {
  id: string;
  imageUrl: string;
  title: string;
}

interface FlowItemProps {
  id: string;
  name: string;
  description?: string | null;
  screens?: Screen[];
  isLast?: boolean;
}

export function FlowItem({ id, name, description, screens = [], isLast = false }: FlowItemProps) {
  const locale = useLocale();
  
  // Only show screens if they exist - no dummy data
  const displayScreens = screens.slice(0, 8); // Show max 8 screens
  
  return (
    <Link href={`/${locale}/flow/${id}`} className={`flex flex-col items-start w-full min-w-0 flow-card ${!isLast ? 'border-b border-border-new' : ''}`}>
      {/* Screenshot Container - Horizontal Scrollable */}
      {displayScreens.length > 0 ? (
        <div className="flex items-center w-full flow-card-screenshot-container scrollbar-hide">
          {displayScreens.map((screen) => (
            <div 
              key={screen.id} 
              className="relative shrink-0 flow-card-screenshot flow-card-screenshot-mobile md:flow-card-screenshot-desktop"
            >
              <Image
                src={screen.imageUrl}
                alt={screen.title || name}
                fill
                className="object-cover object-center rounded-[24px]"
                sizes="(max-width: 768px) 220px, 180px"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full py-12 flow-card-screenshot-container">
          <p className="text-secondary-fg text-sm">No screens available</p>
        </div>
      )}
      
      {/* Content: Flow name and counter */}
      <div className="flex flex-col items-start flow-card-content">
        <h3 className="flow-card-name leading-none">
          {name}
        </h3>
        <p className="flow-card-counter leading-none">
          {screens.length} screen{screens.length !== 1 ? 's' : ''}
        </p>
      </div>
    </Link>
  );
}

// Export a component to render all flows
export function FlowGrid() {
  const [flows, setFlows] = React.useState<Array<{
    id: string;
    name: string;
    description: string | null;
    screens: Screen[];
  }>>([]);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    const fetchFlows = async () => {
      const { getAllFlows } = await import('@/lib/actions');
      const result = await getAllFlows();
      
      if (result.success && result.data) {
        setFlows(result.data);
      }
      setLoading(false);
    };
    
    fetchFlows();
  }, []);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 w-full">
        <p className="text-secondary-fg">Loading flows...</p>
      </div>
    );
  }
  
  if (flows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 w-full">
        <p className="text-secondary-fg">No flows available</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col w-full p-6 px-4 py-6 sm:p-6 gap-y-12">
      {flows.map((flow, idx) => (
        <FlowItem 
          key={flow.id} 
          id={flow.id} 
          name={flow.name}
          description={flow.description}
          screens={flow.screens}
          isLast={idx === flows.length - 1}
        />
      ))}
    </div>
  );
}
