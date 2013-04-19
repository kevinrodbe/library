---
layout: post
title: Rails 4 - Zombie Outlaws
---


Rails 4 Notes
================================


Match
--------------------------------

```ruby
# config/routes.rb
CodeSchool::Application.routes.draw do
  # match must explicitly state which HTTP verb
  match "/all_posts", to: "posts#index", via: :get
  # or 
  match "/all_posts", to: "posts#index", via: :all
end
```


Patch
--------------------------------

`PATCH` is now the default verb for updating RESTful resources.

```ruby  
# config/routes.rb
CodeSchool::Application.routes.draw do
  resources :users
end
```

The previous resource will allow either `PUT` or `PATCH` as the HTTP method for updates.  

```ruby
PATCH  /users/:id(.:format)   users#update
PUT    /users/:id(.:format)   users#update
```

You can also use the `patch` method on controller tests:

```ruby
test "updates item with PATCH" do
  patch :update, id: @item, item: { description: @item.description }
  assert_redirected_to item_url(@item)
end
```


Concerns
--------------------------------

```ruby
# config/routes.rb
Codeschool::Application.routes.draw do
  concern :sociable do |options|
    resources :comments, options
    resources :categories, options
    resources :tags, options
  end
  resources :messages, concerns: :sociable
  resources :posts,    concerns: :sociable
  resources :items do
    concerns :sociable, only: :create
  end
end
```


Thread Safety
--------------------------------

```ruby
# config/environments/production.rb
CodeSchool::Application.configure do
  config.cache_classes = true 
  config.eager_load = true
end
```

### Note

Rails 4 apps are now threadsafe by default in production environments, with **cache\_classes** and **eager\_load** enabled.


Ruby 1.9.3
--------------------------------

Rails 4 requires at least Ruby 1.9.3


Removed Whiny Nils
--------------------------------

Calling a method on a `nil` object:

```ruby
@post = Post.where(title: title).first # => nil
@post.id
```

Returns the following error:

```
> NoMethodError: undefined method `id' for nil:NilClass
```

### New

This is due to objects in Ruby 1.9.3 no longer responding to the `id` method.


ActiveModel::Model Module
--------------------------------

```ruby
class SupportTicket
  include ActiveModel::Model
  
  attr_accessor :title, :description

  validates_presence_of :title
end
```

### Note

The **ActiveModel::Module** provides all features needed to integrate non-ActiveRecord models with ActionPack.


ActiveRecord Finders
--------------------------------

The following finders have been deprecated:

```ruby
Model.find(:all, conditions: { ... })
Model.find(:first)
Model.find(:last)
```

Instead, use:

```ruby
Model.where(...)
Model.first
Model.last
```


Model.find_by
--------------------------------

This new finder method takes a hash and returns the first occurrence.

```ruby
Book.find_by(title: 'Rails 4')
```

Is the same as:

```ruby
book_params = { title: 'Rails 4' }
Book.find_by(book_params)
```

It can also take two arguments, like this:

```ruby
Book.find_by("published_on < ?", 1.month.ago)
```


Dynamic Finders
--------------------------------

### Deprecated

* Model.find_all_by_...
* Model.scoped_by_...
* Model.find_last_by_...
* Model.first_or_initialize_by_...
* Model.find_or_create_by_...
* Model.first_or_create_by_...!

### New

Use the `where` method, like:

* Model.where(...)
* Model.where(...).last
* Model.find_or_initialize_by(...)
* Model.find_or_create_by(...)


Scopes
--------------------------------

```ruby
scope :admin, -> { where(admin: true) }
scope :admin, proc { where(admin: true) }
scope :admin, lambda { where(admin: true) }

default_scope -> { where(admin: true) }
default_scope { where(admin: true) }
```


Model.all
--------------------------------

The `Model.all` method now returns a chainable object.

```ruby
all_users = User.all
some_users = all_users.where(some_params)
other_users = all_users.where(other_params)
```

Is the same as:

The old `Model.scoped` method is deprecated.


Relation#load
--------------------------------

Causes the records to be loaded from the database if they have not been loaded already.

```ruby
Book.find_by(title: 'Rails 4').comments.load
```

Is the same as:

The old **Relation#all** method is deprecated.


References
--------------------------------

You must explicitly state which tables you reference, when using SQL snippets:

```ruby
User.includes(:courses).references(:courses).where("courses.active = ?", true)
```

or

```ruby
User.includes(:courses).where({ courses: { active: true }})
User.includes(:courses).where('courses.active' => true)
User.includes(:courses).order('courses.name')
```


Relation\#none
--------------------------------

```ruby
class Comment < ActiveRecord::Base
  def self.authenticate(user)
    if user.author?
      all
    else
      none
    end
  end
end
```

### Note

Returns a chainable **ActiveRecord::NullRelation**

```ruby
Comment.authenticate(user).limit(10)
# => []
```


Relation#not
--------------------------------

```ruby
Course.where.not(topic: 'Rails')
# => "SELECT "courses".* FROM "courses"  WHERE ("courses"."topic" != 'Rails')"
```

Builds proper SQL when value is nil:

```
Course.where.not(topic: nil)
# => "SELECT "courses".* FROM "courses"  WHERE ("courses"."topic" IS NOT NULL)"
```


Relation#order
--------------------------------

```ruby
User.order(:name, created_at: :desc)
User.order(name: :asc, created_at: :desc)
```


Model#update
--------------------------------

```ruby
@zombie.update(name: "JimBob")
```

Is the same as:

```ruby
@zombie.update_attributes(name: "JimBob")
```


Model#update\_columns
--------------------------------

Builds a SQL statement and executes it directly in the database. No model validations are run.

```ruby
@zombie.update_columns(name: "JimBob")
```

Is the same as:

```ruby
@zombie.update_column(:name, "JimBob")
```

Is the same as:

```ruby
@zombie.update_attribute(:name, "JimBob")
```


strong\_parameters
--------------------------------

```ruby
# app/controllers/users_controller.rb
class UsersController < ApplicationController
  def create
    user_params = params.required(:user).permit(:first_name, :last_name)
    @user = User.new(user_params)
    ...
  end
end
```


'*_action' Callbacks
--------------------------------

```ruby
class OrdersController < ActionController::Base
  before_action :authenticate
  before_action :ensure_permission, only: [:new, :create]
end
```

List of `\*_action` callbacks:

```ruby
before_action
prepend_before_action
skip_before_action
append_before_action
after_action
prepend_after_action
skip_after_action
append_after_action
around_action
prepend_around_action
skip_around_action
append_around_action
```

The old `\*_filter` callbacks still work.


Custom Handling for request\_from\_forgery
--------------------------------

```ruby
class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  # protect_from_forgery with: :null_session
  # protect_from_forgery with: :reset_session
end
```


Declarative ETags
--------------------------------

```ruby
# app/controllers/invoices_controller.rb
class InvoicesController < ApplicationController
  etag { current_user.id }
  etag { current_user.age }

  def show
    @invoice = Invoice.find(params[:id])
    fresh_when(@invoice)
  end
end
```


Encrypted Cookie Session Store
--------------------------------

Protect your **secret key** if your application is publicly available.

```ruby
# config/initializers/secret_token.rb
CodeSchool::Application.config.secret_key_base = ENV['SECRET_KEY_BASE']
```


Custom Flash Types & Flash Helpers
--------------------------------

```ruby
# app/controllers/application_controller.rb
class ItemsController < ApplicationController

  add_flash_types :custom_success, :custom_error

  def create
    if @item.save
      redirect_to @item, custom_success: 'Item created.'
    else
      flash[:custom_error] = 'Item not created.'
      render action: 'new'
    end
  end
end
```

```html
# app/views/items/show.html.erb
<p id="notice"><%= custom_success %></p>
```

```html
# app/views/items/new.html.erb
<p id="notice"><%= custom_error %></p>
```


Handy Collection Form Helpers
--------------------------------

```ruby
collection_select(:item, :owner_id, Owner.all, :id, :name)
collection_check_boxes(:item, :owner_id, Owner.all, :id, :name)
collection_radio_buttons(:item, :owner_id, Owner.all, :id, :name)
```

Ruby Template Handler
--------------------------------

```ruby
# app/views/owners/index.json.ruby
owners_hashes = @owners.map do |owner|
   { name: owner.name, url: owner_url(owner) }
end
owners_hashes.to_json
```


ActionController::Live
--------------------------------

```ruby
class EventsController < ApplicationController
  include ActionController::Live

  def index
    # headers must be set before writing to the stream
    response.headers["Content-Type"] = "text/event-stream"
    response.stream.write "Hello, browser!\n\n"
    response.stream.close
  end
end
```

### Note

Make sure your application is running in thread-safe mode and that you are using a thread-safe server, like [puma](http://puma.io).


Turbolinks
--------------------------------

Skipping out of Turbolinks:

```erb
<%= link_to 'Requests', requests_path, "data-no-turbolink" => true %>
```


Object#try
--------------------------------

Returns `nil` in case method does not exist.

````ruby
"Zombie".try(:fake_method)
=> nil
```


Rails Info
--------------------------------

Displays routes and properties.

```ruby
http://localhost:3000/rails/info
```


Test Directory Structure
--------------------------------

```ruby
test/controllers
test/fixtures
test/helpers
test/integration
test/mailers
test/models
```


Test Rake Tasks
--------------------------------

```ruby
rake test:models
rake test:controllers
rake test:helpers
rake test:mailers
```


Skipping a Test
--------------------------------

```ruby
class ItemTest < ActiveSupport::TestCase
  test "doesn't shorten short names" do
    skip
    item = Item.new
    item.name = "Name"
    assert_equal "Name", item.short_name
end
```


Gem Extraction
--------------------------------

### Mass Assignment Protection in Active Record

```ruby
gem 'protected_attributes', github: 'rails/protected_attributes'
```

### Encoded\_mail\_to

```ruby
gem 'actionview-encoded_mail_to', github: 'reednj77/actionview-encoded_mail_to'
```

### ActiveRecord::SessionStore

```ruby
gem 'activerecord-session_store', github: 'rails/activerecord-session_store'
```

### ActiveRecord Observers

```ruby
gem 'rails-observers', github: 'rails/rails-observers'
```

### Action & Page Caching

```ruby
gem 'actionpack-page_caching'
gem 'actionpack-action_caching'
```

### ActiveResource

```ruby
gem 'activeresource', github: 'rails/activeresource'
```
