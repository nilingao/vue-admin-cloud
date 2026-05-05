<script lang="ts" setup>
import type { AnalysisOverviewItem } from '@vben/common-ui';
import type { TabOption } from '@vben/types';

import {
  AnalysisChartCard,
  AnalysisChartsTabs,
  AnalysisOverview,
  Page,
} from '@vben/common-ui';
import {
  SvgBellIcon,
  SvgCakeIcon,
  SvgCardIcon,
  SvgDownloadIcon,
} from '@vben/icons';

import AnalyticsTrends from '#/views/dashboard/analytics/analytics-trends.vue';
import AnalyticsVisitsData from '#/views/dashboard/analytics/analytics-visits-data.vue';
import AnalyticsVisitsSales from '#/views/dashboard/analytics/analytics-visits-sales.vue';
import AnalyticsVisitsSource from '#/views/dashboard/analytics/analytics-visits-source.vue';
import AnalyticsVisits from '#/views/dashboard/analytics/analytics-visits.vue';

const overviewItems: AnalysisOverviewItem[] = [
  {
    icon: SvgCardIcon,
    title: '访问数',
    totalTitle: '总访问量',
    totalValue: 120_000,
    value: 2000,
  },
  {
    icon: SvgCakeIcon,
    title: '成交额',
    totalTitle: '总成交额',
    totalValue: 500_000,
    value: 20_000,
  },
  {
    icon: SvgDownloadIcon,
    title: '下载数',
    totalTitle: '总下载量',
    totalValue: 120_000,
    value: 8000,
  },
  {
    icon: SvgBellIcon,
    title: '成交数',
    totalTitle: '总成交数',
    totalValue: 50_000,
    value: 5000,
  },
];

const chartTabs: TabOption[] = [
  {
    label: '流量趋势',
    value: 'trends',
  },
  {
    label: '月访问量',
    value: 'visits',
  },
];
</script>

<template>
  <Page auto-content-height>
    <div class="p-5">
      <AnalysisOverview :items="overviewItems" />

      <AnalysisChartsTabs :tabs="chartTabs" class="mt-5">
        <template #trends>
          <AnalyticsTrends />
        </template>
        <template #visits>
          <AnalyticsVisits />
        </template>
      </AnalysisChartsTabs>

      <div class="mt-5 w-full md:flex">
        <AnalysisChartCard
          class="mt-5 md:mt-0 md:mr-4 md:w-1/3"
          title="访问数量"
        >
          <AnalyticsVisitsData />
        </AnalysisChartCard>
        <AnalysisChartCard
          class="mt-5 md:mt-0 md:mr-4 md:w-1/3"
          title="访问来源"
        >
          <AnalyticsVisitsSource />
        </AnalysisChartCard>
        <AnalysisChartCard class="mt-5 md:mt-0 md:w-1/3" title="销售占比">
          <AnalyticsVisitsSales />
        </AnalysisChartCard>
      </div>
    </div>
  </Page>
</template>
