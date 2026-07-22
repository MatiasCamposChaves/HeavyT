# frozen_string_literal: true

class DashboardController < InertiaController
  before_action :authenticate_user!

  def index
    redirect_to dashboard_path_for(current_user)
  end
end
