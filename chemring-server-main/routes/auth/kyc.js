const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var router = express.Router();

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB only if not already connected
// if (mongoose.connection.readyState === 0) {
//   mongoose.connect(process.env.DB_CONNECTION_STRING, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   });
// }

// Create a MongoDB model for storing image URLs
const Image = mongoose.model('Image', {
  imageUrl: String,
  owner: String,
  docNum: String,
});

// Middleware to parse JSON in requests
router.use(bodyParser.json());

// Endpoint to store image URL
router.post('/kyc', async (req, res) => {
  try {
    const { imageUrl, owner, docNum } = req.body;

    // Create a new document in the 'images' collection
    const image = new Image({ imageUrl, owner, docNum });
    await image.save();

    res.status(201).json({ message: 'Image URL stored successfully' });
  } catch (error) {
    console.error('Error storing image URL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/kyc2', async (req, res) => {
  try {
    const { imageUrl2 } = req.body;
    const imageUrl = imageUrl2;

    // Create a new document in the 'images' collection
    const image = new Image({ imageUrl });
    await image.save();

    res.status(201).json({ message: 'Image URL stored successfully' });
  } catch (error) {
    console.error('Error storing image URL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/kyc3', async (req, res) => {
  try {
    const { imageUrl3 } = req.body;
    const imageUrl = imageUrl3;

    // Create a new document in the 'images' collection
    const image = new Image({ imageUrl });
    await image.save();

    res.status(201).json({ message: 'Image URL stored successfully' });
  } catch (error) {
    console.error('Error storing image URL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint for fetching images
router.get('/kyc/fetch-images', async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = router;
