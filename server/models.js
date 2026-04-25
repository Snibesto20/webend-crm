import mongoose from 'mongoose';

export const ApiKey = mongoose.model('ApiKey', new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'marketing', 'viewer'], default: 'viewer' },
  owner: { type: String, default: 'unnamed' },
  emailsSent: { type: Number, default: 0 },
}));

export const ClientRegistry = mongoose.model('ClientRegistry', new mongoose.Schema({
  name: { type: String, required: true, unique: true, uppercase: true }
}));

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tag: { type: String, default: 'pending' },
  serviceNeeded: { type: String, default: '' },
  notes: { type: String, default: '' },
  moneyMade: { type: Number, default: 0 },
  marketer: { type: String, default: '' }
}, { timestamps: true });

ClientSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

export const Client = mongoose.model('Client', ClientSchema);