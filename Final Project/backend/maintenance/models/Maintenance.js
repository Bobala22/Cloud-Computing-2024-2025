import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    carId: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: ['engine', 'transmission', 'brakes', 'suspension', 'electrical', 'other'],
    },

    description: {
      type: String,
      required: true,
    },

    dateObserved: {
      type: Date,
    },

    urgency: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },

    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved'],
      default: 'open',
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

const Maintenance = mongoose.model('Maintenance', maintenanceSchema, 'Maintenance');
export default Maintenance;