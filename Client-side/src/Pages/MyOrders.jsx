import React from 'react';
import { useAppContext } from '../Context/AppContext';

const MyOrders = () => {
  const { currency, axios, user } = useAppContext();

  const[myOrders, setMyOrders] = React.useState([]);
  const fetchMyOrders = async () => {
    try{
       const { data } = await axios.get('/api/order/user')
      if(data.success){
        setMyOrders(data.orders);
      }
    }catch(error){
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders.");
    }
  }
  React.useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  return (
    <div className="mt-20 px-4 md:px-10 pb-10 min-h-[70vh]">
      <h2 className="text-2xl font-semibold mb-8 border-b-2 inline-block border-primary">
        MY ORDERS
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-500 mt-4">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border border-gray-300 rounded-md p-4 shadow-sm bg-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2 md:gap-4">
                <p><span className="font-semibold">Order ID:</span> #{order._id.slice(-6)}</p>
                <p><span className="font-semibold">Payment:</span> {order.paymentMethod}</p>
                <p><span className="font-semibold">Date:</span> {new Date(order.date).toLocaleDateString()}</p>
                <p><span className="font-semibold">Total:</span> {currency}{Number(order.totalAmount).toFixed(2)}</p>
              </div>

              <div className="space-y-4">
                {order.items.map((item, index) => {
                  const product = item.product || {};
                  const itemName = item.name || product.name || 'Unknown Product';
                  const itemImage = item.image || product.image?.[0] || 'https://via.placeholder.com/64';
                  const itemCategory = item.category || product.category || 'N/A';
                  const itemPrice = item.offerPrice ?? product.offerPrice ?? 0;

                  return (
                    <div key={item._id || index} className="flex items-center border-t pt-4 gap-4">
                      <img src={itemImage} alt={itemName} className="w-16 h-16 object-cover border rounded-md" />
                      <div className="flex-1">
                        <p className="font-semibold">{itemName}</p>
                        <p className="text-sm text-gray-500">Category: {Array.isArray(itemCategory) ? itemCategory.join(', ') : itemCategory}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-green-600">
                          {currency}{(itemPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;

