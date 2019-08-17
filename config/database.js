if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: 'mongodb://akkas:simar123@ds163867.mlab.com:63867/jot-prod'
    }
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost/vidjot-dev'
    }
}