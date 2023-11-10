// Importing Mongoose Schemas
const User = require("../models/User");
const ExplorationItem = require("../models/ExplorationItem")

// Generated by ChatGPT, checkout dummy_Data folder
const dummyExplorationData = require('../dummy_Data/explorationData.json')
const mongoose = require("mongoose");
const getRandomInt = require("../util");

// Importing DB calls
const userCalls = require('../backend/userCalls');
const explorationItemCalls = require('../backend/explorationItemCalls');

const dbName = "test";

/**
 * Initializing Database * 
 * @returns Database
 */
async function init () 
{
    try{
        await mongoose.connect(`mongodb+srv://admin:EiRWf7t6xkNcHsty@6ixplore.gt56rc8.mongodb.net/${dbName}`);
        const db = mongoose.connection;

        // Resetting DB entries so it doesnt stack every run
        db.dropCollection(User.collection.name);
        db.dropCollection(ExplorationItem.collection.name);

        // Adding User and Exploration Schemas to DB
        db.model("User", User.schema);
        db.model("ExplorationItem", ExplorationItem.schema);

        // Populating DB with dummy Data 
        // Note Exploration Data is hard capped to 20 Documents
        addDummyExplorationData();
        addDummyUserData(25);        

        return db;

    } catch (error) {
        console.error(error);
    }
}


/**
 * This fetches and adds dummy user data to our data base
 * 
 * Api-endpoint: https://random-data-api.com/api/v2/users  
 * Documentation: https://random-data-api.com/documentation
 * @param {Number} size Size of Users to be added to DB
 */
function addDummyUserData(size){
    
    const api_endpoint = `https://random-data-api.com/api/v2/users?size=${size}`;
    fetch(api_endpoint, {
        method: "GET"
    })
    .then(response => {
        if (response.status !== 200) {
            return "error";
        }
        return response.json();
    })
    .then(data => {
        data.forEach(async user => {
            const newUser = {
                name: `${user.first_name} ${user.last_name}`,
                email : user.email,
                password : user.password,
                favourites : await addRandomFavoriteItems(),    
                plans: await addRandomPlanItems()
            }
            userCalls.addUserToDB(newUser);
        });
    })
    .catch(error => {
        console.log(error);
        throw(new Error(`Error: ${error}\nSomething went wrong with the Dummy Data API`));
    });
}

/**
 * Adding Dummy Exploration Data (Generated by ChatGPT) 
 * 
 * Check Out dummyData Folder
 */
function addDummyExplorationData() {
    dummyExplorationData.forEach(async item => await explorationItemCalls.addExplorationItemToDB(item));
}

/**
 * 
 * @returns Return Random Plan Items to be Added to User (Dummy Data Purpose)
 */
async function addRandomPlanItems() {
    // Getting Random Items from DB. Hard coded 5 as the highest number of plan items for now
    const randomPlanItems = await getRandomExplorationItems(getRandomInt(5));
    let array = []
    randomPlanItems.forEach(item => {
        array.push({
            name: item.name,
            planItem: item._id
        })
    })
    return array;   
}

/**
 * 
 * @returns Return Random Favorite Items to be added to User (Dummy Data Purpose)
 */
async function addRandomFavoriteItems() {
    // Getting Random Items from DB. Hard coded 7 as the highest number of fav items for now
    const randomFavItems = await getRandomExplorationItems(getRandomInt(7));
    let array = [];

    randomFavItems.forEach(async (item) => {
        array.push(item._id);
    })
    return array;
}

/**
 * 
 * @param {number} itemCount 
 * @returns Random number of exploration items from the database
 */
async function getRandomExplorationItems(itemCount) {
    try {
        const randomItems = await ExplorationItem.aggregate([
            { $sample: { size: itemCount } }
        ]);

        return randomItems;
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching random exploration items');
    }
}

module.exports = init
