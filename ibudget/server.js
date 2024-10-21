const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');  // For hashing and comparing passwords

const app = express();
const PORT = 5000;

// Configure AWS DynamoDB
AWS.config.update({
  region: 'us-west-2',  // Set your region
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Register Endpoint
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const params = {
    TableName: 'Users',
    Item: {
      username: username,
      passwordHash: hashedPassword,
    },
  };

  // Save user to DynamoDB
  try {
    await dynamoDB.put(params).promise();
    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
});

// Login Endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  const params = {
    TableName: 'Users',
    Key: {
      username: username,
    },
  };

  try {
    // Retrieve user from DynamoDB
    const result = await dynamoDB.get(params).promise();

    if (!result.Item) {
      return res.status(401).send('Invalid credentials');
    }

    const user = result.Item;

    // Compare provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).send('Invalid credentials');
    }

    // Successful login, send username back
    res.status(200).send({
      message: `Welcome ${username}!`,
      username: user.username,
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
