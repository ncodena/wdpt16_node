import express from 'express';
const app = express();

const port = 8080 || process.env.PORT;

app.get('/', (req, res) => {
    res.send('Welcome to Recipes API')
})

const recipes = [
    {id: 1, title: 'Pizza'},
    {id: 2, title: 'Paella'}
]


app.get('/recipes', (req, res) => {
    const filter = req.query.search;

   if(!filter){
    return res.json(recipes);
   }

    const recipe = recipes.find(recipe => recipe.title.toLowerCase() === filter.toLowerCase());

    if(!recipe){
        return res.status(404).send('Recipe not found')
    }

    res.json(recipe)
})



app.get('/recipes/:id', (req, res) => {

    const recipeId = parseInt(req.params.id);

    const recipe = recipes.find(recipe => recipe.id === recipeId);

    if(!recipe){
        return res.status(404).send('Recipe not found')
    }

    res.json(recipe);
})

app.post('/recipes', (req, res) => {
    res.json({sucess: 'New recipe created'})
})



app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})