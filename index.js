import express  from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 1000;

import pgPromise from "pg-promise";
const pgp = pgPromise();

app.use(express.json());


// Configure PostgreSQL connection
const db = pgp({
      user: process.env.DBUSER,
      host: process.env.DBHOST,
      database: process.env.DBNAME,
      password: process.env.DBPASS,
      port: process.env.DBPORT, // Default PostgreSQL port
});


app.get('/users', async (req, res) => {
      try {
            db.none(`
            CREATE TABLE IF NOT EXISTS users (
              id SERIAL PRIMARY KEY,
              username VARCHAR(50) UNIQUE NOT NULL,
              email VARCHAR(100) UNIQUE NOT NULL,
              password VARCHAR(100) NOT NULL
            )`);
          res.send('Users table created successfully!');
      } catch (error) {
          console.error('Error fetching users:', error);
          res.status(500).json({ error: 'Error fetching users' });
      }
});

// Route to get users table data
app.get('/get-users', async (req, res) => {
      try {
        // Fetch data from the users table
        const users = await db.any('SELECT * FROM users');
        res.json(users);
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
      }
});

// Route to insert user info into the users table
app.post('/users', async (req, res) => {
      try {
        const { username, email, password } = req.body;
    
        // Check if username or email already exists
        const existingUser = await db.oneOrNone('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
        if (existingUser) {
          return res.status(400).json({ error: 'Username or email already exists' });
        }
    
        // Insert user info into the users table
        await db.none('INSERT INTO users(username, email, password) VALUES($1, $2, $3)', [username, email, password]);
        res.status(201).json({ message: 'User created successfully' });
      } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal Server Error');
      }
});


app.get('/admin/sign-up',(req,res,next)=>{
      console.log("Admin");
      res.json({
            "message": "login into Admin"
      })
});

app.get('/sign-up',(req,res,next)=>{
      console.log('Users')
})

// Connect to the database and start the server only if the connection is successful
db.connect()
      .then(obj => {
            obj.done(); // success, release the connection;
            app.listen(port, () => {
                  console.log('Server is running on port '+port);
            });
      })
      .catch(error => {
            console.error('Error connecting to the database:', error);
});