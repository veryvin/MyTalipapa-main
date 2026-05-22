import Application from '../models/Application.js';
import Stall from '../models/Stall.js';
import User from '../models/User.js';
import Payment from '../models/Payment.js';
import Notification from '../models/Notification.js';

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private
export const getApplications = async (req, res) => {
  try {
    let applications;

    if (req.user.role === 'operator') {
      // Operator sees all applications
      applications = await Application.find({}).sort({ createdAt: -1 });
    } else {
      // Renter sees only their own applications
      applications = await Application.find({ userId: req.user._id }).sort({ createdAt: -1 });
    }

    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit a new rental application
// @route   POST /api/applications
// @access  Private (Renter only)
export const submitApplication = async (req, res) => {
  const { stallId, biz, msg } = req.body;

  try {
    const stall = await Stall.findById(stallId);

    if (!stall) {
      return res.status(404).json({ message: 'Stall not found' });
    }

    if (stall.status !== 'available') {
      return res.status(400).json({ message: 'Stall is not available for lease' });
    }

    // Create application
    const application = await Application.create({
      applicant: req.user.name,
      userId: req.user._id,
      stallId,
      biz,
      msg: msg || '',
    });

    // Update stall status to reserved
    stall.status = 'reserved';
    await stall.save();

    res.status(201).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Review/approve or reject an application
// @route   PUT /api/applications/:id/review
// @access  Private/Operator
export const reviewApplication = async (req, res) => {
  const { status } = req.body; // 'approved' or 'rejected'

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Must be approved or rejected' });
  }

  try {
    const app = await Application.findById(req.params.id);

    if (!app) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (app.status !== 'pending') {
      return res.status(400).json({ message: 'Application has already been reviewed' });
    }

    // Update application status
    app.status = status;
    await app.save();

    // Find the associated stall
    const stall = await Stall.findById(app.stallId);
    if (!stall) {
      return res.status(404).json({ message: 'Stall associated with application not found' });
    }

    if (status === 'approved') {
      // Update stall status to occupied and assign renter name
      stall.status = 'occupied';
      stall.renter = app.applicant;
      await stall.save();

      // Update the user details to have a stallId
      const applicantUser = await User.findById(app.userId);
      if (applicantUser) {
        applicantUser.stallId = app.stallId;
        await applicantUser.save();
      }

      // Create a mock payment ledger item for renter
      const dueDays = 15;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + dueDays);

      const options = { month: 'long', year: 'numeric' };
      const currentMonth = new Date().toLocaleDateString('en-US', options);

      await Payment.create({
        renter: app.applicant,
        stallId: app.stallId,
        amount: stall.rent || 2500,
        due: dueDate,
        paid: null,
        status: 'unpaid',
        month: currentMonth,
      });

      // Create success notification for user
      await Notification.create({
        userId: app.userId,
        icon: '📋',
        bg: '#e8f5e9',
        title: 'Application Approved',
        desc: `Your application for Stall ${app.stallId} has been approved!`,
        read: false,
      });
    } else {
      // If rejected, set stall back to available
      stall.status = 'available';
      await stall.save();

      // Create rejection notification for user
      await Notification.create({
        userId: app.userId,
        icon: '❌',
        bg: '#fce4ec',
        title: 'Application Rejected',
        desc: `Your application for Stall ${app.stallId} has been rejected.`,
        read: false,
      });
    }

    res.json({ success: true, message: `Application ${status} successfully`, app });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
