# frozen_string_literal: true

module Trainer
  class ProgressController < InertiaController
    before_action -> { authorize_role!(:trainer) }
    before_action :set_profile

    def index
      clients = @profile.client_profiles.includes(:user, workout_sessions: :exercise_results).order(created_at: :asc)
      render inertia: {
        user: user_json,
        clients: clients.map { |client| client_summary(client) }
      }
    end

    def show
      client = @profile.client_profiles.includes(:user).find(params[:id])
      render inertia: {
        user: user_json,
        client: client.user.as_json(only: [ :full_name, :email ]),
        report: ::ProgressReport.new(client).as_json
      }
    end

    private

    def set_profile
      @profile = current_user.trainer_profile || current_user.create_trainer_profile!
    end

    def user_json
      current_user.as_json(only: [ :full_name, :email, :phone, :role ])
    end

    def client_summary(client)
      workouts = client.workout_sessions.select(&:completed?)
      results = workouts.flat_map(&:exercise_results).select { |result| result.completed? && result.actual_weight_lb.present? }
      client.user.as_json(only: [ :full_name, :email ]).merge(
        id: client.id,
        completed_workouts: workouts.size,
        last_workout_at: workouts.map(&:completed_at).compact.max,
        total_volume_lb: results.sum { |result| result.completed_sets * result.actual_repetitions * result.actual_weight_lb.to_f }.round(1),
      )
    end
  end
end
