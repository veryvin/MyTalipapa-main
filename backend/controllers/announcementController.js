import Announcement from '../models/Announcement.js';
import Notification from '../models/Notification.js';

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({}).sort({ createdAt: -1 });
    res.json({ success: true, announcements });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Post a new announcement
// @route   POST /api/announcements
// @access  Private/Operator
export const postAnnouncement = async (req, res) => {
  const { title, category, priority, msg } = req.body;

  try {
    const announcement = await Announcement.create({
      title,
      category: category || 'general',
      priority: priority || 'normal',
      msg,
    });

    // Automatically create a global notification
    await Notification.create({
      userId: null, // null represents global notification broadcasted to all
      icon: category === 'emergency' ? '🚨' : '📢',
      bg: category === 'emergency' ? '#fce4ec' : '#fff3cd',
      title: 'New Announcement',
      desc: title,
      read: false,
    });

    res.status(201).json({ success: true, announcement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Operator
export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (announcement) {
      await Announcement.deleteOne({ _id: req.params.id });
      res.json({ success: true, message: 'Announcement deleted' });
    } else {
      res.status(404).json({ message: 'Announcement not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
