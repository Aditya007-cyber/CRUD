const fs = require('fs')
const express = require('express');

const app = express();

app.use(express.json());  //middleware
app.get('/', (req, res) => {

    res.status(200).json({ message: 'Hello from the server side!', app: 'Natours' });
});

app.post('/', (req, res) => {
    res.send('You can post to this endpoint...')
});

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}\\after-section-06\\dev-data\\data\\tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: (
            tours
        )
    })
});

app.get('/api/v1/tours/:id', (req, res) => {
    console.log(req.params); // params : to read parameters from the url
    const id = req.params.id * 1; // conversion into string
    const tour = tours.find(el => el.id === id)


    if (id > tours.length || !tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: (
            tour
        )
    })
});

app.post('/api/v1/tours', (req, res) => {
    //console.log(req.body)

    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);
    fs.writeFile(`${__dirname}\\after-section-06\\dev-data\\data\\tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    })

});

app.patch('/api/v1/tours/:id', (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour...>'
        }
    });
});

app.delete('/api/v1/tours/:id', (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});