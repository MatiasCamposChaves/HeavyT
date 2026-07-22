# frozen_string_literal: true

module Client
  class DashboardController < InertiaController
    before_action -> { authorize_role!(:client) }

    def index
      profile = current_user.client_profile || current_user.create_client_profile!
      trainer = profile.trainer_profile&.user
      today = Date.current
      today_workouts = profile.routine_assignments.active.includes(routine: :exercises).filter_map do |assignment|
        routine = assignment.routine
        exercises = routine.exercises.select { |exercise| exercise.day_of_week == today.wday }
        next if routine.status != "active" || exercises.empty?

        workout = assignment.workout_sessions.where(day_of_week: today.wday, started_at: today.all_day).order(started_at: :desc).first
        {
          routine_id: routine.id,
          routine_name: routine.name,
          day_of_week: today.wday,
          day_name: Exercise::DAYS[today.wday],
          exercises_count: exercises.size,
          workout_id: workout&.id,
          workout_status: workout&.status,
        }
      end

      render inertia: {
        user: current_user.as_json(only: [:full_name, :email, :phone, :role]),
        trainer: trainer&.as_json(only: [:id, :full_name, :email, :phone]),
        linked_at: profile.linked_at,
        today_workouts: today_workouts,
      }
    end
  end
end
