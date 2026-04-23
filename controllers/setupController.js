import User from '../models/User.js';

export const createSuperAdmin = async (req, res) => {
  try {
    // Check if any user already exists
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      return res.status(400).json({ 
        message: 'Setup already completed. Super Admin already exists.' 
      });
    }

    const { email, password, fullName } = req.body;

    const user = new User({
      email,
      password,
      fullName,
      role: 'Super Admin'
    });

    await user.save();

    res.status(201).json({ 
      success: true, 
      message: 'Super Admin created successfully. You can now login.' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
