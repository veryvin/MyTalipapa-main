import Stall from '../models/Stall.js';

// @desc    Get all stalls
// @route   GET /api/stalls
// @access  Public
export const getStalls = async (req, res) => {
  try {
    const stalls = await Stall.find({});
    res.json({ success: true, stalls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new stall
// @route   POST /api/stalls
// @access  Private/Operator
export const addStall = async (req, res) => {
  const { id, section, size, rent, desc } = req.body;

  try {
    // Check if stall exists
    const stallExists = await Stall.findById(id);

    if (stallExists) {
      return res.status(400).json({ message: 'Stall number already exists' });
    }

    const stall = await Stall.create({
      _id: id,
      section,
      size: size || '3m×2m',
      rent: parseInt(rent) || 2500,
      status: 'available',
      renter: null,
      desc: desc || 'Market stall',
    });

    res.status(201).json({ success: true, stall });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a stall
// @route   DELETE /api/stalls/:id
// @access  Private/Operator
export const deleteStall = async (req, res) => {
  try {
    const stall = await Stall.findById(req.params.id);

    if (stall) {
      await Stall.deleteOne({ _id: req.params.id });
      res.json({ success: true, message: 'Stall removed' });
    } else {
      res.status(404).json({ message: 'Stall not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
