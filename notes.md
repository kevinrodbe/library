---
layout: page
title: Rails for Zombies 2
course_url: http://railsforzombiestwo.codeschool.com
path: ruby
---


Migrations
--------------------------------

#### To Create a Blank Migration:

```
rails g migration <name>
```

#### To Add Columns:

```
rails g migration Add<Anything>To<TableName> [columnName:type]
```

#### To Remove Columns:

```
rails g migration Remove<Anything>From<TableName> [columnName:type]
```

### Column Options

```ruby
default: <value>
limit: 30
null: false
first: true
after: :email
unique: true
```

### Migration Methods*

```
create_table    change_table
drop_table      add_column
change_column   rename_column
remove_column   add_index
remove_index
```

\* See documentation for syntax

### Active Record Supported Types

```
:primary_key   :string
:text          :integer
:float         :decimal
:datetime      :timestamp
:time          :date
:binary        :boolean
```

### Remove Column

```
rails g migration RemoveAgeFromZombies age:integer
```

#### Generates:

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

#### Generates:

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

#### Generates:

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

### Don't Forget to Rake!

```
$ rake db:migrate
# Run all missing migrations

$ rake db:rollback
# Rollback the previous migration

$ rake db:setup
# Create db, load schema & seed

$ rake db:schema:dump
# Dump the current db state to db/schema.rb
```

**Resources:** [http://guides.rubyonrails.org/migrations.html](http://guides.rubyonrails.org/migrations.html)


Rails Command Line
--------------------------------

### Commands

- `rails new <app name>`: Creates a new Rails application
- `rails server` (`rails s`): Starts up the Rails server
- `rails generate` (`rails g`): Generates template code
- `rails console` (`rails c`): Starts up the Rails console
- `rails dbconsole` (`rails db`): Starts up the Rails db console

#### Help:

All commands can be run with `-h` for more information.

### Generate Examples

```
rails g scaffold zombie name:string bio:text age:integer

rails g migration RemoveEmailFromUser email:string

rails g mailer ZombieMailer decomp_change lost_brain
```


Models
--------------------------------

### Named Scope

```ruby
class Zombie < ActiveRecord::Base
  # Ruby 1.9 lambda syntax
  scope :rotting, -> { where(rotting: true) }

  # Also acceptable
  scope :fresh, lambda { where("age < 20") }
  scope :recent, proc { order("created_at desc").limit(3) }
end
```

#### Examples:

```ruby
Zombie.rotting
Zombie.fresh
Zombie.recent
Zombie.rotting.recent
```

### Callbacks

```
before_validation   after_validation
before_save         after_save
before_create       after_create
before_update       after_update
before_destroy      after_destroy
```

#### Examples:

```ruby
after_create :send_welcome_email
before_save :encrypt_password
before_destroy :set_deleted_flag
after_update {|zombie| logger.info "Zombie #{zombie.id} updated" }
```

### Self Scope

Reading attributes does not require `self`, but setting attributes does require `self`.

```ruby
class Zombie < ActiveRecord::Base
  before_save :make_rotting
  def make_rotting
    if age > 20
      self.rotting = true
    end 
  end
end
```

### Relationship Options

```ruby
dependent: :destroy
foreign_key: :undead_id
primary_key: :zid
validate: true
```

### Relational Includes Examples*

```ruby
@zombies = Zombie.includes(:brain).all
@recent = Zombie.recent.includes(:brain)
```

\* To avoid extra queries


REST & Routes
--------------------------------

### Rake Routes

`rake routes` prints your RESTful routes

#### Generates:

```
zombies       GET /zombies            zombies#index
              POST /zombies           zombies#create
new_zombie    GET /zombies/new        zombies#new
edit_zombie   GET /zombies/:id/edit   zombies#edit
zombie        GET /zombies/:id        zombies#show
              PATCH /zombies/:id      zombies#update
              PUT /zombies/:id        zombies#update
              DELETE /zombies/:id     zombies#destroy
```

### Example Link To Usage

```erb
<%= link_to 'All Zombies', zombies_path %>
<%= link_to 'New Zombie', new_zombie_path %>
<%= link_to 'Edit Zombie', edit_zombie_path(@zombie) %>
<%= link_to 'Show Zombie', zombie_path(@zombie) %>
<%= link_to 'Show Zombie', @zombie %>
<%= link_to 'Delete Zombie', @zombie, method: :delete %>
```

### Relative Paths

```
zombies_path      # /zombies
new_zombie_path   # /zombies/new
```

### Absolute Paths

```
zombies_url      # http://localhost:3000/zombies
new_zombie_url   # http://localhost:3000/zombies/new
```


Nested Routes
--------------------------------

1.  
    #### app/configure/routes.rb

    ```ruby
    TwitterForZombies::Application.routes.draw do
      resources :zombies do
        resources :tweets
      end
    end
    ```

2.  
    #### app/controller/tweets_controller.rb

    ```ruby
    class TweetsController < ApplicationController
      before_action :get_zombie

      def get_zombie
        @zombie = Zombie.find(params[:zombie_id])
      end

      def show
        @tweet = @zombie.tweets.find(params[:id])
        # /zombies/4/tweets/2
        # params = { :zombie_id => 4, :id => 2 }
      end

      def create
        @tweet = @zombie.tweets.new(params[:tweet])
        if @tweet.save
          redirect_to [@zombie, @tweet]
        else
          render action: "new"
        end
      end

      def index
        @tweets = @zombie.tweets
        # /zombies/4/tweets
        # params = { :zombie_id => 4 }
      end
    end
    ```

3.  
    #### app/views/tweets/_form.html.erb

    ```erb
    <%= form_for([@zombie, @tweet]) do |f| %>
    ```

4.  
    #### app/views/tweets/index.html.erb

    ```erb
    <% @tweets.each do |tweet| %>
      <tr>
        <td><%= tweet.body %></td>
        <td><%= link_to 'Show', [@zombie, tweet] %></td>
        <td><%= link_to 'Edit', edit_zombie_tweet_path(@zombie, tweet) %></td>
        <td><%= link_to 'Destroy', [@zombie, tweet], method: :delete %></td>
      </tr>
    <% end %>
    <%= link_to 'New Tweet', new_zombie_tweet_path(@zombie) %>
    ```


Forms
--------------------------------

### Example

```erb
<%= form_for(@zombie) do |f| %> <%= f.text_field :name %>
  <%= f.text_area :bio %>
  <%= f.select :decomp, ['fresh', 'rotting', 'stale'] %>
  <%= f.select :decomp, [['fresh', 1], ['rotting', 2], ['stale', 3]] %>
  <%= f.radio_button :decomp, 'fresh', checked: true %>
  <%= f.radio_button :decomp, 'rotting' %>
  <%= f.radio_button :decomp, 'stale' %>
  <%= f.check_box :rotting %>
<%= f.submit %> <% end %>
```

### Alternate Text Input Helpers

```erb
<%= f.password_field :password %>
<%= f.number_field :price %>
<%= f.range_field :quantity %>
<%= f.email_field :email %>
<%= f.url_field :website %>
<%= f.telephone_field :mobile %>
```


View Partials & View Helpers
--------------------------------

### View Partials

Calling `render 'form'` in the following views reuses the contents of the partial. Remember that partials start with an underscore.

#### app/views/tweets/new.html.erb

```erb
<h1>New tweet</h1>
<%= render 'form' %>
<%= link_to 'Back', zombie_tweets_path(@zombie) %>
```

#### app/views/tweets/edit.html.erb

```erb
<h1>Editing tweet</h1>
<%= render 'form' %>
```

#### app/views/tweets/_form.html.erb

```erb
<%= form_for(@tweet) do |f| %>
  ...
<%= end %>
```

### View Helper Example 1

```erb
<div id="tweet_<%= tweet.id %>" class="tweet">
  <%= tweet.body %>
</div>
```

#### Is the Same As:

```erb
<%= div_for tweet do %>
  <%= tweet.body %>
<% end %>
```

#### Which Calls:

```
dom_id(@tweet)  ->  #tweet_2
```

### View Helper Example 2

```erb
<%= @zombies.each do |zombie| %>
  <%= render zombie %>
<% end %>
```

#### Is the Same As:

```erb
<%= render @zombies %>
```

#### Which Looks For:

```
views/zombies/_zombie.html.erb
```

### Additional Helpers

```erb
<%= truncate("I need brains!", :length => 10) %>
<%# I need bra... %>
```

```erb
<%= truncate("I need brains!", :length => 10, :separator => ' ') %>
<%# I need... %>
```

```erb
I see <%= pluralize(Zombie.count, "zombie") %>
<%# I see 2 zombies / I see 1 zombie %>
```

```erb
His name was <%= @zombie.name.titleize %>
<%# His name was Ash Williams %>
```

```erb
Ash's zombie roles are <%= @role_names.to_sentence %>
<%# Ash's zombie roles are Captain, and Solidier. %>
```

```erb
He was buried alive <%= time_ago_in_words @zombie.created_at %> ago
<%# He was buried alive 2 days ago %>
```

```erb
Price is <%= number_to_currency 13.5 %>
<%# Price is $13.50 %>
```

```erb
Ash is <%= number_to_human 13234355423 %> years old
<%# Ash is 13.2 billion years old %>
```


Creating a Mailer
--------------------------------

#### Generator:

```
rails g mailer ZombieMailer decomp_change lost_brain
```

### Mail Class Example

#### app/mailers/zombie_mailer.rb

```ruby
class ZombieMailer < ActionMailer::Base
   default from: "from@example.com"
   def decomp_change(zombie)
     @zombie = zombie
     @last_tweet = @zombie.tweets.last
     attachments['z.pdf'] = File.read("#{Rails.root}/public/zombie.pdf")
     mail to: @zombie.email, subject: 'Your decomp stage has changed'
   end
end
```

#### Additional Options:

```ruby
from: my@email.com
cc: my@email.com
bcc: my@email.com
reply_to: my@email.com
```

### Mailer Text Views

#### app/views/zombie\_mailer/decomp\_change.text.erb

```erb
Greetings <%= @zombie.name %>
```

### Mailer HTML Views

#### app/views/zombie\_mailer/decomp\_change.html.erb

```erb
<h1>Greetings <%= @zombie.name %></h1>
```

### Sending Mail

#### app/models/zombie.rb

```ruby
ZombieMailer.decomp_change(@zombie).deliver
```

### Mass Mailing Notes

Mass mailing is best done outside of Rails. You can use gems for services like [MadMimi](http://madmimi.com) if you plan on sending a lot of mail.

**Resources:** [http://guides.rubyonrails.org/action_mailer_basics.html](http://guides.rubyonrails.org/action_mailer_basics.html)


Assets & Asset Paths
--------------------------------

### Asset Tag Helpers

```erb
<%= javascript_include_tag "custom" %>
```

```erb
<%= stylesheet_link_tag "style" %>
```

```erb
<%= image_tag "rails.png" %>
```

### Asset Paths in Stylesheets

#### app/assets/stylesheets/zombie.css.erb

```css
.new_zombie .submit {
  background-image: url(<%= asset_path('button.png') %>);
}
```

### Using Sass, CoffeeScript Assets

To compile with other CSS/JS helpers, just add the necessary extension.

```
app/assets/stylesheets/zombie.css.scss.erb
app/assets/javascripts/zombies.js.coffee
```

#### Resources

- [http://sass-lang.org](http://sass-lang.org)
- [http://jashkenas.github.com/coffee-script](http://jashkenas.github.com/coffee-script)


CoffeeScript & jQuery
--------------------------------

### JavaScript & jQuery

#### app/assets/javascripts/zombie.js

```javascript
$(document).ready(function() {
  $('#show-bio').click(function(event) {
    event.preventDefault();
    $(this).hide();
    $('.field#bio').show();
  }
}
```

#### app/assets/javascripts/zombie.js.coffee

```coffeescript
$(document).ready ->
  $('#show-bio').click (event) ->
    event.preventDefault()
    $(this).hide()
    $('.field#bio').show()
```

### CoffeeScript AJAX Example

```coffeescript
$(document).ready ->
  $('div#custom_phase2 form').submit (event) ->
    event.preventDefault()
    url = $(this).attr('action')
    custom_decomp = $('div#custom_phase2 #zombie_decomp').val()
    $.ajax
      type: 'patch'
      url: url
      data: { zombie: { decomp: custom_decomp } }
      dataType: 'json'
      success: (json) ->
        $('#decomp').text(json.decomp).effect('highlight')
        $('div#custom_phase2').fadeOut() if json.decomp == "Dead (again)"
```


Sass & CSS
--------------------------------

### CSS

#### app/assets/stylesheets/zombie.css.erb

```css
.new_zombie {
  border: 1px dashed gray;
}
.new_zombie #bio {
  display: none;
}
.new_zombie .submit {
  background-image: url(<%= asset_path('button.png') %>);
}
```

### Sass

#### app/assets/stylesheets/zombie.css.scss.erb

```scss
.new_zombie {
  border: 1px dashed gray;
  #bio {
    display: none;
  }
  .submit {
    background-image: url(<%= asset_path('button.png') %>);
  }
}
```

### Removing Sass/CoffeeScript Default Asset Generation

In your `Gemfile`, remove:

```
gem 'sass-rails'
gem 'coffee-script'
```

then rerun `bundle install`


Sprockets & Application.js/.css
--------------------------------

#### app/assets/javascripts/application.js

Contains a manifest of the JavaScript files we use:

```javascript
//  Looks for jquery.js in all asset paths
//= require jquery
//= require jquery_ujs

//  Loads: lib/assets/javascripts/shared.js.coffee
//= require shared

//= require_tree .
```

#### app/assets/stylesheets/application.css

Contains a manifest of the stylesheets we use:

```css
/*
 *= require reset
 *  Styles in this file are included after the reset stylesheet
 *= require_self
 *= require_tree .
 */

.new_zombie {
  border: 1px dashed gray;
}
```


Rendering / HTTP Status Codes
--------------------------------

### Responds_to Example

#### app/controllers/zombies_controller.rb

```ruby
class ZombiesController < ApplicationController
  def show
    @zombie = Zombie.find(params[:id])
    respond_to do |format|
      # Renders app/views/zombies/show.html.erb
      format.html do
        if @zombie.decomp == 'Dead (again)'
          # Renders app/views/zombies/dead_again.html.erb
          render :dead_again
        end
      end
      # Renders JSON
      format.json { render json: @zombie }
    end
  end
end
```

### HTTP Status Codes

```
200 :ok                     401 :unauthorized
201 :created                102 :processing
422 :unprocessable_entity   404 :not_found
```

### JSON Rendering Examples

```ruby
render json: @zombie.errors, status: :unprocessable_entity
render json: @zombie, status: :created, location: @zombie
```


Custom Routes
--------------------------------

### Types

```ruby
:member
# Acts on a single resource

:collection
# Acts on a collection of resources
```

### Route

```ruby
get :decomp, on: :member        # /zombies/:id/decomp
patch :decay, on: :member       # /zombies/:id/decay
get :fresh, on: :collection     # /zombies/fresh
post :search, on: :collection   # /zombies/search
```

### Examples

```erb
<%= link_to 'Fresh zombies', fresh_zombies_path %>
<%= form_tag(search_zombies_path) do |f| %>
<%= link_to 'Get decomp', decomp_zombie_path(@zombie) %>
<%= form_for @zombie, url: decay_zombie_path(@zombie) %>
```


Custom JSON Responses
--------------------------------

### JSON Example 1

```ruby
@zombie.to_json(only: :name)
```

#### Generates:

```javascript
{ "name": "Eric" }
```

### JSON Example 2

```ruby
@zombie.to_json(except: [:created_at, :updated_at, :id, :email, :bio])
```

#### Generates:

```javascript
{ "age": 25, "decomp": "Fresh", "name": "Eric", "rotting": false }
```

### JSON Example 3

```ruby
@zombie.to_json(only: [:name, :age])
```

#### Generates:

```javascript
{ "name": "Eric", "age": 25 }
```

### JSON Example 4

```ruby
@zombie.to_json(include: :brain, except: [:created_at, :updated_at, :id])
```

#### Generates:

```javascript
{
  "age": 25,
  "bio": "I am zombified",
  "decomp": "Fresh",
  "email": "zom@bied.com",
  "name": "Eric",
  "rotting": false,
  "brain": { "flavor": "Butter", "status": "Smashed", "zombie_id": 3 }
}
```


AJAX
--------------------------------

1.  
    ### Make a Remote Link or Form Call

    #### Remote Link

    ```erb
    <%= link_to 'delete', zombie, method: :delete, remote: true %>
    ```

    ```html
    <a href="/zombies/5" data-method="delete" data-remote="true" rel="nofollow">delete</a>
    ```

    #### Remote Form Call

    ```erb
    <%= form_for (@zombie, remote: true) do |f| %>
    ```

    ```html
    <form action="/zombies" data-remote="true" method="post">
    ```

2.  
    ### Ensure the Controller Can Accept JavaScript Calls

    ```ruby
    respond_to do |format|
      format.js
    end
    ```

3.  
    ### Write the JavaScript to Return to the Client

    #### app/views/zombies/<action name>.js.erb

    ```javascript
    $('#<%= dom_id(@zombie) %>').fadeOut();
    ```

### Other jQuery Actions

```javascript
$('<selector>').append(<content or jQuery object>);
$('<selector>').text(<string>);
```
