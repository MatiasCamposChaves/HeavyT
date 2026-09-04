# frozen_string_literal: true

module Trainer
  class WorkoutSessionsController < InertiaController
    before_action -> { authorize_role!(:trainer) }
    before_action :set_profile

    def index
      workouts = WorkoutSession.joins(routine_assignment: :routine)
        .where(routines: { trainer_profile_id: @profile.id })
        .includes(routine_assignment: [ :routine, { client_profile: :user } ])
        .order(started_at: :desc)

      render inertia: {
        user: user_json,
        workouts: workouts.map { |workout| workout_summary(workout) }
      }
    end

    def show
      workout = trainer_workouts.includes(exercise_results: :exercise).find(params[:id])
      render inertia: {
        user: user_json,
        workout: workout_summary(workout).merge(
          results: workout.exercise_results.sort_by { |result| result.exercise.position }.map do |result|
            result.as_json(
              only: [
                :id, :completed_sets, :actual_repetitions, :actual_weight_lb, :completed, :notes,
                :paired_actual_repetitions, :paired_actual_weight_lb, :drop_set_results
              ],
            ).merge(
              exercise_name: result.exercise.name,
              exercise_set_type: result.exercise.set_type,
              exercise_set_type_name: result.exercise.set_type_name,
              paired_exercise_name: result.exercise.paired_exercise_name,
              drop_sets_count: result.exercise.drop_sets_count,
              technique_notes: result.exercise.technique_notes,
            )
          end,
        )
      }
    end

    def destroy
      workout = trainer_workouts.find(params[:id])
      workout.destroy!
      redirect_to trainer_workout_sessions_path, notice: "Entrenamiento eliminado del historial."
    end

    private

    def set_profile
      @profile = current_user.trainer_profile || current_user.create_trainer_profile!
    end

    def trainer_workouts
      WorkoutSession.joins(routine_assignment: :routine).where(routines: { trainer_profile_id: @profile.id })
    end

    def user_json
      current_user.as_json(only: [ :full_name, :email, :phone, :role ])
    end

    def workout_summary(workout)
      assignment = workout.routine_assignment
      workout.as_json(only: [ :id, :status, :started_at, :completed_at ]).merge(
        routine_name: assignment.routine.name,
        client_name: assignment.client_profile.user.full_name,
      )
    end
  end
end
