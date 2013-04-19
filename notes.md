---
layout: page
title: Rails for Zombies 2
---


Zombies 2 Notes
================================


Migrations
--------------------------------

To Create a Blank Migration: rails g migration <name>
To Add Columns: rails g migration Add<Anything>To<TableName> [columnName:type]
To Remove Columns: rails g migration Remove<Anything>From<TableName> [columnName:type]

###Column options
```ruby
default: <value>
limit: 30
null: false
first: true
after: :email
unique: true
```

###Migration Methods*
```ruby
create_table change_table
drop_table add_column
change_column rename_column
remove_column add_index
remove_index
```
* See documentation for syntax

### Active Record Supported Types
```ruby
:primary_key :string
:text :integer
:float :decimal
:datetime :timestamp
:time :date
:binary :boolean
```

### Remove Column
```
rails g migration RemoveAgeFromZombies age:integer
```
```ruby
class RemoveAgeFromZombies < ActiveRecord::Migration
 def up
 remove_column :zombies, :age
 end
 def down
 add_column :zombies, :age, :integer
 end
end
```

### Add Column
```
rails g migration AddEmailToZombies email:string
```
```ruby
class AddEmailToZombies < ActiveRecord::Migration
 def up
 add_column :zombies, :email, :string
 end
 def down
 remove_column :zombies, :email
 end
end
```

### Create Table
```
rails g migration CreateZombiesTable name:string, bio:text, age:integer
```
```ruby
class CreateZombiesTable < ActiveRecord::Migration
 def up
 create_table :zombies do |t|
 t.string :name
 t.text :bio
 t.integer :age
 t.timestamps
 end
 end
 def down
 drop_table :zombies
 end
end
```
Resources:
http://guides.rubyonrails.org/migrations.html

###Don't Forget to Rake!
```
$ rake db:migrate
Run all missing migrations
$ rake db:rollback
Rollback the previous migration
$ rake db:setup
Create db, load schema & seed
$ rake db:schema:dump
Dump the current db state
```
```
db/schema.rb
```
