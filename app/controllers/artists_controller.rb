class ArtistsController < ApplicationController
  include ActionView::RecordIdentifier

  def show
    albums = selected_albums(artist.albums, params[:album_type]).with_attached_cover.preload(:artist)
    tracks = artist.tracks.popularity_ordered
    @tracks_size = tracks.size
    tracks = tracks.limit(Artist::MAX_POPULAR_TRACKS)

    if turbo_frame_request?
      render partial: "discography", locals: {artist:, albums:}
    else
      render action: :show, locals: {artist:, albums:, tracks:}
    end
  end

  def tracks
    tracks = artist.tracks.popularity_ordered
    @pagy, @tracks = pagy_countless(tracks)

    render "scrollable_list", locals: {artist:, tracks: @tracks, pagy: @pagy}
  end

  def popular
    tracks = artist.tracks.popularity_ordered
    tracks_size = tracks.size
    current_position = params.fetch(:current_position, 0).to_i
    current_position += Artist::MAX_POPULAR_TRACKS
    limit_range = current_position + Artist::MAX_POPULAR_TRACKS
    tracks = tracks.limit(limit_range)

    if turbo_frame_request?
      render partial: "popular", locals: {tracks:,
                                          artist:,
                                          tracks_size:,
                                          current_position:}
    else
      render nothing: true
    end
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
