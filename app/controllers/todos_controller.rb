class TodosController < ApplicationController
  
  before_filter :load_todo, only: %w(show update destroy)
  respond_to :json

  def index
    @todos = Todo.all
    
    respond_with @todos
    #render json: {todos: @todos, page: 1, perPage: 10, total: Todo.count }
  end

  def show
    respond_with @todo
  end

  def update
    @todo.update_attributes params[:todo]

    respond_with @todo
  end

  def create
    @todo = Todo.new params[:todo]

    if @todo.save
      render json: @todo, status: :created
    else
      render json: { errors: @todo.errors.full_messages }, status: 422
    end
  end

  def destroy
    @todo.destroy

    respond_with @todo
  end

  private

  def load_todo
    @todo = Todo.find params[:id]
  end


end
