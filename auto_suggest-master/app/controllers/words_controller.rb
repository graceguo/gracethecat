class WordsController < ApplicationController

  def index
  end

  def complete
    word = ""
    word = WordsHelper.auto_complete(params[:query]) if params.has_key?(:query)
    return render json: {
      word: word
    }
  end
end
