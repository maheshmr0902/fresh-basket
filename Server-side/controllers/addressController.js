import Address from "../models/Address.js";

export const addAddress = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      street,
      city,
      state,
      zipcode,
      country,
    } = req.body;

    const userId = req.user?._id || req.userId;

    if (!userId || !firstName || !lastName || !email || !phone || !street || !city || !state || !zipcode || !country) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const address = await Address.create({
      user: userId,
      firstName,
      lastName,
      email,
      phone,
      street,
      city,
      state,
      zipcode,
      country,
    });

    res.status(201).json({ success: true, address });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user?._id || req.userId;
    const addresses = await Address.find({ user: userId });
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


