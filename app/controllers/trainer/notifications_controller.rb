# frozen_string_literal: true

module Trainer
  class NotificationsController < InertiaController
    before_action -> { authorize_role!(:trainer) }
    before_action :set_profile
    before_action :set_assignment, only: [:extend_assignment, :archive_assignment]

    def index
      assignments = RoutineAssignment
        .joins(routine: :trainer_profile)
        .where(routines: { trainer_profile_id: @profile.id }, status: "active")
        .where(expires_on: ..Date.current.tomorrow)
        .includes(:routine, client_profile: :user)
        .order(:expires_on)

      render inertia: {
        user: user_json,
        notifications: assignments.map { |assignment| notification_json(assignment) }
      }
    end

    def extend_assignment
      @assignment.extend_for_weeks!(params.fetch(:weeks, 1))
      redirect_to trainer_notifications_path, notice: "La rutina se extendió correctamente."
    rescue ArgumentError
      redirect_to trainer_notifications_path, alert: "La extensión debe ser de 1 a 52 semanas."
    end

    def archive_assignment
      @assignment.archive!
      redirect_to trainer_notifications_path, notice: "La rutina fue retirada del cliente."
    end

    private

    def set_profile
      @profile = current_user.trainer_profile || current_user.create_trainer_profile!
    end

    def set_assignment
      @assignment = RoutineAssignment
        .joins(:routine)
        .where(routines: { trainer_profile_id: @profile.id })
        .find(params[:id])
    end

    def notification_json(assignment)
      {
        id: assignment.id,
        type: assignment.expired? ? "expired" : "expiring",
        routine_name: assignment.routine.name,
        client_name: assignment.client_profile.user.full_name,
        expires_on: assignment.expires_on,
      }
    end

    def user_json
      current_user.as_json(only: [:full_name, :email, :phone, :role])
    end
  end
end
