BackboneSlides::Application.routes.draw do
  match "todo" => "home#todo"

  resources :todos

  root to: 'home#index'
end
