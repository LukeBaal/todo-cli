const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));

const db = new PouchDB('http://admin:admin@localhost:5984/todo', {skip_setup: true});

//Determine days to due date
const daysLeft = dueDate => {
  const one_day = 1000*60*60*24;
  const today = new Date();

  //Set dueDate and today to noon, to get accurate days left
  dueDate.setHours(12);
  dueDate.setMinutes(0);
  today.setHours(12);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  // Calculate the difference in milliseconds
  const difference_ms = dueDate - today;
  // Convert back to days and return
  return difference_ms/one_day; 
};

//Add Item
const addItem = item => {
  db.put(item)
    .then(() => console.info("Item added!"))
    .catch(err => console.log(err));
}

const updateItem = (_id, item) => {
  db.get(_id)
    .then(doc => {
      doc.date = item.date,
      doc.name = item.name
    })
    .then(doc => console.info("Item updated!"))
    .catch(err => console.log(err));    
}

const removeItem = _id => {
  db.get(_id)
    .then(doc => db.remove(doc))
    .then(() => console.log("Item removed!"))
    .catch(err => console.log(err));    
}

const popItem = () => {
  db.createIndex({
    index: {fields: ['date']}
  }).then(() => {
    return db.find({
      selector: {date: {$gte: null}},
      sort: ['date']
    })
  }).then(results => {
    removeItem(results.docs[0]._id);
  }).catch(err => console.log(err));
}

const listItems = () => {
  return db.find({
    selector: {date: {$gte: null}},
    sort: ['date']
  }).then(results => results.docs)
  .catch(err => console.log(err));
}

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// List items with formatting (ignore items 3+ weeks from now)
const listItemsPretty = () => {
  return db.find({
    selector: {date: {$gte: null}},
    sort: ['date']
  }).then(items => {
      let allItems = [];
      // items.docs.forEach(doc => console.log(doc));
      for (item of items.docs){
        const dueDate = new Date(item.date)
        const dateDiff = daysLeft(dueDate);
        if (dateDiff < 7){
          const hour = dueDate.toUTCString().slice(-12,-10);
          let day = days[dueDate.getDay()];
          if (dateDiff == 0){
            day = 'TODAY';
          }
          if (hour > 12){
            allItems.push(`${day}@${hour%12}${dueDate.toUTCString().slice(-10,-7)} PM: ${item.name}`);            
          }else{
            allItems.push(`${day}@${dueDate.toUTCString().slice(-12,-7)} AM: ${item.name}`);
          }
        }else if(dateDiff < 21){
          allItems.push(`${months[dueDate.getMonth()]} ${dueDate.getDate()}: ${item.name}`);
        }
      }
      return allItems;
    }).catch(err => console.log(err));
};

// Restore from todo.js
// const data = require('./todo');
// let i = 0;
// let start = new Date().getMilliseconds();
// data.forEach(item => {
//   const date = new Date();
//   date.setMilliseconds(start+i);
//   item._id = date.toJSON();
//   i++;
//   addItem(item);
// });

module.exports = {
  addItem,
  updateItem, 
  removeItem,
  popItem,
  listItems,
  listItemsPretty
}


