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
    <Link
      href={`/${locale}/flow/${id}`}
      className={`flex flex-col items-start w-full min-w-0 gap-4 py-7 px-5 md:px-6 ${!isLast ? 'border-b border-neutral-200' : ''}`}
    >
      {/* Screenshot Container - Horizontal Scrollable */}
      {displayScreens.length > 0 ? (
        <div className="flex items-center w-full bg-neutral-100 rounded-[20px] p-6 gap-8 overflow-x-auto scrollbar-hide">
          {displayScreens.map((screen) => (
            <div key={screen.id} className="relative shrink-0 w-[220px] h-[477px] md:w-[180px] md:h-[390px]">
              <Image
                src={screen.imageUrl}
                alt={screen.title || name}
                fill
                className="object-cover object-center rounded-[20px]"
                sizes="(max-width: 768px) 220px, 180px"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full py-12 bg-neutral-100 rounded-[20px]">
          <p className="text-neutral-400 text-sm">No screens available</p>
        </div>
      )}

      {/* Content: Flow name and counter */}
      <div className="flex flex-col items-start gap-1 px-4 py-2 rounded-lg transition-colors group-hover:bg-neutral-100">
        <h3 className="text-base leading-normal text-neutral-950">{name}</h3>
        <p className="text-sm leading-normal text-neutral-400">
          {screens.length} screen{screens.length !== 1 ? 's' : ''}
        </p>
      </div>
    </Link>
  );
}

// Export a component to render all flows
export function FlowGrid() {
  const [flows, setFlows] = React.useState<
    Array<{
      id: string;
      name: string;
      description: string | null;
      screens: Screen[];
    }>
  >([]);
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
      <div className="flex flex-col items-center justify-center px-6 py-20 w-full">
        <p className="text-neutral-400">Loading flows...</p>
      </div>
    );
  }

  if (flows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-20 w-full">
        <p className="text-neutral-400">No flows available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full px-6 py-8 gap-y-12">
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
