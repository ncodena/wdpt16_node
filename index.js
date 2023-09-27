import express from 'express';
import { body, validationResult } from 'express-validator';

const app = express();

// Parse JSON request bodies
// This middleware is responsible for parsing incoming request bodies, making it available under req.body.
app.use(express.json());

const port = 8080 || process.env.PORT;

const countries = [
    { id: 1, name: 'Bhutan', alpha2Code: 'BT', alpha3Code: 'BTN', visited: false },
    { id: 2, name: 'France', alpha2Code: 'FR', alpha3Code: 'FRA', visited: false },
    { id: 3, name: 'Japan', alpha2Code: 'JP', alpha3Code: 'JPN', visited: false },
    { id: 4, name: 'Australia', alpha2Code: 'AU', alpha3Code: 'AUS', visited: false },
    { id: 5, name: 'South Africa', alpha2Code: 'ZA', alpha3Code: 'ZAF', visited: false }
];

const countryValidation = [
    body('name').isString().optional(),
    body('alpha2Code').isLength({ min: 2, max: 2 }).optional(),
    body('alpha3Code').exists().isLength({ min: 3, max: 3 }).optional(),
    body('visited').isBoolean().optional()
];

app.get('/api/countries', (req, res) => {
    let responseCountries = countries;
    if (req.query.sort === "true") {
        responseCountries = [...countries].sort((a, b) => a.name.localeCompare(b.name));
    }

    if (req.query.visited === 'true') {
        responseCountries = responseCountries.filter(country => country.visited === true);
    }
    res.json(responseCountries);
});


app.post('/api/countries', countryValidation, (req, res) => {
    console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const existingCountry = countries.find(country => country.alpha2Code === req.body.alpha2Code || country.alpha3Code === req.body.alpha3Code);
    if (existingCountry) {
        return res.status(400).json({ error: "Country already exists" });
    }

    const newCountry = {
        id: countries.length + 1,
        ...req.body
    };
    countries.push(newCountry);
    res.status(201).json(newCountry);
});

app.get('/api/countries/:code', (req, res) => {
    const code = req.params.code.toUpperCase();
    console.log(code, 'code')
    const country = countries.find(country => country.alpha2Code === code || country.alpha3Code === code);
    
    if (!country) {
        return res.status(404).json({ error: "Country not found" });
    }

    res.json(country);
});

app.put('/api/countries/:code', countryValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const code = req.params.code.toUpperCase();
    const country = countries.find(country => country.alpha2Code === code || country.alpha3Code === code);
    
    if (!country) {
        return res.status(404).json({ error: "Country not found" });
    }
    //If a property exists in both country and req.body, the value in country will be overwritten by the value from req.body.
    //If a property exists only in req.body, it will be added to country.
    //If a property exists only in country, it will remain unchanged.
    Object.assign(country, req.body);
    res.json(country);
});

app.delete('/api/countries/:code', (req, res) => {
    const code = req.params.code.toUpperCase();
    const country = countries.find(country => country.alpha2Code === code || country.alpha3Code === code);
    
    if (!country) {
        return res.status(404).json({ error: "Country not found" });
    }

    country.visited = !country.visited;
    res.json(country);
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})