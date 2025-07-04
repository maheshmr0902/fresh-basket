import React, { useState } from 'react';
import axios from 'axios';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(''); // To display success or error messages

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(''); // Clear previous message
        try {
            const response = await axios.post('/api/newsletter/subscribe', { email });
            setMessage(response.data.message || 'Subscribed successfully!');
            setEmail(''); // Clear email input on success
        } catch (error) {
            setMessage(
                error.response?.data?.message || 'Subscription failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center text-center space-y-2 mt-24 pb-14">
            <h1 className="md:text-4xl text-2xl font-semibold">Never Miss a Deal!</h1>
            <p className="md:text-lg text-gray-500/70 pb-8">
                Subscribe to get the latest offers, new arrivals, and exclusive discounts
            </p>
            <form
                className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12"
                onSubmit={handleSubmit}
            >
                <input
                    className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
                    type="email"
                    placeholder="Enter your email id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="md:px-12 px-8 h-full text-white bg-secondary hover:bg-primary-dull transition-all cursor-pointer rounded-md rounded-l-none"
                    disabled={loading}
                >
                    {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
            </form>
            {message && (
                <p className={`mt-2 text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}> {/* Added conditional styling for message */}
                    {message}
                </p>
            )}
        </div>
    );
};

export default Newsletter;