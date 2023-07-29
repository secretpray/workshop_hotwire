class AlbumsController < ApplicationController
  before_action :album

  def show
    if turbo_frame_request?
      render partial: "aside", locals: {album:}
    end
  end

  def play
    render head: :ok
  end

  def hovercard
    render partial: "search/hovercard/album", locals: {album:}
  end

  private

  def album
    @album ||= Album.find(params[:id])
  end
end
