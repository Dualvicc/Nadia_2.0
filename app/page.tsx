"use client";

import { chartConfig } from "@/components/charts/helpers";
import { GridLayoutComponent } from "@/components/grid-layout/grid-layout";

export default function Home() {
  return (
    <main className="p-2">
      <div className="w-full flex justify-end">
        {/* <Modal title={CREATE_CHART} setCharts={setCharts} /> */}
      </div>
      <GridLayoutComponent chart={chartConfig} />
    </main>
  );
}
