import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

type ChartProps = {
  width: number;
  height: number;
  data: any;
};

var LineChartComponent = ({ width, height, data }: ChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={width}
        height={height}
        data={data}
        margin={{
          right: 30,
        }}
      >
        <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />

        <Tooltip />

        <Legend />
        <Line type="monotone" dataKey="uv" stroke="#3b82f6" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
