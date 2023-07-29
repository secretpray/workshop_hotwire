class ArtistsController < ApplicationController
  def show
    albums = selected_albums(artist.albums, params[:album_type]).with_attached_cover.preload(:artist)
    tracks = artist.tracks.popularity_ordered.limit(5)

    if turbo_frame_request?
      render partial: "discography", locals: {artist:, albums:}
    else
      render action: :show, locals: {artist:, albums:, tracks:}
    end
  end

  def hovercard
    render partial: "search/hovercard/artist", locals: {artist:}
  end

  private

  def artist
    @artist ||= Artist.find(params[:id])
  end

  def selected_albums(albums, album_type)
    return albums.lp if album_type.blank?

    return albums.lp unless Album.kinds.key?(album_type)

    albums.where(kind: album_type)
  end
end
