# frozen_string_literal: true

module Client
  class ProgressController < InertiaController
    before_action -> { authorize_role!(:client) }

    def show
      profile = current_user.client_profile || current_user.create_client_profile!
      render inertia: {
        user: current_user.as_json(only: [:full_name, :email, :phone, :role]),
        report: ::ProgressReport.new(profile).as_json,
      }
    end
  end
end
