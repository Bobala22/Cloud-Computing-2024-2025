import express from 'express';
import axios from 'axios';
import cors from 'cors';
import pg from 'pg';

const app = express();
app.use(express.json());
app.use(cors());

const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'social_network',
  password: 'postgres',
  port: 5432,
});

function getUserId(email) {
  return new Promise((resolve, reject
  ) => {
    pool.query(`SELECT id FROM users WHERE email = $1`, [email], (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results.rows);
    });
  })
}

function checkEmail(email) {
  return new Promise((resolve, reject
  ) => {
    pool.query(`SELECT * FROM users WHERE email = $1`, [email], (error, results) => {
      if (error) {
        reject(error);
      }
      resolve(results.rows);
    });
  })
}

app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const googleResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const { email } = googleResponse.data;

    const users = await checkEmail(email);
    if (users.length === 0) {
      return res.status(403).json({
        message: 'User not found!'
      });
    }

    const userId = await getUserId(email);

    return res.status(200).json({
      message: 'Authentication successful',
      user: { 
        email: email,
        id: userId,
      }
    });

  } catch (error) {
    console.error('Error verifying Google token:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

app.post('/api/auth/google/signup', async (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }
  
  try {
    const googleResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    const { email, name } = googleResponse.data;
    
    const existingUsers = await checkEmail(email);
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        message: 'User with this email already exists'
      });
    }
    
    const query = `
      INSERT INTO users (name, email, auth_type) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `;
    
    const values = [name, email, 'google'];
    const result = await pool.query(query, values);
    const newUser = result.rows[0];
    
    const authToken = Buffer.from(`${newUser.id}:${Date.now()}`).toString('base64');
    
    return res.status(201).json({ 
      message: 'Sign up successful',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
      token: authToken
    });
    
  } catch (error) {
    console.error('Error during Google sign up:', error);
    return res.status(500).json({ message: 'Server error during sign up' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});