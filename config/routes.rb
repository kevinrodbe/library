BackboneSlides::Application.routes.draw do
  match "todo" => "home#todo"
  match "support" => "home#support"

  resources :todos

  root to: 'home#index'
end
