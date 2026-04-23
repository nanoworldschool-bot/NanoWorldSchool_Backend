import Enquiry from '../models/Enquiry.js';
import Gallery from '../models/Gallery.js';
import User from '../models/User.js';

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
  try {
    const [enquiriesCount, galleryCount, usersCount, recentEnquiries] = await Promise.all([
      Enquiry.countDocuments(),
      Gallery.countDocuments(),
      User.countDocuments(),
      Enquiry.find().sort({ createdAt: -1 }).limit(5)
    ]);

    res.status(200).json({
      counts: {
        enquiries: enquiriesCount,
        gallery: galleryCount,
        users: usersCount,
        pages: 5 // Static for now
      },
      recentEnquiries
    });
  } catch (error) {
    console.error(`[DashboardController] getStats Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};
