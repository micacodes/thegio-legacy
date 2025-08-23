import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminOrderChart = () => {
  // In a real app, this data would be fetched from an API
  const data = [
    { name: 'Jan', orders: 12 },
    { name: 'Feb', orders: 19 },
    { name: 'Mar', orders: 3 },
    { name: 'Apr', orders: 5 },
    { name: 'May', orders: 2 },
    { name: 'Jun', orders: 3 },
    { name: 'Jul', orders: 9 },
  ];

  return (
    // ResponsiveContainer makes the chart fill its parent div
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="name" stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '0.5rem',
          }}
        />
        <Legend />
        <Line type="monotone" dataKey="orders" stroke="#F97316" strokeWidth={2} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AdminOrderChart;