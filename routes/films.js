import express from 'express';
const filmsRouter = express.Router();
import Film from '../models/Film.js';
import { middlewareAuthorizationFunction } from '../middlewares/authMiddleware.js';
import multer from 'multer';
import Image from '../models/City.js';

filmsRouter.use(middlewareAuthorizationFunction);

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

filmsRouter.get('/images', async (req, res) => {
    try {
      const images = await Image.find();
      console.log(images, 'images')
      res.status(200).json(images);
    } catch (error) {
        console.log(error)
      res.status(500).send({ message: "Error fetching images", error });
    }
  });

filmsRouter.get("/", async (req, res) => {
    try {
      const response = await Film.find();
      res.json(response)

    } catch(err){
        res.status(500).json(err)
    }
})

filmsRouter.get("/:id", async (req, res) => {
    const {id} = req.params;
    try {
      const response = await Film.findById(id);
      res.json(response)

    } catch(err){
        res.status(500).json(err)
    }
})

filmsRouter.post("/", upload.single('image'), async (req, res) => {
    try {
        const { name, year, genre } = req.body;
        let imgBase64 = '';

        // If there's an uploaded file, convert it to base64 string
        if (req.file) {
            imgBase64 = req.file.buffer.toString('base64');
        }

        const newFilm = new Film({
            name,
            year,
            genre,
            img: imgBase64
        });

        const response = await newFilm.save();
        res.json(response);
    } catch(err) {
        res.status(500).json(err);
    }
});


filmsRouter.put("/:id", async (req, res) => {
    try {
        const {name, year, genre} = req.body;
        const {id} = req.params;
        const response = await Film.findByIdAndUpdate(id, {name, year, genre});
        res.json(response)
    } catch(err){
        console.log(err)
        res.status(500).json(err)
    }
})



filmsRouter.post('/upload', upload.single('image'), async (req, res) => {
    try {
      const newImage = new Image({
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        imageBase64: req.file.buffer.toString('base64'),
      });
  
      await newImage.save();
  
      res.status(201).send({ message: "Image uploaded successfully" });
    } catch (error) {
      res.status(400).send({ message: "Failed to upload image", error });
    }
  });
  

  

export default filmsRouter;
