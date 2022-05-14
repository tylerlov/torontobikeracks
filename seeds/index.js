const mongoose = require (`mongoose`);
const cities = require (`./cities`)
const  { places, descriptors } = require(`./seedHelpers`);
const Campground = require(`../models/campground`)

mongoose.connect(`mongodb://localhost:27017/yelp-camp`, {
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const randomPrice = Math.floor(Math.random() * 30) + 50;
            const camp = new Campground({
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                title: `${sample(descriptors)} ${sample(places)}`,
                image: `https://source.unsplash.com/collection/483251`,
                description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In fermentum enim in libero laoreet iaculis. Nam ornare congue sem, a porta sem. Morbi aliquet porttitor sapien eu porttitor. Nulla facilisi. Etiam laoreet velit a leo ullamcorper, vel luctus quam rhoncus. Fusce sagittis eget nunc ac accumsan. Praesent ut nulla nec odio gravida consequat sed eu augue. Nunc mollis arcu libero, in sollicitudin est interdum non. Suspendisse quis sapien vel orci convallis fringilla ac hendrerit nulla. Nam suscipit tristique sapien nec lacinia.Aenean eget rhoncus orci. Nunc augue ex, pharetra a laoreet vel, hendrerit nec ex. Nullam lobortis euismod nibh eu interdum. Mauris libero orci, consectetur in massa vitae, dapibus laoreet diam. Etiam dignissim varius justo, ac varius tortor egestas vitae. Sed nisi felis, tempor eget scelerisque id, commodo quis justo. Donec magna ante, elementum at pellentesque ac, lacinia eget leo.`,
                price: randomPrice
            })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});