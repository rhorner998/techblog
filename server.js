const app = require('./app'); // Import the Express app configuration from app.js
const PORT = process.env.PORT || 3000;
//n
// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});