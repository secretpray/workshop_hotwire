class ApplicationController < ActionController::Base
  include CurrentTrackHelper
  helper_method :current_user, :current_track, :current_album, :current_station

  private

  def authenticate
    redirect_to sign_in_path unless current_user
  end

  def current_user
    return @current_user if instance_variable_defined?(:@current_user)

    @current_user = User.find_by(id: cookies.signed[:user_id])
  end

  # Define dynamic methods for current_track, current_album, current_station
  %w[track album station].each do |item_type|
    define_method "current_#{item_type}" do
      current_item(item_type)
    end
  end
end
