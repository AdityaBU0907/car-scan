const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const QRCode = require('qrcode');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'new_password',  // your database password
    database: 'car_owners'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database');
});

// Get all car owners (including barcodes)
app.get('/api/car_owners', (req, res) => {
    const query = 'SELECT * FROM car_owners';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Failed to fetch data' });
        }
        
        res.status(200).json(results);
    });
});

// Add a new car owner (with QR code generation)
app.post('/api/car_owners', (req, res) => {
  const { owner_name, car_number, contact_number, email, address, company, department, aadhar_id } = req.body;

  // Create a string with all details to encode in the QR code
  const qrCodeData = `
  Owner Name: ${owner_name}
  Car Number: ${car_number}
  Contact Number: ${contact_number}
  Email: ${email}
  Address: ${address}
  Company: ${company}
  Department: ${department}
  Aadhar ID: ${aadhar_id}
  `;

  // Generate QR code as base64 image
  QRCode.toDataURL(qrCodeData, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (err) {
          console.error('Error generating QR code:', err);
          return res.status(500).json({ error: 'Failed to generate QR code' });
      }

      // Store the new car owner with the generated barcode
      const newOwner = {
          owner_name,
          car_number,
          contact_number,
          email,
          address,
          company,
          department,
          aadhar_id,
          barcode: url   // The barcode (QR code) image data as a base64-encoded string
      };

      const query = 'INSERT INTO car_owners (owner_name, car_number, contact_number, email, address, company, department, aadhar_id, barcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      db.query(query, [owner_name, car_number, contact_number, email, address, company, department, aadhar_id, url], (err, result) => {
          if (err) {
              console.error('Error inserting data into the database:', err);
              return res.status(500).json({ error: 'Failed to insert data' });
          }
          res.status(201).json(newOwner);
      });
  });
});

// Route for searching car owners
app.get('/api/search', (req, res) => {
    const searchQuery = req.query.query;
    const sql = 'SELECT * FROM car_owners WHERE car_number LIKE ? OR barcode LIKE ?';

    db.query(sql, [`%${searchQuery}%`, `%${searchQuery}%`], (error, results) => {
        if (error) {
            console.error('Error during search:', error);
            return res.status(500).send('Server error');
        }
        res.json(results);
    });
});

// Delete a car owner by ID
app.delete('/api/car_owners/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM car_owners WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting data:', err);
            return res.status(500).json({ error: 'Failed to delete data' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Data not found' });
        }

        res.status(200).json({ message: 'Data deleted successfully' });
    });
});

// Start the server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
// Route for searching car owners
app.get('/api/search', (req, res) => {
  const searchQuery = req.query.query;
  const sql = 'SELECT * FROM car_owners WHERE car_number LIKE ?';
  
  db.query(sql, [`%${searchQuery}%`], (error, results) => {
      if (error) {
          return res.status(500).send('Server error');
      }
      res.json(results);
  });
});
