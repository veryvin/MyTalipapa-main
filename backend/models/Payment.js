import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    renter: {
      type: String,
      required: true,
    },
    stallId: {
      type: String,
      ref: 'Stall',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    due: {
      type: Date,
      required: true,
    },
    paid: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['paid', 'unpaid'],
      default: 'unpaid',
    },
    month: {
      type: String,
      required: true, // e.g. "May 2026"
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
