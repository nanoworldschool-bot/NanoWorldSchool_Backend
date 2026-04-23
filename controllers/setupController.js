import User from '../models/User.js';
import Settings from '../models/Settings.js';
import Content from '../models/Content.js';

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

    // 2. Seed Default Settings
    const settings = new Settings({
      siteName: 'Nano World School',
      announcementText: 'Welcome to Nano World School - Admissions Open for 2024-25!',
      announcementActive: true
    });
    await settings.save();

    // 3. Seed Default Home Content
    const homeContent = new Content({
      pageId: 'home',
      content: {
        hero: {
          title: 'Empowering Minds, Shaping Futures',
          subtitle: 'Experience excellence in education with Nano World School.'
        },
        about: {
          title: 'About Our School',
          text: 'Nano World School is dedicated to providing a holistic learning environment...'
        }
      }
    });
    await homeContent.save();

    res.status(201).json({ 
      success: true, 
      message: 'Super Admin created and default content seeded successfully.' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
