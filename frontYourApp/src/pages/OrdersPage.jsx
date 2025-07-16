import { useState } from 'react';
import { Link } from 'react-router-dom';
import { contextCartFunc } from '../context/contextCartFunc';

function OrdersPage() {
  const { orders } = contextCartFunc();
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const [sortOption, setSortOption] = useState('recent');

  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOption === 'recent' ? dateB - dateA : dateA - dateB;
  });

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Order History</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-xl font-medium text-slate-500 mb-4">No orders yet</p>
          <p className="text-slate-500 mb-6">You haven't placed any orders yet.</p>
          <Link
            to="/"
            className="inline-block px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div
                className="p-4 cursor-pointer flex justify-between items-center"
                onClick={() => toggleOrderDetails(order.id)}
              >
                <div>
                  <span className="block text-sm text-gray-500 mb-1">
                    Order #{order.id.substring(6, 14)}
                  </span>
                  <span className="font-medium">{formatDate(order.date)}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-slate-800">
                    {order.total.toFixed(2)}€
                  </span>
                  <span
                    className={`transform transition-transform ${
                      expandedOrderId === order.id ? 'rotate-180' : ''
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-slate-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              {expandedOrderId === order.id && (
                <div className="border-t p-4 bg-slate-50">
                  <h3 className="font-semibold mb-3">Order Details</h3>

                  <div className="space-y-3 mb-4">
                    {order.items.map((item, idx) => {
                      const details = item.details;
                      if (!details) return null;

                      const selectedColor =
                        details.options?.colors?.find(
                          (c) => c.code === item.colorCode
                        )?.name || '';
                      const selectedStorage =
                        details.options?.storages?.find(
                          (s) => s.code === item.storageCode
                        )?.name || '';
                      const price = details.price ? parseFloat(details.price) : 0;

                      return (
                        <div
                          key={idx}
                          className="flex p-2 hover:bg-slate-100 rounded-lg"
                        >
                          <div className="w-16 h-16 mr-3">
                            <img
                              src={
                                details.imgUrl ||
                                'https://picsum.photos/seed/mobile123/300/300'
                              }
                              alt={`${details.brand} ${details.model}`}
                              className="object-contain max-h-64"
                            />
                          </div>
                          <div className="flex-grow">
                            <div className="flex justify-between">
                              <span className="font-medium">
                                {details.brand} {details.model}
                              </span>
                              <span>{(price * item.quantity).toFixed(2)}€</span>
                            </div>
                            <div className="text-sm text-slate-600">
                              {selectedColor && <span>Color: {selectedColor} </span>}
                              {selectedStorage && <span>Storage: {selectedStorage}</span>}
                            </div>
                            <div className="text-sm">
                              <span>Quantity: {item.quantity}</span>
                              <span className="mx-2">·</span>
                              <span>Unit Price: {price.toFixed(2)}€</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {order.customerInfo && (
                    <div className="border-t pt-3">
                      <h4 className="font-medium mb-2">Shipping Information</h4>
                      <p className="text-sm">{order.customerInfo.name}</p>
                      <p className="text-sm">{order.customerInfo.email}</p>
                      <p className="text-sm whitespace-pre-line">
                        {order.customerInfo.address}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
