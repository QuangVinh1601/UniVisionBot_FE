import React from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUserPlus, faMousePointer, faDollarSign } from '@fortawesome/free-solid-svg-icons';

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, ChartDataLabels);

const AdminDashboard: React.FC = () => {
  const stats = [
    { icon: faUsers, label: 'Total Users', value: 1000 },
    { icon: faUserPlus, label: 'New Users', value: 50 },
    { icon: faMousePointer, label: 'Total Clicks', value: 2000 },
    { icon: faDollarSign, label: 'Total Revenue', value: 5000 },
  ];

  const doughnutData = (label: string, data: number, color: string) => ({
    labels: [label, 'Other'],
    datasets: [
      {
        data: [data, 100 - data],
        backgroundColor: [color, '#E0E0E0'],
        borderColor: [color, '#E0E0E0'],
        borderWidth: 1,
        datalabels: {
          formatter: (value: number) => `${value}%`,
          color: '#fff',
          font: {
            weight: 'bold' as 'bold',
            size: 16,
          },
          anchor: 'center' as 'center',
          align: 'center' as const,
        },
      },
    ],
  });

  const userGrowthData = doughnutData('User Growth', 10, '#36A2EB');
  const totalRevenueData = doughnutData('Revenue', 20, '#FFCE56');

  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{ label: 'Revenue', data: [1200, 1900, 3000, 5000, 2000, 3000, 4000], fill: false, backgroundColor: '#36A2EB', borderColor: '#36A2EB' }],
  };

  return (
    <div className="p-5">
      <div className="flex justify-around mb-5">
        {stats.map((stat, index) => (
          <div key={index} className="border border-gray-300 p-5 rounded-lg text-center w-1/5 shadow-md">
            <FontAwesomeIcon icon={stat.icon} className="text-2xl mb-2 text-gray-800" />
            <h2 className="text-lg">{stat.label}</h2>
            <p className="text-xl">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-around mb-5">
        <div className="w-1/4">
          <h2 className="text-lg">User Growth</h2>
          <Doughnut data={userGrowthData} options={{ plugins: { datalabels: { display: true }, legend: { display: false } } }} />
        </div>
        <div className="w-1/4">
          <h2 className="text-lg">Total Revenue</h2>
          <Doughnut data={totalRevenueData} options={{ plugins: { datalabels: { display: true }, legend: { display: false } } }} />
        </div>
      </div>
      <div className="w-full">
        <h2 className="text-lg">Revenue Chart</h2>
        <Line data={lineData} />
      </div>
    </div>
  );
};

export default AdminDashboard;
