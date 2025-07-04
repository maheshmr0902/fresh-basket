import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Payments = () => {
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    nameOnCard: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    // Format expiry date as MM/YY
    if (name === 'expiry' && value.length === 2 && paymentDetails.expiry.length === 1) {
      formattedValue = value + '/';
    } else if (name === 'expiry' && value.length === 2 && paymentDetails.expiry.length === 3) {
      formattedValue = value.slice(0, 1);
    }
    setPaymentDetails(prev => ({ ...prev, [name]: formattedValue }));
  };

  const validateCard = () => {
    const { cardNumber, expiry, cvv, nameOnCard } = paymentDetails;
    const cardRegex = /^\d{16}$/;
    // Validates MM/YY format and ensures month is between 01-12
    const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    const cvvRegex = /^\d{3,4}$/;
    return (
      cardRegex.test(cardNumber.replace(/\s/g, '')) &&
      expiryRegex.test(expiry) &&
      cvvRegex.test(cvv) &&
      nameOnCard.trim().length > 2
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateCard()) {
      toast.error('Please check your card details and try again.');
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Payment successful! Your order has been placed.');
      navigate('/my-orders');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="mt-20 px-4 max-w-md mx-auto min-h-[70vh]">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
        Secure Online Payment
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <input type="text" name="nameOnCard" placeholder="Name on Card" required value={paymentDetails.nameOnCard} onChange={handleChange} className="border p-2 rounded w-full" autoComplete="cc-name" />
        <input type="text" name="cardNumber" placeholder="Card Number (16 digits)" maxLength="16" required value={paymentDetails.cardNumber} onChange={handleChange} className="border p-2 rounded w-full" inputMode="numeric" pattern="\d{16}" autoComplete="cc-number" />
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="expiry" placeholder="MM/YY" maxLength="5" required value={paymentDetails.expiry} onChange={handleChange} className="border p-2 rounded w-full" pattern="(0[1-9]|1[0-2])\/\d{2}" autoComplete="cc-exp" />
          <input type="password" name="cvv" placeholder="CVV" maxLength="4" required value={paymentDetails.cvv} onChange={handleChange} className="border p-2 rounded w-full" inputMode="numeric" pattern="\d{3,4}" autoComplete="cc-csc" />
        </div>
        <button type="submit" className="bg-green-600 text-white py-3 px-4 rounded hover:bg-green-700 transition w-full disabled:bg-gray-400" disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default Payments;

