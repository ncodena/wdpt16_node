import express from 'express';
import Restaurant from '../models/Restaurant.js';
import City from '../models/City.js';
import Tag from '../models/Tag.js';
import Comment from '../models/Comment.js';
const restaurantsRouter = express.Router();


// GET all restaurants
restaurantsRouter.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate('city').populate('tags');;
    res.json(restaurants);
  } catch (err) {
    res.status(500).send({ message: 'Server error' });
  }
});

// POST a new restaurant
restaurantsRouter.post('/', async (req, res) => {
    try {
      const restaurant = new Restaurant(req.body);
      await restaurant.save();
      res.status(201).json(restaurant);
    } catch (err) {
        console.log(err)
      res.status(500).send({ message: 'Server error' });
    }
  });

// POST a new restaurant
restaurantsRouter.post('/tag', async (req, res) => {
  try {
    const tag = new Tag(req.body);
    await tag.save();
    res.status(201).json(tag);
  } catch (err) {
    res.status(500).send({ message: 'Server error' });
  }
});

// POST a new city
restaurantsRouter.post('/city', async (req, res) => {
    try {
      const city = new City(req.body);
      await city.save();
      res.status(201).json(city);
    } catch (err) {
      res.status(500).send({ message: 'Server error' });
    }
  });

  restaurantsRouter.post('/comments', async (req, res) => {
    try {
      const comment = new Comment(req.body);
      await comment.save();
      res.status(201).json(comment);
    } catch (err) {
      res.status(500).send({ message: 'Server error' });
    }
  });

  restaurantsRouter.get('/restaurant/search', async (req, res) => {
    // Extract the tags and city from the query parameters
    const {tags} = req.query
    const {city} = req.query
    console.log(tags)
    console.log(city)
    //console.log(tags.split(','))
    try {
       // If both tags and city are provided, find places that match both
       if (tags && city) {
         const allQuery = await Restaurant.find({ 'tagss': { $in: tags }, 'location.cityName': city });
         res.json(allQuery);
       }

       // If only tags are provided, find restaurant that matches the tags
       else if (tags) {
         const filterTags = await Restaurant.find({ tagss: { $in: tags.split(',') } });
         const filterTags2 = await Restaurant.find({
            tagss: {
                $all: tags.split(','),
            }
        });
         res.json(filterTags2);
       }

    //    If only city is provided, find restaurant that matches the city
       else if (city) {
         const filterCity = await Restaurant.find({ 'location.cityName': city });
         res.json(filterCity);
       }

       // If neither tags nor city are provided, return all restaurants
       else {
         const restaurants = await Restaurant.find();
         res.json(restaurants);
       }
    } catch (error) {
       console.error(error);
       res.status(500).send('Error retrieving restaurants');
    }
   });

// ... Additional CRUD routes ...

export default restaurantsRouter