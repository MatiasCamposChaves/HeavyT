# frozen_string_literal: true

module Client
  class NotificationsController < InertiaController
    before_action -> { authorize_role!(:client) }

    def index
      profile = current_user.client_profile || current_user.create_client_profile!
      assignments = profile.routine_assignments.includes(:routine).order(assigned_at: :desc)

      render inertia: {
        user: current_user.as_json(only: [:full_name, :email, :phone, :role]),
        notifications: assignments.map do |assignment|
          {
            id: assignment.id,
            routine_name: assignment.routine.name,
            assigned_at: assignment.assigned_at.to_date,
            expires_on: assignment.expires_on,
            status: assignment.status,
          }
        end,
      }
    end
  end
end
