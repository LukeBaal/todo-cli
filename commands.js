#!/usr/bin/env node
const program = require('commander');
const { prompt } = require('inquirer');
const {
  addItem,
  findItem,
  updateItem,
  removeItem,
  popItem,
  listItems,
  listItemsPretty
} = require('./pouch');

//Customer Questions
const questions = [
  {
    type: 'input',
    name: 'date',
    message: 'Due date (mm-dd):'
  },
  {
    type: 'input',
    name: 'time',
    message: 'Due time (HH:MM):',
    default: '23:59'
  },
  {
    type: 'list',
    name: 'course',
    message: 'Course:',
    choices: [
      'Networks',
      'Economics',
      'Intro to AI',
      'OS',
      'Management',
      'Quality',
      'None'  
    ]
  },
  {
    type: 'input',
    name: 'name',
    message: 'Name:'
  }
];

const toRemove = [
  {
    type:'input',
    name:'_id',
    message: 'Item to remove:'
  }
];

program
  .version('1.2.0')
  .option('Todo-list Management System');

//Add Command
program
  .command('add')
  .alias('a')
  .description('Add an item')
  .action(() => {
    prompt(questions).then(answers => {
      const year = new Date();
      if (answers.course !== 'None'){
        addItem({ 
          _id: new Date().toJSON(),
          date:year.getFullYear() + '-' + answers.date + 'T' + answers.time + ':00.000Z',
          name:answers.course + ' ' + answers.name
        });
      }else{
        addItem({ 
          _id: new Date().toJSON(),                               
          date:year.getFullYear() + '-' + answers.date + 'T' + answers.time + ':00.000Z',
          name:answers.name
        });
      }
    });
  });

//Find command
// program
//   .command('find <name>')
//   .alias('f')
//   .description('Find an item')
//   .action(name => findItem(name));

//Update command
program
  .command('update <_id>')
  .alias('u')
  .description('Update an item')
  .action(_id => {
    prompt(questions).then(answers => {
      const year = new Date();
      if (answers.course !== 'None'){
        updateItem(_id, { 
          date:year.getFullYear() + '-' + answers.date + 'T' + answers.time + ':00.000Z',
          name:answers.course + ' ' + answers.name
        });
      }else{
        updateItem(_id, {
          date:year.getFullYear() + '-' + answers.date + 'T' + answers.time + ':00.000Z',
          name:answers.name
        })
      }
    });
  });

//Remove command
program
  .command('remove <_id>')
  .alias('r')
  .description('Remove an item')
  .action(_id => removeItem(_id));

//Command to remove top item
program
  .command('pop')
  .description('Remove top (most rececentely due) item')
  .action(() => popItem());

//List command
program
  .command('list')
  .alias('l')
  .description('List all items')
  .action(m => {
    listItems()
      .then(items => {
        items.forEach(item => console.info(item));
      })
      .catch(err => console.log(err));
  });

//Pretty List command
program
.command('listpretty')
.alias('lp')
.description('List all items')
.action(m => {
    listItemsPretty()
      .then(items => {
        items.forEach(item => console.info(item));
      })
      .catch(err => console.log(err));
});
program.parse(process.argv);