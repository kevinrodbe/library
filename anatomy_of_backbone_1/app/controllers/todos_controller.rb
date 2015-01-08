class TodosController < ApplicationController
  
  before_filter :load_todo, only: %w(show update destroy)
  respond_to :json

  def index

    limit = (params[:per_page] || 5).to_i

    offset = if params[:page].blank?
      limit
    else
      params[:page].to_i * limit
    end - limit

    @todos = Todo.offset(offset).limit(limit).all
    
    respond_with Todo.all
    # render json: { todos: @todos, page: (params[:page] || 1).to_i, per_page: limit, total: Todo.count }
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
