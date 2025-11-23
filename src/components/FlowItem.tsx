'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';

interface FlowItemProps {
  id: string;
  name: string;
  index?: number;
}

// Dummy flow data for now
const dummyFlows = [
  { id: '1', name: 'Onboarding' },
  { id: '2', name: 'Login & Signup' },
  { id: '3', name: 'Booking' },
  { id: '4', name: 'Filtering' },
];

export function FlowItem({ id, name, index: itemIndex }: FlowItemProps & { index?: number }) {
  const locale = useLocale();
  // On desktop: right border for even indices (left column), bottom border for mobile
  const isLeftColumn = itemIndex !== undefined && itemIndex % 2 === 0;
  
  return (
    <Link href={`/${locale}/flow/${id}`} className={`flex flex-col gap-4 items-start pl-6 py-8 w-full min-w-0 border-b md:border-b-0 ${isLeftColumn ? 'md:border-r border-border' : ''}`}>
      {/* Image List - Horizontal */}
      <div className="flex gap-6 items-center w-full overflow-x-auto scrollbar-hide -mr-6 md:mr-0 pr-6 md:pr-0">
        {/* Three images */}
        {[1, 2, 3].map((imgIndex) => (
          <div key={imgIndex} className="bg-secondary flex items-center p-6 rounded-[10px] shrink-0 md:flex-1 md:min-w-0">
            <div className="aspect-[249/540] w-[212px] md:w-full relative rounded-[10px]">
              <Image
                src="/images/sample-img.png"
                alt={`${name} - Step ${imgIndex}`}
                fill
                className="object-cover object-center rounded-[10px]"
                sizes="(max-width: 768px) 212px, 50vw"
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Title */}
      <h3 className="text-foreground text-base font-normal leading-[1.5] w-full">
        {name}
      </h3>
    </Link>
  );
}

// Export a component to render all flows
export function FlowGrid() {
  return (
    <div className="flex flex-col w-full">
      {/* First row - 2 flows */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] w-full border-b border-border">
        {dummyFlows.slice(0, 2).map((flow, idx) => (
          <FlowItem key={flow.id} id={flow.id} name={flow.name} index={idx} />
        ))}
      </div>
      {/* Second row - 2 flows */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] w-full border-t border-border md:border-t-0">
        {dummyFlows.slice(2, 4).map((flow, idx) => (
          <FlowItem key={flow.id} id={flow.id} name={flow.name} index={idx + 2} />
        ))}
      </div>
    </div>
  );
}

