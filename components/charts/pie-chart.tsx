"use client";

import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type ChartProps = {
  width: number;
  height: number;
  data: any;
};

// NOTE: Only can display one data value, if you want 2 or more, you need more pies. So, not good visually

const PieChartComponent = ({ width, height, data }: ChartProps) => {
  return (
    <>
      <div style={{ width: "100%", height: "100%" }}>
        <ResponsiveContainer>
          <PieChart width={width} height={height}>
            <Tooltip />
            <Legend />
            <Pie data={data} dataKey="revenue" fill="#2563eb" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default PieChartComponent;
