module CurrentTrackHelper
  def current_item(item_type)
    instance_variable_name = "@current_#{item_type}"

    return instance_variable_get(instance_variable_name) if instance_variable_defined?(instance_variable_name)

    item_id = params["#{item_type}_id"] || session["#{item_type}_id"]
    item = item_id.present? ? item_type.capitalize.constantize.find_by(id: item_id) : nil

    session["#{item_type}_id"] = item&.id
    instance_variable_set(instance_variable_name, item)
  end
end
