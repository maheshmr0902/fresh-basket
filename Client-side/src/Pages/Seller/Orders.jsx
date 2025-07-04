import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../Context/AppContext';
import { assets } from '../../assets/assets';

const Orders = () => {
  const { currency, axios } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.get('/api/seller/orders');
        if (data.success) {
          setOrders(data.orders || []);
        } else {
          setError(data.message || 'Failed to fetch orders.');
        }
      } catch (err) {
        setError('An error occurred while fetching orders.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [axios]);

  if (loading) {
    return <div className="text-center p-10">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Customer Orders</h2>
      {orders.length === 0 ? (
        <div className="bg-white p-10 text-center rounded-lg shadow-sm text-gray-500">No orders to display.</div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-b pb-3 mb-3">
              <div>
                <p className="text-xs text-gray-500">Order ID</p>
                <p className="font-semibold text-primary">#{order._id.slice(-8)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Amount</p>
                <p className="font-semibold">{currency}{order.amount?.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Payment Status</p>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {order.isPaid ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Items List */}
              <div>
                <h4 className="font-semibold mb-2">Items</h4>
                <div className="space-y-2">
                  {order.items?.map((item) => (
                    <div key={item.product?._id || item._id} className="flex items-center gap-3">
                      <img src={item.product?.image?.[0] || assets.box_icon} alt={item.product?.name || ''} className="w-10 h-10 object-cover rounded" />
                      <div>
                        <p className="text-sm font-medium">{item.product?.name || 'Product not found'}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h4 className="font-semibold mb-2">Shipping To</h4>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">{order.address?.firstName} {order.address?.lastName}</p>
                  <p>{order.address?.street}, {order.address?.city}</p>
                  <p>{order.address?.state}, {order.address?.zipcode}</p>
                  <p>{order.address?.phone}</p>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;


