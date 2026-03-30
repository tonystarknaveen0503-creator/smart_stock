import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
  },
  { timestamps: true },
)

const watchlistSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    symbol: { type: String, required: true, uppercase: true },
  },
  { timestamps: true },
)

const User = mongoose.models.User || mongoose.model('User', userSchema)
const Watchlist = mongoose.models.Watchlist || mongoose.model('Watchlist', watchlistSchema)

export { User, Watchlist }
