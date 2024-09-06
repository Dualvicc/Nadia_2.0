"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type propsChart = {
  width: number;
  height: number;
  data: any;
};

var BarChartComponent = ({ width, height, data }: propsChart) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={width}
        height={height}
        data={data}
        margin={{
          right: 30,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />

        <Tooltip />

        <Legend />
        <Bar dataKey="revenue" fill="#2563eb" />
        <Bar dataKey="profit" fill="#8b5cf6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
