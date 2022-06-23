const mongoose = require (`mongoose`);
const Bikerack = require(`../models/bikerack`)
const bikedata = require('./bikedata')
const user = require(`../models/user`)


mongoose.connect(`mongodb+srv://siteAdmin:eWl9eg0Mygtz6Uit@cluster0.jztlk.mongodb.net/?retryWrites=true&w=majority`, {
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
    await user.deleteMany({});
    const defaultUser = new user({
      username: 'Tyler',
      password: 'rezinfinite',
      email: 'tylerlovell@gmail.com',
  })
  await defaultUser.save();
    for(let i = 0; i < 117; i++){
            const bikes = new Bikerack({
                author: defaultUser._id,
                location: `${bikedata[i].properties.ADDRESS_FULL}, ${bikedata[i].properties.CITY}`,
                title: `${bikedata[i].properties.PARKING_TYPE}`,
                description: `Installed in ${bikedata[i].properties.YEAR_INSTALLED}, this ${bikedata[i].properties.PARKING_TYPE} can hold ${bikedata[i].properties.BICYCLE_CAPACITY} bikes and belongs to Ward ${bikedata[i].properties.WARD}.`,
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
                      url: 'https://res.cloudinary.com/ds2hafwml/image/upload/v1655896331/Toronto%20Bike%20Racks/image_not_available.jpg',
                      filename: 'TorontoBikeRacks/image_not_available.jpg',
                    },
                  ]
            })
        await bikes.save();
    }
    

}

seedDB().then(() => {
    mongoose.connection.close();
});