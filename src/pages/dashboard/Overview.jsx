import React, { useEffect } from 'react';
import { Users, Package, FileText, DollarSign, Activity } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { Link } from 'react-router-dom';

const Overview = () => {
  const { stats, loading, fetchStats } = useDashboard();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Revenue',
      value: `৳${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: <DollarSign className="w-8 h-8 text-green-500" />,
      bg: 'bg-green-50',
    },
    {
      title: 'Total Invoices',
      value: stats.totalInvoices,
      icon: <FileText className="w-8 h-8 text-blue-500" />,
      bg: 'bg-blue-50',
    },
    {
      title: 'Total Clients',
      value: stats.totalClients,
      icon: <Users className="w-8 h-8 text-purple-500" />,
      bg: 'bg-purple-50',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <Package className="w-8 h-8 text-orange-500" />,
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
            <div className={`p-4 rounded-full ${card.bg}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Stats Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-indigo-500" />
            Document Breakdown
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Invoices</span>
              <span className="font-bold text-gray-800">{stats.totalInvoices}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Delivery Challans</span>
              <span className="font-bold text-gray-800">{stats.totalChallans}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600">Quotations</span>
              <span className="font-bold text-gray-800">{stats.totalProposals}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Documents</h2>
          {stats.recentDocuments && stats.recentDocuments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link to={`/dashboard/documents/${doc.type}s`} className="text-indigo-600 hover:text-indigo-900 font-medium">
                          {doc.bill_no}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{doc.client_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          doc.type === 'invoice' ? 'bg-green-100 text-green-800' :
                          doc.type === 'challan' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {doc.type === 'challan' ? '-' : `৳${Number(doc.grand_total).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No recent documents found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
