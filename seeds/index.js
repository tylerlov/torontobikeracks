const mongoose = require (`mongoose`);
const Bikerack = require(`../models/bikerack`)
const bikedata = require('./bikedata')


mongoose.connect(`mongodb://localhost:27017/torontobikeracks`, {
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


//console.log(bikedata)

const seedDB = async () => {
    await Bikerack.deleteMany({});
    for(let i = 0; i < 117; i++){
            const bikes = new Bikerack({
                author: '62b1a3b16b562b4cf76cd71d',
                location: `${bikedata[i].properties.ADDRESS_FULL}, ${bikedata[i].properties.CITY} - ${bikedata[i].properties.WARD}`,
                title: `${bikedata[i].properties.PARKING_TYPE}`,
                //image: `https://source.unsplash.com/collection/483251`,
                description: `Installed in ${bikedata[i].properties.YEAR_INSTALLED}, this bike rack can hold ${bikedata[i].properties.BICYCLE_CAPACITY} bikes and belongs to ${bikedata[i].properties.WARD} ward.`,
                capacity: bikedata[i].properties.BICYCLE_CAPACITY,
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
        await bikes.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});