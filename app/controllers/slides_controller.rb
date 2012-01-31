class SlidesController < ApplicationController
  def index
  end

  def todo
    render :json => { description: 'Pick up milk', completed: false }
  end
end
