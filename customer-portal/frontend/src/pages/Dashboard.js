import React from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';

const Dashboard = () => {
  // Dummy data
  const balance = 1500.75; // User balance in ZAR
  const transactions = [
    { id: 1, date: '2024-10-01', amount: -200.00, description: 'Grocery Shopping' },
    { id: 2, date: '2024-10-03', amount: 1500.00, description: 'Salary Payment' },
    { id: 3, date: '2024-10-05', amount: -50.50, description: 'Utilities Payment' },
    { id: 4, date: '2024-10-07', amount: -300.00, description: 'Online Shopping' },
    { id: 5, date: '2024-10-10', amount: 200.00, description: 'Refund' },
  ];

  // Dummy spending data for the chart
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Monthly Spending (ZAR)',
        data: [200, 400, 300, 500, 250, 600, 700, 800, 300, 150],
        fill: false,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-red-600 text-white p-6">
        <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
        <nav className="flex flex-col space-y-4">
          <Link to="/transactions" className="hover:bg-red-700 p-2 rounded">Transactions</Link>
          <Link to="/profile" className="hover:bg-red-700 p-2 rounded">Profile</Link>
          <Link to="/settings" className="hover:bg-red-700 p-2 rounded">Settings</Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-semibold mb-6">Welcome to Your Dashboard</h2>
        
        {/* Balance and Statistics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Current Balance</h3>
            <p className="text-3xl text-green-600">R {balance.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Total Transactions</h3>
            <p className="text-3xl text-blue-600">{transactions.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Recent Activity</h3>
            <p className="text-3xl text-purple-600">{transactions.filter(t => t.amount > 0).length} Credits</p>
            <p className="text-3xl text-red-600">{transactions.filter(t => t.amount < 0).length} Debits</p>
          </div>
        </div>
        
        {/* Spending Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">Monthly Spending Overview</h3>
          <Line data={chartData} />
        </div>

        {/* Transaction History */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Description</th>
                <th className="py-2 px-4 text-right">Amount (ZAR)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id} className="border-b hover:bg-gray-100">
                  <td className="py-2 px-4">{transaction.date}</td>
                  <td className="py-2 px-4">{transaction.description}</td>
                  <td className={`py-2 px-4 text-right ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    R {transaction.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
