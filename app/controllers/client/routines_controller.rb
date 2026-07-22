# frozen_string_literal: true

module Client
  class RoutinesController < InertiaController
    before_action -> { authorize_role!(:client) }
    before_action :set_profile

    def index
      routines = @profile.routines.where(status: "active").includes(:exercises, :trainer_profile)
        .order("routine_assignments.assigned_at DESC")
      render inertia: {
        user: user_json,
        routines: routines.map do |routine|
          assignment = routine.routine_assignments.find { |item| item.client_profile_id == @profile.id }
          routine.as_json(only: [:id, :name, :description, :goal]).merge(
            exercises_count: routine.exercises.size,
            assigned_at: assignment&.assigned_at,
          )
        end,
      }
    end

    def show
      routine = @profile.routines.where(status: "active").find(params[:id])
      render inertia: {
        user: user_json,
        routine: routine.as_json(only: [:id, :name, :description, :goal]).merge(
          trainer_name: routine.trainer_profile.user.full_name,
          exercises: routine.exercises.as_json(
            only: [:id, :name, :sets, :repetitions, :rest_seconds, :suggested_weight_lb, :notes, :position],
          ),
        ),
      }
    end

    private

    def set_profile
      @profile = current_user.client_profile || current_user.create_client_profile!
    end

    def user_json
      current_user.as_json(only: [:full_name, :email, :phone, :role])
    end
  end
end
