import React from "react";
import { ChartConfigType, ChartType } from "@/lib/chart-helpers";
import GridLayout from "react-grid-layout";
import { WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { ChartContainer } from "../charts-components/container-chart";
import { salesData } from "@/mockdata";

const ResponsiveGridLayout = WidthProvider(GridLayout);

export function GridLayoutComponent({ chart }: { chart?: ChartConfigType[] }) {
  return (
    <ResponsiveGridLayout
      className="layout bg-white border border-gray-300 rounded-lg min-h-96"
      isBounded={true}
      compactType={null}
      margin={[10, 10]}
    >
      {chart?.map((el) => {
        console.log("GridLayoutComponent arr: ", chart);
        return (
          <div
            key={el.id}
            className="bg-white flex justify-center items-center pr-4 py-4 border border-black"
            data-grid={{ x: 0, y: 0, w: 3, h: 2 }}
          >
            <ChartContainer type={el.type} data={salesData} />
          </div>
        );
      })}
    </ResponsiveGridLayout>
  );
}
