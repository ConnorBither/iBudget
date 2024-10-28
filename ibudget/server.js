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
  const { username, email, password, monthlyIncome } = req.body;

  if (!username || !email || !password || !monthlyIncome) {
    return res.status(400).send('All fields are required');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const params = {
    TableName: 'Users',
    Item: {
      username: username,
      email: email,
      passwordHash: hashedPassword,
      monthlyIncome: monthlyIncome,
    },
  };

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

app.post('/add-purchase', async (req, res) => {
  const { username, storeName, itemName, price, quantity, category } = req.body;

  if (!username || !storeName || !itemName || !price || !quantity || !category) {
    return res.status(400).send('All fields are required');
  }

  const params = {
    TableName: 'Purchases',
    Item: {
      purchaseId: new Date().getTime().toString(),  // Unique ID for each purchase
      username: username,
      storeName: storeName,
      itemName: itemName,
      price: price,
      quantity: quantity,
      category: category,
      purchaseDate: new Date().toISOString(),
    },
  };

  // Save purchase to DynamoDB
  try {
    await dynamoDB.put(params).promise();
    res.status(201).send('Purchase added successfully');
  } catch (error) {
    console.error('Error adding purchase:', error);
    res.status(500).send('Error adding purchase');
  }
});

// Retrieve purchases for user with pagination
app.get('/purchases', async (req, res) => {
  const { username, limit = 100, lastKey } = req.query;

  if (!username) {
    return res.status(400).send('Username is required');
  }

  const params = {
    TableName: 'Purchases',
    KeyConditionExpression: 'username = :username',
    ExpressionAttributeValues: {
      ':username': username,
    },
    Limit: parseInt(limit),
    ExclusiveStartKey: lastKey ? JSON.parse(lastKey) : undefined, // Handle pagination
  };

  try {
    const result = await dynamoDB.query(params).promise();
    res.status(200).send({
      purchases: result.Items,
      lastKey: result.LastEvaluatedKey ? JSON.stringify(result.LastEvaluatedKey) : null,
    });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).send('Error fetching purchases');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
