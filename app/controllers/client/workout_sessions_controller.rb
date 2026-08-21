# frozen_string_literal: true

module Client
  class WorkoutSessionsController < InertiaController
    before_action -> { authorize_role!(:client) }
    before_action :set_profile
    before_action :set_workout, only: [ :show, :complete ]

    def index
      workouts = @profile.workout_sessions.includes(routine_assignment: :routine).order(started_at: :desc)
      render inertia: { user: user_json, workouts: workouts.map { |workout| workout_summary(workout) } }
    end

    def create
      assignment = @profile.routine_assignments.active.find_by!(routine_id: params[:routine_id])
      day_of_week = Integer(params[:day_of_week])
      exercises = assignment.routine.exercises.where(day_of_week: day_of_week)
      raise ActiveRecord::RecordNotFound if exercises.empty? || !Exercise::DAYS.key?(day_of_week)

      workout = assignment.workout_sessions.find_by(status: "in_progress", day_of_week: day_of_week)

      workout ||= WorkoutSession.transaction do
        created = assignment.workout_sessions.create!(started_at: Time.current, day_of_week: day_of_week)
        exercises.each { |exercise| created.exercise_results.create!(exercise: exercise) }
        created
      end

      redirect_to client_workout_session_path(workout)
    end

    def show
      render inertia: {
        user: user_json,
        workout: workout_detail(@workout)
      }
    end

    def complete
      if @workout.exercise_results.all?(&:completed?)
        @workout.complete!
        redirect_to client_workout_session_path(@workout), notice: "Entrenamiento completado."
      else
        redirect_to client_workout_session_path(@workout), alert: "Completa todos los ejercicios antes de finalizar."
      end
    end

    private

    def set_profile
      @profile = current_user.client_profile || current_user.create_client_profile!
    end

    def set_workout
      @workout = @profile.workout_sessions.includes(exercise_results: :exercise).find(params[:id])
    end

    def user_json
      current_user.as_json(only: [ :full_name, :email, :phone, :role ])
    end

    def workout_summary(workout)
      workout.as_json(only: [ :id, :status, :started_at, :completed_at ]).merge(
        routine_name: workout.routine_assignment.routine.name,
        day_name: workout.day_name,
      )
    end

    def workout_detail(workout)
      workout_summary(workout).merge(
        trainer_name: workout.routine_assignment.routine.trainer_profile.user.full_name,
        results: workout.exercise_results.sort_by { |result| result.exercise.position }.map do |result|
          result.as_json(only: [ :id, :completed_sets, :actual_repetitions, :actual_weight_lb, :completed, :notes ]).merge(
            exercise: result.exercise.as_json(only: [ :id, :name, :sets, :repetitions, :suggested_weight_lb, :position ]),
          )
        end,
      )
    end
  end
end
