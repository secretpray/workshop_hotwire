module ApplicationHelper
  def seconds_to_duration(seconds)
    [seconds / 60, seconds % 60].map! { |t| t.to_s.rjust(2, "0") }.join(":")
  end

  def online_counts(station)
    StationTracker.current_listeners(station)
  end
end
