const express= require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverried = require('method-override')
const Campground = require('./models/campoground');
const { redirect } = require('express/lib/response');


mongoose.connect('mongodb://localhost:27017/yelpcamp',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

const db = mongoose.connection;
db.on('error' , console.error.bind(console,'connection error: '));
db.once('open' , ()=>{
    console.log('Database Connected')
});

app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname , 'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverried('_method'));


app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/campgrounds' , async (req , res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index' , {campgrounds:campgrounds})
})
app.get('/campgrounds/new' ,(req,res)=>{
    res.render('campgrounds/new')
})

app.post('/campgrounds' , async (req,res)=>{
    const newCamp = await new Campground(req.body.campground)
    console.log(newCamp)
    await newCamp.save()
    res.redirect(`/campgrounds/${newCamp._id}`)
})


app.get('/campgrounds/:id' , async (req,res)=>{
    const foundCamp = await Campground.findById(req.params.id)
    console.log(`
    the found camp is 
    ${foundCamp}`)
    res.render('campgrounds/show' , {thecamp : foundCamp})
})

app.get('/campgrounds/:id/edit' , async (req,res)=>{
    const toEditCamp = await Campground.findById(req.params.id);
    console.log(`redirecting you to the editing form 
    for the campground ${toEditCamp}`);
    res.render('campgrounds/edit' , {camp:toEditCamp})
})

// app.post('/campgrounds/:id/update', async (req,res)=>{
    // const toUpdate = await Campground.updateOne(
    //    {_id:req.params.id}, 
    //     {title:req.body.title , location:req.body.location})
    //     console.log(`CAMP ${toUpdate} HAS BEEN UPDATED!!`)
// })
app.put('/campgrounds/:id/update', async (req,res)=>{
        const toUpdate = await Campground.findByIdAndUpdate(
        req.params.id, 
        {...req.body.campground})
        res.redirect(`/campgrounds/${req.params.id}`)
        console.log(`CAMP ${toUpdate} HAS BEEN UPDATED!!`)
})

app.delete('/campgrounds/:id/delete' , async (req,res)=>{
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds')
})



app.listen(3000 , ()=>{
    console.log('SERVER PORT 3000 IS ON')
})