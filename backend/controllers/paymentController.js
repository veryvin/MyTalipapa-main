import Payment from '../models/Payment.js';

// @desc    Get all payments (Operators see all, renters see theirs)
// @route   GET /api/payments
// @access  Private
export const getPayments = async (req, res) => {
  try {
    let payments;

    if (req.user.role === 'operator') {
      payments = await Payment.find({}).sort({ createdAt: -1 });
    } else {
      // Find payments by matching renter name
      payments = await Payment.find({ renter: req.user.name }).sort({ createdAt: -1 });
    }

    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Process/mark a payment as paid
// @route   PUT /api/payments/:id/pay
// @access  Private
export const payRent = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment ledger item not found' });
    }

    // In a real application, check if the currentUser is the renter of this payment or an operator
    if (req.user.role !== 'operator' && payment.renter !== req.user.name) {
      return res.status(403).json({ message: 'Not authorized to pay this statement' });
    }

    if (payment.status === 'paid') {
      return res.status(400).json({ message: 'This bill has already been paid' });
    }

    payment.status = 'paid';
    payment.paid = new Date();
    await payment.save();

    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
