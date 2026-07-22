# frozen_string_literal: true

module Admin
  class DashboardController < InertiaController
    before_action -> { authorize_role!(:admin) }

    def index
      render inertia: {
        user: current_user.as_json(only: [:full_name, :email, :phone, :role]),
        stats: {
          clients: User.active.where(role: "client").count,
          trainers: User.active.where(role: "trainer").count,
        },
      }
    end
  end
end
