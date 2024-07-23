import express from 'express';
import cors from 'cors'; // Import the cors middleware
import { AccessToken } from 'livekit-server-sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Environment variables for LiveKit API key and secret
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;

// WebSocket URL (Make sure this is correct)
const LIVEKIT_URL = 'wss://videoconference-kud1sbqa.livekit.cloud';

app.use(cors({
  origin: 'http://localhost:3001', // Allow requests from this origin
}));
app.use(express.json());

// Endpoint to generate token
app.post('/token', async (req, res) => {
  const { identity, roomName } = req.body;

  if (!identity || !roomName) {
    return res.status(400).send('Identity and RoomName are required');
  }

  try {
    const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity,
    });

    token.addGrant({
      roomJoin: true,
      room: roomName,
    });

    // Wait for the token to be generated
    const jwt = await token.toJwt();
    console.log('WebSocket URL:', LIVEKIT_URL);
    console.log('Generated Token:', jwt); // Log the actual token string

    res.json({ url: LIVEKIT_URL, token: jwt });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).send('Error generating token');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
