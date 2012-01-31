class SlidesController < ApplicationController
  def index
  end

  def todo
    render :json => { description: 'Pick up milk', done: true }
  end
end
