# frozen_string_literal: true

module Client
  class RoutinesController < InertiaController
    before_action -> { authorize_role!(:client) }
    before_action :set_profile

    def index
      assignments = @profile.routine_assignments.active.includes(routine: [ :exercises, { trainer_profile: :user } ])
        .order(assigned_at: :desc)
      render inertia: {
        user: user_json,
        routines: assignments.filter_map do |assignment|
          routine = assignment.routine
          next unless routine.status == "active"

          routine.as_json(only: [ :id, :name, :description, :goal ]).merge(
            exercises_count: routine.exercises.size,
            assigned_at: assignment.assigned_at,
            expires_on: assignment.expires_on,
          )
        end
      }
    end

    def show
      assignment = @profile.routine_assignments.active.includes(routine: [ :exercises, { trainer_profile: :user } ]).find_by!(routine_id: params[:id])
      routine = assignment.routine
      raise ActiveRecord::RecordNotFound unless routine.status == "active"
      render inertia: {
        user: user_json,
        routine: routine.as_json(only: [ :id, :name, :description, :goal ]).merge(
          trainer_name: routine.trainer_profile.user.full_name,
          expires_on: assignment.expires_on,
          exercises: routine.exercises.as_json(
            only: [ :id, :name, :sets, :repetitions, :rest_seconds, :suggested_weight_lb, :notes, :position, :day_of_week ],
          ),
        )
      }
    end

    private

    def set_profile
      @profile = current_user.client_profile || current_user.create_client_profile!
    end

    def user_json
      current_user.as_json(only: [ :full_name, :email, :phone, :role ])
    end
  end
end
