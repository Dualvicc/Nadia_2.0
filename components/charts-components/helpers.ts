import { z } from "zod";

export const CREATE_CHART = "Create chart";

export enum ChartType {
  AREA,
  BAR,
  LINE,
  PIE,
}

export const selectOptionsCreateChartForm = [
  { value: ChartType.AREA, label: "Area chart" },
  { value: ChartType.BAR, label: "Bar chart" },
  { value: ChartType.LINE, label: "Line chart" },
  { value: ChartType.PIE, label: "Pie chart" },
];

export const chartConfigSchema = z.object({
  id: z.string().uuid(),
  type: z.nativeEnum(ChartType),
});

export type ChartConfigType = z.infer<typeof chartConfigSchema>;

export const chartConfig: ChartConfigType[] = [];

export function addChart(chart: ChartConfigType) {
  chartConfig.push(chart);
}
