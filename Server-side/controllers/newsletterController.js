// controllers/newsletterController.js
import Newsletter from '../models/Newsletter.js';

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const alreadySubscribed = await Newsletter.findOne({ email });

    if (alreadySubscribed) {
      return res.status(400).json({ success: false, message: 'Already subscribed' });
    }

    const newSubscriber = await Newsletter.create({ email });

    res.status(201).json({ success: true, message: 'Subscribed successfully', data: newSubscriber });
  } catch (error) {
    console.error('❌ Newsletter Subscribe Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
