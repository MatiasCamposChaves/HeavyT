# frozen_string_literal: true

class DashboardController < InertiaController
  before_action :authenticate_user!

  def index
    render inertia: {
      user: current_user.as_json(only: [:full_name, :email, :phone]),
    }
  end
end
