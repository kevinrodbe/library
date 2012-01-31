BackboneSlides::Application.routes.draw do
  match "todo" => "slides#todo"

  root to: 'slides#index'
end
