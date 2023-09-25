import express from 'express';
import {pets} from './petList.js';
const app = express();

const port = 8080 || process.env.PORT;

app.get('/', (req, res) => {
    res.send(`
      <h1>Adopt a Pet!</h1>
      <p>Browse through the links below to find your new furry friend:</p>
      <ul>
        <li><a href="/animals/dogs">Dogs</a></li>
        <li><a href="/animals/cats">Cats</a></li>
        <li><a href="/animals/rabbits">Rabbits</a></li>
      </ul>
    `);
});



app.get('/animals/:pet_type', (req, res) => {
    const petType = req.params.pet_type;
    const petList = pets[petType];
    
    let content = `<h1>List of ${petType}</h1>`;
    content += '<ul>';
    
    petList.forEach((pet, index) => {
      content += `<li><a href="/animals/${petType}/${pet.name}">${pet.name}</a></li>`;
    });
    
    content += '</ul>';
    
    res.send(content);
  });

  app.get('/animals/:pet_type/:pet_name', (req, res) => {
    const petType = req.params.pet_type;
    const petName = req.params.pet_name;
    const typePet = pets[petType];
    const findPet = typePet.find(pet => pet.name.toLowerCase() === petName.toLowerCase());
    if(!findPet) {
      res.status(404).send("Pet not found");
      return;
    }
  
    let content = `<h1>${findPet.name}</h1>`;
    content += `<img src="${findPet.url}" alt="${findPet.name}"/>`;
    content += `<p>${findPet.description}</p>`;
    content += `<ul><li>Breed: ${findPet.breed}</li><li>Age: ${findPet.age}</li></ul>`;
    
    res.send(content);
  });



app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})