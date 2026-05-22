import Maintenance from '../models/Maintenance.js';

// @desc    Get all maintenance tickets (Operators see all, renters see theirs)
// @route   GET /api/maintenance
// @access  Private
export const getMaintenance = async (req, res) => {
  try {
    let tickets;

    if (req.user.role === 'operator') {
      tickets = await Maintenance.find({}).sort({ createdAt: -1 });
    } else {
      tickets = await Maintenance.find({ reporter: req.user.name }).sort({ createdAt: -1 });
    }

    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit a new maintenance request
// @route   POST /api/maintenance
// @access  Private
export const submitMaintenance = async (req, res) => {
  const { issue, priority, desc } = req.body;

  try {
    const ticket = await Maintenance.create({
      issue,
      location: req.user.stallId || 'General',
      reporter: req.user.name,
      priority: priority || 'medium',
      status: 'pending',
      desc: desc || '',
    });

    res.status(201).json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resolve a maintenance request
// @route   PUT /api/maintenance/:id/resolve
// @access  Private/Operator
export const resolveMaintenance = async (req, res) => {
  try {
    const ticket = await Maintenance.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Maintenance ticket not found' });
    }

    ticket.status = 'resolved';
    await ticket.save();

    res.json({ success: true, message: 'Maintenance ticket resolved', ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
