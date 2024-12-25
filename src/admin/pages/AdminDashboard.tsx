import React, { useEffect, useState } from 'react';
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUserPlus, faMousePointer, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { getUserCount, getNewUserCount, get_AD_Click, getVisitor } from '../../api/authApi';
import { get } from 'http';

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, ChartDataLabels);

const AdminDashboard: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [newUsers, setNewUsers] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [monthlyNewUsers, setMonthlyNewUsers] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userCountData = await getUserCount();
        setTotalUsers(userCountData.total_user);

        const newUserCountData = await getNewUserCount(30);
        setNewUsers(newUserCountData.new_users_last_n_days);

        const adClickData = await get_AD_Click();
        setTotalClicks(adClickData.AD_Click);

        const visitorData = await getVisitor();
        setTotalVisitors(visitorData.Count_Visitor);

        const today = new Date();
        const monthlyDataPromises = Array.from({ length: 12 }, (_, i) => {
          const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
          const days = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
          // console.log(`Fetching new user count for the past ${days} days`);
          return getNewUserCount(days);
        });
        const monthlyData = await Promise.all(monthlyDataPromises);
        const cumulativeMonthlyNewUsers = monthlyData.map((data, index) => {
          const previousMonthData = index > 0 ? monthlyData[index - 1].new_users_last_n_days : 0;
          return data.new_users_last_n_days - previousMonthData;
        });
        cumulativeMonthlyNewUsers.forEach((data, index) => {
          // console.log(`New users for month ${12 - index}: ${data}`);
        });
        setMonthlyNewUsers(cumulativeMonthlyNewUsers.reverse());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { icon: faUsers, label: 'Total Users', value: totalUsers },
    { icon: faUserPlus, label: 'New Users', value: newUsers },
    { icon: faMousePointer, label: 'Total Visitors', value: totalVisitors },
    { icon: faDollarSign, label: 'Total Revenue (VND)', value: totalClicks * 30 },
  ];

  const doughnutData = (label: string, data: number, color: string) => ({
    labels: [label, 'Other'],
    datasets: [
      {
        data: [data, 100 - data],
        backgroundColor: [color, label === 'User Growth' ? '#ccefe3' : '#ffcdcd'],
        borderColor: [color, label === 'User Growth' ? '#ccefe3' : '#ffcdcd'],
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

  const userGrowthPercentage = (newUsers / totalUsers) * 100;
  const revenuePercentage = (totalClicks * 30) / 10000 * 100; // Assuming 10000 is the max revenue for 100%

  const userGrowthData = doughnutData('User Growth', userGrowthPercentage, '#00B074');
  const totalRevenueData = doughnutData('Revenue', revenuePercentage, '#FF5B5B');

  const lineData = {
    labels: Array.from({ length: 12 }, (_, i) => new Date(new Date().setMonth(new Date().getMonth() - i)).toLocaleString('default', { month: 'long' })).reverse(),
    datasets: [{
      label: 'New Users',
      data: monthlyNewUsers.reverse(),
      fill: false,
      backgroundColor: '#00B074',
      borderColor: '#00B074',
      borderWidth: 2,
      pointBackgroundColor: '#00B074',
      pointBorderColor: '#00B074',
      pointHoverBackgroundColor: '#00B074',
      pointHoverBorderColor: '#00B074',
      shadowOffsetX: 0,
      shadowOffsetY: 10,
      shadowBlur: 20,
      shadowColor: 'rgba(0, 0, 0, 0.35)',
    }],
  };

  const lineOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 2,
        borderColor: '#00B074',
        backgroundColor: '#00B074',
        shadowOffsetX: 0,
        shadowOffsetY: 10,
        shadowBlur: 20,
        shadowColor: 'rgba(0, 0, 0, 0.35)',
      },
      point: {
        radius: 5,
        hitRadius: 10,
        hoverRadius: 7,
        backgroundColor: '#00B074',
        borderColor: '#00B074',
        shadowOffsetX: 0,
        shadowOffsetY: 10,
        shadowBlur: 20,
        shadowColor: 'rgba(0, 0, 0, 0.35)',
      },
    },
  };

  return (
    <div className="p-5 bg-white min-h-screen">
      <div className="flex justify-around mb-5">
        {stats.map((stat, index) => (
          <div key={index} className="border border-gray-300 p-5 rounded-lg text-center w-1/5 shadow-lg bg-white">
            <FontAwesomeIcon icon={stat.icon} className="text-3xl mb-2 text-gray-800" />
            <h2 className="text-lg font-semibold text-gray-700">{stat.label}</h2>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-around mb-5">
        <div className="w-1/4 relative bg-white p-5 rounded-lg shadow-lg">
          <Doughnut data={userGrowthData} options={{ plugins: { datalabels: { display: false }, legend: { display: false } } }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ top: '-30px' }}>
            <p className="text-2xl font-bold text-gray-900">{userGrowthPercentage.toFixed(2)}%</p>
          </div>
          <h2 className="text-lg text-center mt-2 font-semibold text-gray-700">User Growth</h2>
        </div>
        <div className="w-1/4 relative bg-white p-5 rounded-lg shadow-lg">
          <Doughnut data={totalRevenueData} options={{ plugins: { datalabels: { display: false }, legend: { display: false } } }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ top: '-30px' }}>
            <p className="text-2xl font-bold text-gray-900">{revenuePercentage.toFixed(2)}%</p>
          </div>
          <h2 className="text-lg text-center mt-2 font-semibold text-gray-700">Return on Expectation</h2>
        </div>
      </div>
      <div className="w-full bg-white p-5 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">User Growth Chart</h2>
        <Line data={lineData} options={lineOptions} />
      </div>
    </div>
  );
};

export default AdminDashboard;
