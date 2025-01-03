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

// Function to generate a 7-digit or higher random number
const generateRandomCustomerID = () => {
  return Math.floor(1000000 + Math.random() * 9000000); // Ensures a 7-digit number
};

// Function to check if customerID already exists
const isCustomerIDUnique = async (customerID) => {
  const params = {
    TableName: 'Users',
    FilterExpression: 'customerID = :id',
    ExpressionAttributeValues: {
      ':id': customerID,
    },
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    return data.Items.length === 0; // Unique if no matching items are found
  } catch (error) {
    console.error('Error checking customerID uniqueness:', error);
    throw new Error('Database scan failed');
  }
};

// Register Endpoint
app.post('/register', async (req, res) => {
  const { username, email, password, monthlyIncome } = req.body;

  if (!username || !email || !password || !monthlyIncome) {
    return res.status(400).send('All fields are required');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate a unique customerID
  let customerID;
  let isUnique = false;
  do {
    customerID = generateRandomCustomerID();
    isUnique = await isCustomerIDUnique(customerID);
  } while (!isUnique);

  const params = {
    TableName: 'Users',
    Item: {
      username,
      email,
      passwordHash: hashedPassword,
      monthlyIncome,
      customerID,
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
  const {
    username,
    storeName,
    itemName,
    price,
    quantity,
    category,
    paymentMethod,
    transactionDate,
    storeLocation,
    discount,
  } = req.body;

  if (
    !username ||
    !storeName ||
    !itemName ||
    !price ||
    !quantity ||
    !category ||
    !paymentMethod ||
    !transactionDate ||
    !storeLocation ||
    discount === undefined
  ) {
    console.error('Validation error: Missing fields', req.body);
    return res.status(400).send('All fields are required');
  }

  // Fetch the customerID from the Users table
  const userParams = {
    TableName: 'Users',
    Key: { username },
  };

  try {
    const userResult = await dynamoDB.get(userParams).promise();

    if (!userResult.Item || !userResult.Item.customerID) {
      console.error('User not found or missing customerID:', username);
      return res.status(404).send('User not found or missing customerID');
    }

    const customerID = userResult.Item.customerID;

    // Prepare the purchase item
    const totalAmount = parseFloat(price) * parseInt(quantity);
    const purchaseId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const purchaseParams = {
      TableName: 'Purchases',
      Item: {
        purchaseId,
        username,
        customerID, // Add customerID to purchase record
        itemName,
        storeName,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        category,
        paymentMethod,
        transactionDate,
        storeLocation,
        discount: parseFloat(discount),
        totalAmount,
      },
    };

    await dynamoDB.put(purchaseParams).promise();
    console.log('Purchase successfully added:', purchaseParams.Item);
    res.status(201).send('Purchase added successfully');
  } catch (error) {
    console.error('Error adding purchase:', error.stack || error);
    res.status(500).send('Error adding purchase');
  }
});


// Endpoint to get user data
app.get('/user-data', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).send('Username is required');
  }

  const params = {
    TableName: 'Users',
    Key: {
      username: username,
    },
  };

  try {
    const result = await dynamoDB.get(params).promise();
    if (!result.Item) {
      return res.status(404).send('User not found');
    }

    res.status(200).send({
      email: result.Item.email,
      monthlyIncome: result.Item.monthlyIncome,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Error fetching user data');
  }
});

// Endpoint to update user data
app.put('/update-user', async (req, res) => {
  const { username, email, monthlyIncome, newPassword } = req.body;

  if (!username || (!email && !monthlyIncome && !newPassword)) {
    return res.status(400).send('Insufficient data to update');
  }

  let updateExpression = 'set';
  const expressionAttributeValues = {};
  if (email) {
    updateExpression += ' email = :email,';
    expressionAttributeValues[':email'] = email;
  }
  if (monthlyIncome) {
    updateExpression += ' monthlyIncome = :monthlyIncome,';
    expressionAttributeValues[':monthlyIncome'] = monthlyIncome;
  }
  if (newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    updateExpression += ' passwordHash = :passwordHash,';
    expressionAttributeValues[':passwordHash'] = hashedPassword;
  }

  // Remove trailing comma from update expression
  updateExpression = updateExpression.slice(0, -1);

  if (Object.keys(expressionAttributeValues).length === 0) {
    return res.status(400).send('No valid fields to update');
  }

  const params = {
    TableName: 'Users',
    Key: {
      username: username,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues,
  };

  try {
    await dynamoDB.update(params).promise();
    res.status(200).send('User data updated successfully');
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).send('Error updating user data');
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


//endpoint for recomendations
app.get('/recommendations', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    console.error('Username is required');
    return res.status(400).send('Username is required');
  }

  try {
    // Fetch the customerID from the Users table
    const userParams = {
      TableName: 'Users',
      Key: { username },
    };

    const userResult = await dynamoDB.get(userParams).promise();
    console.log('User query result:', userResult);

    if (!userResult.Item || typeof userResult.Item.customerID !== 'number') {
      console.error('User not found or missing numeric customerID:', username);
      return res.status(404).send('User not found or missing valid customerID');
    }

    const customerID = userResult.Item.customerID;
    console.log('Retrieved customerID:', customerID);

    // Fetch recommendations from the Recommendations table
    const recommendationsParams = {
      TableName: 'Recommendations',
      KeyConditionExpression: 'customerID = :customerID',
      ExpressionAttributeValues: {
        ':customerID': customerID,
      },
    };

    const recommendationsResult = await dynamoDB.query(recommendationsParams).promise();
    console.log('Recommendations query result:', recommendationsResult);

    if (!recommendationsResult.Items || recommendationsResult.Items.length === 0) {
      console.error('No recommendations found for customerID:', customerID);
      return res.status(404).send('No recommendations found for this user');
    }

    // Parse the recommendations field
    const recommendations = recommendationsResult.Items.map(item => {
      try {
        let recommendationString = item.recommendations;
    
        // Fix unquoted keys and strings
        recommendationString = recommendationString
          .replace(/([{,])(\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*):/g, '$1"$3":') // Quote keys
          .replace(/: ([^"\[\]\{\}]+?)([,}])/g, ': "$1"$2') // Quote unquoted string values
          .replace(/\[([^"\]]+)\]/g, (_, match) => {
            const formattedArray = match
              .split(',')
              .map(item => `"${item.trim()}"`)
              .join(', ');
            return `[${formattedArray}]`;
          });
    
        const parsed = JSON.parse(recommendationString);
    
        // Ensure numeric fields are numbers
        const spending_limit = parseFloat(parsed.spending_limit);
        const saving_goal = parseFloat(parsed.saving_goal);
    
        // Ensure tips is an array
        const tips = Array.isArray(parsed.custom_tips) ? parsed.custom_tips : [];
    
        return {
          ...parsed,
          spending_limit,
          saving_goal,
          tips,
        };
      } catch (parseError) {
        console.warn('Failed to parse recommendations:', item.recommendations);
        console.log('Parse error:', parseError);
        return null;
      }
    }).filter(Boolean);
    

    console.log('Parsed recommendations:', recommendations);
    res.status(200).send({ recommendations });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).send('Error fetching recommendations');
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
