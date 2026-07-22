# frozen_string_literal: true

module Client
  class DashboardController < InertiaController
    before_action -> { authorize_role!(:client) }

    def index
      profile = current_user.client_profile || current_user.create_client_profile!
      trainer = profile.trainer_profile&.user

      render inertia: {
        user: current_user.as_json(only: [:full_name, :email, :phone, :role]),
        trainer: trainer&.as_json(only: [:id, :full_name, :email, :phone]),
        linked_at: profile.linked_at,
      }
    end
  end
end
