const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');  // Enables CORS
const app = express();
const port = 3000;

// Middleware to parse JSON data
app.use(cors());  // Allow requests from any origin
app.use(express.json());

// MySQL Database Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Your MySQL username
  password: 'chinni2420',  // Your MySQL password
  database: 'mobile_store',  // Database name
});

// Check MySQL Connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// Get all mobiles from the database
app.get('/mobiles', (req, res) => {
  connection.query('SELECT * FROM mobiles', (err, results) => {
    if (err) {
      console.error('Error fetching data from database:', err);  // Log error
      return res.status(500).json({ message: 'Error fetching data from database' });
    }
    console.log('Data fetched from database:', results);  // Log successful data fetch
    return res.status(200).json(results);  // Return the fetched data
  });
});

// Add a new mobile to the database
app.post('/mobiles', (req, res) => {
  const { name, brand, price, rating } = req.body;
  const query = 'INSERT INTO mobiles (name, brand, price, rating) VALUES (?, ?, ?, ?)';
  
  connection.query(query, [name, brand, price, rating], (err, result) => {
    if (err) {
      console.error('Error adding mobile:', err);
      return res.status(500).json({ message: 'Error adding mobile' });
    }
    console.log('New mobile added:', result);
    return res.status(201).json({
      id: result.insertId, 
      name, 
      brand, 
      price, 
      rating
    });
  });
});

// Update an existing mobile in the database
app.put('/mobiles/:id', (req, res) => {
  const { id } = req.params;
  const { name, brand, price, rating } = req.body;

  const query = 'UPDATE mobiles SET name = ?, brand = ?, price = ?, rating = ? WHERE id = ?';
  
  connection.query(query, [name, brand, price, rating, id], (err, result) => {
    if (err) {
      console.error('Error updating mobile:', err);
      return res.status(500).json({ message: 'Error updating mobile' });
    }
    console.log('Mobile updated:', result);
    return res.status(200).json({
      id, 
      name, 
      brand, 
      price, 
      rating
    });
  });
});

// Delete a mobile from the database
app.delete('/mobiles/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM mobiles WHERE id = ?';
  
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting mobile:', err);
      return res.status(500).json({ message: 'Error deleting mobile' });
    }
    console.log('Mobile deleted:', result);
    return res.status(200).json({ message: 'Mobile deleted successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
app.get('/', (req, res) => {
  res.send('Backend API is running. Use /mobiles to interact.');
});

