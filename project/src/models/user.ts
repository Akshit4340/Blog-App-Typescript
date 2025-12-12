import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  firstName?: string;
  lastName?: string;
  socials?: {
    facebook?: string;
    x?: string;
    linkedin?: string;
    instagram?: string;
    website?: string;
    youtube?: string;
  };
}

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: [true, 'Username must be unique'],
    maxLength: [50, 'Username cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'Email must be unique'],
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters long'],
    select: false,
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: 'Role must be either user or admin',
    },
    default: 'user',
    required: [true, 'Role is required'],
  },
  firstName: {
    type: String,
    maxLength: [30, 'First name cannot exceed 30 characters'],
  },
  lastName: {
    type: String,
    maxLength: [30, 'Last name cannot exceed 30 characters'],
  },
  socials: {
    facebook: {
      type: String,
      match: [
        /^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/,
        'Please fill a valid Facebook URL',
      ],
    },
    x: {
      type: String,
      match: [
        /^(https?:\/\/)?(www\.)?x.com\/[a-zA-Z0-9(\.\?)?]/,
        'Please fill a valid X URL',
      ],
    },
    linkedin: {
      type: String,
      match: [
        /^(https?:\/\/)?(www\.)?linkedin.com\/[a-zA-Z0-9(\.\?)?]/,
        'Please fill a valid LinkedIn URL',
      ],
    },
    instagram: {
      type: String,
      match: [
        /^(https?:\/\/)?(www\.)?instagram.com\/[a-zA-Z0-9(\.\?)?]/,
        'Please fill a valid Instagram URL',
      ],
    },
    website: {
      type: String,
      match: [
        /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}([\/\w \.-]*)*\/?$/,
        'Please fill a valid website URL',
      ],
    },
    youtube: {
      type: String,
      match: [
        /^(https?:\/\/)?(www\.)?youtube.com\/[a-zA-Z0-9(\.\?)?]/,
        'Please fill a valid YouTube URL',
      ],
    },
  },
});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model<IUser>('User', userSchema);
