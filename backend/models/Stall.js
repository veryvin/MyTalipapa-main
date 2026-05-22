import mongoose from 'mongoose';

const stallSchema = new mongoose.Schema(
  {
    _id: {
      type: String, // E.g., 'A-01', 'B-02'
      required: true,
    },
    section: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
      required: true,
      default: '3m×2m',
    },
    rent: {
      type: Number,
      required: true,
      default: 2500,
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'occupied'],
      default: 'available',
    },
    renter: {
      type: String, // Custom renter name or reference, standard matches the mock string name
      default: null,
    },
    desc: {
      type: String,
      default: 'Market stall',
    },
  },
  {
    timestamps: true,
    _id: false, // Tell mongoose we are defining our own custom string _id
  }
);

const Stall = mongoose.model('Stall', stallSchema);
export default Stall;
