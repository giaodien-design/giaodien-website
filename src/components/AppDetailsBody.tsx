"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface AppDetailsBodyProps {
  app: {
    name: string;
    description?: string | null;
    icon?: string | null;
    platform?: string | null;
    category?: {
      id: string;
      name: string;
      slug: string;
    } | null;
    brandColor?: string | null;
    websiteUrl?: string | null;
    updatedAt?: Date | string;
    screens?: {
      id: string;
      title: string;
      description?: string | null;
      imageUrl: string;
      screenType?: string | null;
    }[];
  };
}

const viewTabs = [
  { id: "screens", label: "Screens" },
  { id: "flows", label: "Flows" },
];

export function AppDetailsBody({ app }: AppDetailsBodyProps) {
  const [activeView, setActiveView] = useState<"screens" | "flows">("screens");
  const [searchTerm, setSearchTerm] = useState("");

  // Helper function to validate image URLs
  const getValidImageUrl = (url: string | null | undefined, fallback: string): string => {
    if (!url) return fallback;
    
    // If it's a local path (starts with /), use it directly
    if (url.startsWith('/')) return url;
    
    // If it's an external URL, check if it's from a configured domain
    try {
      const urlObj = new URL(url);
      // Check if it's from the configured S3 domain
      if (urlObj.hostname === 'giaodien-website-image.s3.ap-southeast-1.amazonaws.com') {
        return url;
      }
      // For other external URLs, use fallback to avoid configuration errors
      return fallback;
    } catch {
      // Invalid URL format, use fallback
      return fallback;
    }
  };

  const formattedScreens = useMemo(() => {
    if (app.screens?.length) {
      return app.screens.map((screen, index) => ({
        id: screen.id || `screen-${index + 1}`,
        title: screen.title || `Screen ${index + 1}`,
        description: screen.description,
        imageUrl: getValidImageUrl(screen.imageUrl, "/images/sample-img.png"),
        screenType: screen.screenType || "Ungrouped",
      }));
    }
    return [];
  }, [app.screens]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredScreens = useMemo(() => {
    if (!normalizedSearch) {
      return formattedScreens;
    }
    return formattedScreens.filter((screen) => {
      const haystack = `${screen.title} ${screen.screenType ?? ""}`.toLowerCase();
      return haystack.includes(normalizedSearch);
    });
  }, [formattedScreens, normalizedSearch]);

  const computedFlowGroups = useMemo(() => {
    if (!formattedScreens.length) {
      return [];
    }

    const groupsMap = new Map<
      string,
      { id: string; name: string; screens: typeof formattedScreens }
    >();

    formattedScreens.forEach((screen) => {
      const key = screen.screenType || "Ungrouped";
      if (!groupsMap.has(key)) {
        groupsMap.set(key, {
          id: key.toLowerCase().replace(/\s+/g, "-"),
          name: key,
          screens: [],
        });
      }
      groupsMap.get(key)!.screens.push(screen);
    });

    return Array.from(groupsMap.values());
  }, [formattedScreens]);

  const filteredFlowGroups = useMemo(() => {
    if (!normalizedSearch) {
      return computedFlowGroups;
    }

    return computedFlowGroups
      .map((group) => ({
        ...group,
        screens: group.screens.filter((screen) =>
          `${screen.title} ${screen.screenType ?? ""}`
            .toLowerCase()
            .includes(normalizedSearch)
        ),
      }))
      .filter((group) => group.screens.length);
  }, [computedFlowGroups, normalizedSearch]);

  const websiteHref = app.websiteUrl
    ? /^https?:\/\//i.test(app.websiteUrl)
      ? app.websiteUrl
      : `https://${app.websiteUrl}`
    : null;

  const infoItems = [
    {
      label: "Platform",
      value: app.platform ? formatPlatform(app.platform) : "Not specified",
    },
    {
      label: "Category",
      value: app.category?.name || "Uncategorized",
    },
    {
      label: "Last updated",
      value: app.updatedAt
        ? new Intl.DateTimeFormat("en", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }).format(new Date(app.updatedAt))
        : "—",
    },
  ];

  return (
    <div className="bg-primary-bg text-primary-fg flex justify-center w-full">
      <div className="w-full">
        {/* Header */}
        <section className="border-b border-border-new flex flex-col gap-8 pt-12 pb-8 px-5 md:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
            <div className="relative w-[80px] h-[80px] rounded-[16px] overflow-hidden bg-secondary-bg flex-shrink-0">
              <Image
                src={getValidImageUrl(app.icon, "/images/sample-app-thumbnail.png")}
                alt={app.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80px, 80px"
              />
            </div>
            <div className="flex flex-col gap-4 flex-1 min-w-0">
              <div className="flex flex-col gap-3">
                <h1 className="text-[32px] leading-[1] font-medium tracking-[-0.4px] text-primary-fg truncate">
                  {app.name}
                </h1>
                <p className="text-[16px] leading-[1.4] text-secondary-fg">
                  {app.description || "No description provided"}
                </p>
              </div>
              {app.category ? (
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-2 rounded-[9999px] bg-secondary-bg text-[14px] leading-none text-primary-fg">
                    {app.category.name}
                  </span>
                </div>
              ) : null}
            </div>
            {websiteHref ? (
              <div className="flex md:flex-col items-start justify-center md:justify-start">
                <Link
                  href={websiteHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="large-button large-button-secondary whitespace-nowrap"
                >
                  Visit website
                </Link>
              </div>
            ) : null}
          </div>
        </section>

        {/* Metadata */}
        <section className="border-b border-border-new py-8 px-5 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {infoItems.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-2"
              >
                <p className="text-[12px] leading-[1.2] tracking-[0.6px] text-secondary-fg">
                  {item.label}
                </p>
                <p className="text-[16px] leading-[1.2] font-normal text-primary-fg break-words">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
          {websiteHref ? (
            <div className="mt-6 flex flex-col gap-2">
              <p className="text-[12px] leading-[1.2] tracking-[0.6px] text-secondary-fg">
                Website
              </p>
              <a
                href={websiteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[16px] leading-[1.2] font-normal text-primary-fg underline underline-offset-4 break-all"
              >
                {websiteHref.replace(/^https?:\/\//, "")}
              </a>
            </div>
          ) : null}
        </section>

        {/* Utilities */}
        <section className="border-b border-border-new flex flex-col gap-4 py-6 px-5 md:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {viewTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveView(tab.id as "screens" | "flows")}
                className={`primary-tab-item ${
                  activeView === tab.id
                    ? "primary-tab-item-selected"
                    : "primary-tab-item-unselected"
                }`}
              >
                <span className="leading-none whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="w-full lg:w-[320px]">
              <div className="flex items-center h-[48px] rounded-[9999px] border border-border-new px-4 bg-primary-bg gap-2">
                <SearchIcon />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={activeView === 'screens' ? 'Search screens' : 'Search flows'}
                  className="w-full bg-transparent text-[14px] font-normal text-primary-fg placeholder:text-secondary-fg outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* View content */}
        <section className="py-10 px-5 md:px-6 flex flex-col gap-8">
          {activeView === "screens" ? (
            filteredScreens.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
                {filteredScreens.map((screen) => (
                  <ScreenCard
                    key={screen.id}
                    imageUrl={screen.imageUrl}
                    title={screen.title}
                  />
                ))}
              </div>
            ) : (
              <EmptyState label="No screens match your search." />
            )
          ) : filteredFlowGroups.length ? (
            <div className="flex flex-col gap-12">
              {filteredFlowGroups.map((group) => (
                <div key={group.id} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2 pb-4 border-b border-border-new">
                    <h3 className="text-[24px] leading-[1.1] font-medium text-primary-fg">
                      {group.name}
                    </h3>
                    <p className="text-[14px] leading-[1.2] text-secondary-fg">
                      {group.screens.length} screen{group.screens.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  {group.screens.length ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
                      {group.screens.map((screen) => (
                        <ScreenCard
                          key={`${group.id}-${screen.id}`}
                          imageUrl={screen.imageUrl}
                          title={screen.title}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState label="No flows available yet." />
          )}
        </section>
      </div>
    </div>
  );
}

function ScreenCard({ imageUrl, title }: { imageUrl: string; title: string }) {
  return (
    <div className="w-full">
      <div className="relative w-full aspect-[276/550] rounded-[24px] overflow-hidden border border-border-new bg-secondary-bg">
        <Image
          src={imageUrl}
          alt={title || "App screen preview"}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[24px] border border-border-new bg-secondary-bg/40 py-16 px-6 text-center">
      <p className="text-[16px] leading-[1.3] text-secondary-fg">{label}</p>
    </div>
  );
}

function formatPlatform(platform: string) {
  const normalized = platform.toLowerCase();
  if (normalized === "ios") return "iOS";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-secondary-fg"
    >
      <path
        d="M11.3333 11.3333L14 14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.33333 12C9.91067 12 12 9.91067 12 7.33333C12 4.756 9.91067 2.66667 7.33333 2.66667C4.756 2.66667 2.66667 4.756 2.66667 7.33333C2.66667 9.91067 4.756 12 7.33333 12Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

