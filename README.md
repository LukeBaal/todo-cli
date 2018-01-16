# todo-cli
Todo List CLI using MongoDB

A Simple todo list CLI tool using commander, inquirer, and mongodb.

Every item has a due date and time. 

### Listing Items
To print raw JSON data of todo items:
```todo-cli list```
or 
```todo-cli l```

For a better printint style use:
'''todo-cli listpretty'''
or
'''todo-cli lp'''

If the due date is within 7 days, the day of the week is displayed along with the time. If the due date is between 7 and 21 days, the month and the day of the month is displayed along with the time. Otherwise the item is hidden.

### Adding Item
To add an item use:
'''todo-cli add'''
or
'''todo-cli a'''
Follow the prompts to add an item.

### Updating Items
To update an item use:
'''todo-cli update <id>'''
or
'''todo-cli u <id>'''
where <id> is the id of the item to be updated (use '''todo-cli list''' to get the id).
Then follow the prompts similarly to the 'add' command.

### Removing Items
To remove an item use:
'''todo-cli remove <id>'''
or
'''todo-cli r <id>'''
where <id> is the id of the item to be removed (use '''todo-cli list''' to get the id).

Alternatively use:
'''todo-cli pop'''
or
'''todo-cli p'''
To remove the first most recently due item.

