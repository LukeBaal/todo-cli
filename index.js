const mongoose = require('mongoose');

//Map to global promise
mongoose.Promise = global.Promise;
//Connect to db
const db = mongoose.connect('mongodb://localhost:27017/todocli', {
  useMongoClient: true
});

//Import model
const Todo = require('./models/todolist');

//Determine days to due date
const daysLeft = dueDate => {
  const one_day = 1000*60*60*24;
  let today = new Date();

  // Calculate the difference in milliseconds
  var difference_ms = dueDate - today;
  
  // Convert back to days and return
  return Math.round(difference_ms/one_day); 
};

//Add Item
const addItem = item => {
  Todo.create(item).then(item => {
    console.log('New Item Added');
    db.close();
  });
};

//Find Item
const findItem = name => {
  const search = new RegExp(name, 'i');
  Todo.find({ name }).then(item => {
    console.log(item);
    console.log(`${item.length} matches`);
    db.close();
  });
};

//Update Item
const updateItem = (_id, item) => {
  Todo.update({ _id }, item)
    .then(item => {
      console.log('Item Updated');
      db.close();
    });
};

//Remove Item
const removeItem = (_id) => {
  Todo.remove({ _id })
    .then(item => {
      console.info('Item Removed');
      db.close();
    });
};

//Pop Item
const popItem = () => {
  Todo.find().sort('date')
    .then(items => {
      removeItem(items[0]._id);
      db.close();
    });
};

const listItems = () => {
  return Todo.find().sort('date')
    .then(items => {
      db.close();
      return items;
    });
}


const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//List Items
const listItemsPretty = () => {
  Todo.find().sort('date')
    .then(items => {
      let allItems = [];
      for (item of items){
        const dateDiff = daysLeft(item.date);
        if (dateDiff < 7){
          const hour = item.date.toUTCString().slice(-12,-10);
          let day = days[item.date.getDay()];
          if (dateDiff == 0){
            day = 'TODAY';
          }
          if (hour > 12){
            console.info(`${day}@${hour%12}${item.date.toUTCString().slice(-10,-7)} PM: ${item.name}`);            
          }else{
            console.info(`${day}@${item.date.toUTCString().slice(-12,-7)} AM: ${item.name}`);
          }
        }else if(dateDiff < 21){
          console.info(`${months[item.date.getMonth()]} ${item.date.getDate()}: ${item.name}`);
        }
      }
      db.close();
    });
};

module.exports = {
  addItem,
  findItem,
  updateItem,
  removeItem,
  popItem,
  listItems,
  listItemsPretty
};