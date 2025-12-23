import { Suspense } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HomeContent } from '@/components/HomeContent';
import {
  getCategories,
  getScreenTypes,
  getUIElements,
  getAllFlows,
  getApps,
  getScreens,
  getFlowsWithPreviews
} from '@/lib/actions';
import Loading from './loading';

// View modes for the homepage
type ViewMode = 'APP' | 'SCREEN' | 'FLOW';

interface PageProps {
  searchParams: Promise<{
    categoryId?: string;
    screenTypeId?: string;
    uiElementId?: string;
    flowId?: string;
  }>;
}

// Helper to parse comma-separated URL params into arrays
const parseToArray = (value: string | undefined): string[] => {
  if (!value) return [];
  return value.split(',').filter(Boolean);
};

// Determine view mode based on search params (The Pivot)
const getViewMode = (params: {
  flowId?: string;
  screenTypeId?: string;
  uiElementId?: string;
  categoryId?: string;
}): ViewMode => {
  // Flow Mode: IF flow param exists
  if (params.flowId) {
    return 'FLOW';
  }

  // Screen Mode: IF screenType OR uiElement params exist (and NO flow param)
  if (params.screenTypeId || params.uiElementId) {
    return 'SCREEN';
  }

  // App Mode: Default (or only category param)
  return 'APP';
};

async function HomeContentWrapper({ searchParams }: { searchParams: Promise<PageProps['searchParams']> }) {
  const params = await searchParams;

  // Parse search params into arrays for multi-select
  const categoryIds = parseToArray(params.categoryId);
  const screenTypeIds = parseToArray(params.screenTypeId);
  const uiElementIds = parseToArray(params.uiElementId);
  const flowIds = parseToArray(params.flowId);

  // Determine view mode
  const viewMode = getViewMode(params);

  // Fetch all filter metadata (always needed for FilterBar)
  const [categoriesResult, screenTypesResult, uiElementsResult, flowsResult] = await Promise.all([
    getCategories(),
    getScreenTypes(),
    getUIElements(),
    getAllFlows()
  ]);

  // Extract filter options data
  const categories = categoriesResult.success && categoriesResult.data ? categoriesResult.data : [];
  const screenTypes = screenTypesResult.success && screenTypesResult.data ? screenTypesResult.data : [];
  const uiElements = uiElementsResult.success && uiElementsResult.data ? uiElementsResult.data : [];
  const flowOptions = flowsResult.success && flowsResult.data ? flowsResult.data.map((flow) => ({ id: flow.id, name: flow.name })) : [];

  // Fetch data based on view mode
  let apps: any[] = [];
  let screens: any[] = [];
  let flows: any[] = [];

  switch (viewMode) {
    case 'APP': {
      // Debug logging
      console.log('🔍 Active Category IDs:', categoryIds);
      console.log('🔍 Raw categoryId param:', params.categoryId);

      // Fetch apps with optional category filter
      const appsResult = await getApps({
        categoryId: params.categoryId // Pass comma-separated string, getApps handles parsing
      });
      apps = appsResult.success && appsResult.data ? appsResult.data : [];

      console.log('📦 Fetched apps count:', apps.length);
      break;
    }

    case 'SCREEN': {
      // Fetch screens filtered by screen type and/or UI element
      const screensResult = await getScreens({
        screenTypeId: params.screenTypeId,
        uiElementId: params.uiElementId,
        categoryId: params.categoryId
      });
      screens = screensResult.success && screensResult.data ? screensResult.data : [];
      break;
    }

    case 'FLOW': {
      // Fetch flows with previews, optionally filtered
      const flowsPreviewResult = await getFlowsWithPreviews({
        flowId: params.flowId,
        categoryId: params.categoryId
      });
      flows = flowsPreviewResult.success && flowsPreviewResult.data ? flowsPreviewResult.data : [];
      break;
    }
  }

  return (
    <HomeContent
      categories={categories}
      screenTypes={screenTypes}
      uiElements={uiElements}
      flows={flowOptions}
      viewMode={viewMode}
      apps={apps}
      screens={screens}
      flowPreviews={flows}
    />
  );
}

export default async function Home({ searchParams }: PageProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col w-full">
      {/* Header */}
      <Header />

      {/* Body: FilterBar -> Content Grid */}
      <main className="flex-1 flex flex-col">
        <Suspense fallback={<Loading />}>
          <HomeContentWrapper searchParams={searchParams} />
        </Suspense>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
