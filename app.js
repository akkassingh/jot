const express = require('express');
var exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const app = express();

//Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
        useNewUrlParser: 'main'
    })
    .then(() => {
        console.log('MongoDb connected...')
    })
    .catch(err => {
        console.log(err)
    })

//Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas')

//Handlebars middleWare
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

//Body parser middleWare
app.use(bodyParser.urlencoded({
    extended: false
}));
//parse application/json
app.use(bodyParser.json());

//Method Override middleWare
app.use(methodOverride('_method'))

//Index route
app.get('/', (req, res) => {
    const title = 'welcome'
    res.render('index', {
        title
    })
})

//About Route
app.get('/about', (req, res) => {
    res.render('about')
})

//Idea Index Page
app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({
            date: 'desc'
        })
        .then(ideas => {
            res.render('ideas/index', {
                ideas
            })
        })
})

// Add idea Form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add')
})

// Edit idea Form
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            res.render('ideas/edit', {
                idea
            })
        })
})

//Process Form
app.post('/ideas', (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({
            text: 'Please add title'
        });
    }
    if (!req.body.details) {
        errors.push({
            text: 'Please add some details'
        })
    }
    if (errors.length > 0) {
        res.render('ideas/add', {
            errors,
            title: req.body.title,
            details: req.body.details
        })
    } else {
        let newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                res.redirect('/idea')
            })
    }
})

// Edit Form process
app.put('/ideas/:id', (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            // new values
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    res.redirect('/ideas');
                })
        });
});

// Delete Idea
app.delete('/ideas/:id', (req, res) => {
    Idea.remove({
            _id: req.params.id
        })
        .then(() => {
            res.redirect('/ideas');
        });
});



const port = 5000;

app.listen(port, () => {
    console.log(`server listening on port ${port}`)
});