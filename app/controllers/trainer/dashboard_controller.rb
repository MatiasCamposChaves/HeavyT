# frozen_string_literal: true

module Trainer
  class DashboardController < InertiaController
    before_action -> { authorize_role!(:trainer) }

    def index
      profile = current_user.trainer_profile || current_user.create_trainer_profile!
      invite = profile.current_invite

      render inertia: {
        user: current_user.as_json(only: [:full_name, :email, :phone, :role]),
        invite: invite&.as_json(only: [:code, :expires_at]),
        clients: profile.clients.order(:full_name).as_json(only: [:id, :full_name, :email, :phone]),
      }
    end
  end
end
