import mongoose from 'mongoose';

export interface IToken {
  token: string;
  userId: mongoose.Types.ObjectId;
}

const tokenSchema = new mongoose.Schema<IToken>({
  token: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

export default mongoose.model<IToken>('Token', tokenSchema);
