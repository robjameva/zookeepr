const express = require('express');
const { animals } = require('./data/animals.json')
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

function filterByQuery(query, animalsArray) {
    let filteredResults = animalsArray;
    let personalityTraitsArray = [];

    if (query.personalityTraits) {
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
    }
    personalityTraitsArray.forEach(trait => {
        filteredResults = filteredResults.filter(
            animal => animal.personalityTraits.indexOf(trait) !== -1
        );
    });
    if (query.diet) filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    if (query.species) filteredResults = filteredResults.filter(animal => animal.species === query.species);
    if (query.name) filteredResults = filteredResults.filter(animal => animal.name === query.name);
    return filteredResults;
}

function findById(id, animalsArray) {
    return animalsArray.filter(animal => animal.id === id)[0];
}

function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    )
    return animal;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') return false;
    if (!animal.species || typeof animal.species !== 'string') return false;
    if (!animal.diet || typeof animal.diet !== 'string') return false;
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) return false;
    return true;
}



app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) results = filterByQuery(req.query, results);
    res.json(results)
})

app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals)
    if (result) {
        res.json(result)
    } else {
        res.sendStatus(404)
    }
})

app.post('/api/animals', (req, res) => {
    req.body.id = animals.length.toString();

    if (!validateAnimal(req.body)) {
        res.sendStatus(400).send('The animal is not properly formatted.')
    } else {
        const animal = createNewAnimal(req.body, animals);
        res.json(req.body);
    }
});

app.get('/', (res, req) => {
    req.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/animals', (res, req) => {
    req.sendFile(path.join(__dirname, './public/animals.html'));
});

app.get('/zookeepers', (res, req) => {
    req.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

app.get('*', (res, req) => {
    req.sendFile(path.join(__dirname, './public/index.html'));
});


app.listen(PORT, () => console.log(`API server is now on port ${PORT}`))