"use client";

import { GridLayoutComponent } from "@/components/grid-layout-component/grid-layout-component";
import { chartConfig } from "@/lib/chart-helpers";

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
