const Joi = require('joi');
const express = require('express');
const app = express ();
app.use(express.json());

// route
var birds = require('./birds')
app.use('/birds', birds);

const courses = [
    { id: 1, name: 'course 1' },
    { id: 2, name: 'course 2' },
    { id: 3, name: 'course 3' }  
];

app.get('/', (req, res) => {
    res.send('Hello World !!!');
});
app.get('/api/courses', (req, res) => {
    res.send(courses);
});
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id == parseInt(req.params.id));
    if (!course) {
        res.status(404).send('The course with the given ID was not found.');
    } else {
        res.send(course);
    }
});
app.get('/api/posts/:year/:month', (req, res) => {
    res.send([req.params, req.query]);
});

app.post('/api/courses', (req, res) => {
    // validate
    const { error } = validateCourse(req.body);
    if (error) {
        res.status(404).send({ status: false, message: error.details[0].message });
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    // check course
    const course = courses.find(c => c.id == parseInt(req.params.id));
    if (!course) {
        res.status(404).send('The course with the given ID was not found.');
    }

    // validate
    const { error } = validateCourse(req.body);
    if (error) {
        res.status(404).send({ status: false, message: error.details[0].message });
        return;
    }

    course.name = req.body.name;
    res.send(course);

    console.log(courses);
});

app.delete('/api/courses/:id', (req, res) => {
    // check course
    const course = courses.find(c => c.id == parseInt(req.params.id));
    if (!course) {
        res.status(404).send({ status: false, message: 'The course with the given ID was not found.' });
    }

    // delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // respond
    res.send(course);
});

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port ' + port + '...'));
