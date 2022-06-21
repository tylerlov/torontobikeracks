const mongoose = require (`mongoose`);
const cities = require (`./cities`)
const  { places, descriptors } = require(`./seedHelpers`);
const Campground = require(`../models/campground`)

const bikedata = require('./bikedata')


mongoose.connect(`mongodb://localhost:27017/torontobikeracks`, {
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

//console.log(bikedata)

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
            const camp = new Campground({
                author: '62b1a3b16b562b4cf76cd71d',
                location: `${bikedata[i].properties.ADDRESS_FULL}, ${bikedata[i].properties.CITY} - ${bikedata[i].properties.WARD}`,
                title: `${bikedata[i].properties.PARKING_TYPE}`,
                image: `https://source.unsplash.com/collection/483251`,
                description: `Installed in ${bikedata[i].properties.YEAR_INSTALLED}, this bike rack can hold ${bikedata[i].properties.BICYCLE_CAPACITY} and belongs to ${bikedata[i].properties.WARD} ward.`,
                price: 10,
                geometry: 
                { 
                  "type": "Point", 
                  "coordinates": [
                    bikedata[i].geometry.coordinates[0],
                    bikedata[i].geometry.coordinates[1],
                ]
                },
                images: 
                  [
                    {
                      url: 'https://res.cloudinary.com/ds2hafwml/image/upload/v1655121742/YelpCamp/nevisfhd89qiobqw0lt5.jpg',
                      filename: 'YelpCamp/nevisfhd89qiobqw0lt5',
                    },
                    {
                      url: 'https://res.cloudinary.com/ds2hafwml/image/upload/v1655121742/YelpCamp/tkm5uubvshihbhoeiyq3.jpg',
                      filename: 'YelpCamp/tkm5uubvshihbhoeiyq3',
                    }
                  ]
            })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});