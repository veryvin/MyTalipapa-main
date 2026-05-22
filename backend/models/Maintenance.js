import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema(
  {
    issue: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      default: 'General',
    },
    reporter: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'resolved'],
      default: 'pending',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    desc: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);
export default Maintenance;
