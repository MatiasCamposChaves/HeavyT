# frozen_string_literal: true

module Trainer
  class RoutinesController < InertiaController
    before_action -> { authorize_role!(:trainer) }
    before_action :set_profile
    before_action :set_routine, only: [ :show, :edit, :update, :destroy ]

    def index
      routines = @profile.routines.includes(:exercises, :routine_assignments).order(updated_at: :desc)
      render inertia: {
        user: user_json,
        routines: routines.map { |routine| routine_summary(routine) }
      }
    end

    def new
      render inertia: { user: user_json }
    end

    def create
      routine = @profile.routines.new(routine_params)
      if routine.save
        redirect_to trainer_routine_path(routine), notice: "Rutina creada. Ahora agrega sus ejercicios."
      else
        redirect_to new_trainer_routine_path, inertia: { errors: routine.errors }
      end
    end

    def show
      clients = @profile.client_profiles.joins(:user).includes(:user).order("users.full_name")
      assignments = @routine.routine_assignments.index_by(&:client_profile_id)
      exercise_templates = @profile.exercise_templates.order(:name)

      render inertia: {
        user: user_json,
        routine: routine_detail(@routine),
        muscle_groups: ExerciseTemplate::MUSCLE_GROUPS,
        exercise_templates: exercise_templates.as_json(
          only: [ :id, :name, :muscle_group, :equipment, :notes ],
        ),
        clients: clients.map do |client|
          client.user.as_json(only: [ :id, :full_name, :email ]).merge(
            client_profile_id: client.id,
            assigned: assignments.key?(client.id),
            expires_on: assignments[client.id]&.expires_on,
          )
        end
      }
    end

    def edit
      render inertia: { user: user_json, routine: routine_detail(@routine) }
    end

    def update
      if @routine.update(routine_params)
        redirect_to trainer_routine_path(@routine), notice: "Rutina actualizada."
      else
        redirect_to edit_trainer_routine_path(@routine), inertia: { errors: @routine.errors }
      end
    end

    def destroy
      @routine.destroy!
      redirect_to trainer_routines_path, notice: "Rutina eliminada."
    end

    private

    def set_profile
      @profile = current_user.trainer_profile || current_user.create_trainer_profile!
    end

    def set_routine
      @routine = @profile.routines.find(params[:id])
    end

    def routine_params
      params.require(:routine).permit(:name, :description, :goal, :status)
    end

    def user_json
      current_user.as_json(only: [ :full_name, :email, :phone, :role ])
    end

    def routine_summary(routine)
      routine.as_json(only: [ :id, :name, :goal, :status, :updated_at ]).merge(
        exercises_count: routine.exercises.size,
        assignments_count: routine.routine_assignments.size,
      )
    end

    def routine_detail(routine)
      routine.as_json(only: [ :id, :name, :description, :goal, :status ]).merge(
        exercises: routine.exercises.map { |exercise| exercise_json(exercise) },
      )
    end

    def exercise_json(exercise)
      exercise.as_json(
        only: [
          :id, :name, :sets, :repetitions, :rest_seconds, :suggested_weight_lb, :notes, :position, :day_of_week,
          :set_type, :paired_exercise_name, :drop_sets_count, :technique_notes
        ],
        methods: [ :set_type_name ],
      )
    end
  end
end
