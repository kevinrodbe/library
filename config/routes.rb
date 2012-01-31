BackboneSlides::Application.routes.draw do
  match "todo" => "home#todo"

  root to: 'home#index'
end
