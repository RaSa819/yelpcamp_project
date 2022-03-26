//this is just a file to seed the database with random data and to check on the changes on the database
//IT DELETES EVERYTHING!

const mongoose = require('mongoose');
const Campground = require('../models/campoground')

const cities = require('./cities')
const {places,descriptors} = require('./seedHelpers')


mongoose.connect('mongodb://localhost:27017/yelpcamp',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const db = mongoose.connection;
db.on('error' , console.error.bind(console,'connection error: '));
db.once('open' , ()=>{
    console.log('Database Connected')
})

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async ()=>{
    await Campground.deleteMany({});
    for(i=0 ; i<50 ; i++){
        const randomIndex = Math.floor(Math.random()*1000);
        const campground = new Campground({
            location: `${cities[randomIndex].city} , ${cities[randomIndex].state}`,
            title: `${sample(descriptors)} , ${sample(places)}` 
        })
    
    await campground.save();
}
}

seedDB().then(()=>{
    mongoose.connection.close();
})