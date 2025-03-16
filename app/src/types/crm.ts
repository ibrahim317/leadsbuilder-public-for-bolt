export interface ListStats {
  id: number;
  name: string;
  contactedCount: number;
  totalCount: number;
}

export interface FunnelStep {
  type: string;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

interface KPI {
  label: string;
  value: number;
  previousValue: number;
  variation: number;
  color: string;
}

interface DateRange {
  start: Date;
  end: Date;
}

interface CRMStats {
  lists: ListStats[];
  funnel: FunnelStep[];
  kpis: {
    conversionRate: KPI;
    refusalRate: KPI;
    noResponseRate: KPI;
  };
  totalMessages: number;
}