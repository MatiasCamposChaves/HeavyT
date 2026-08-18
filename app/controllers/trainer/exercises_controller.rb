# frozen_string_literal: true

module Trainer
  class ExercisesController < InertiaController
    before_action -> { authorize_role!(:trainer) }
    before_action :set_routine
    before_action :set_exercise, only: [:update, :destroy, :move]

    def create
      exercise = @routine.exercises.new(exercise_params)
      exercise.position = @routine.exercises.where(day_of_week: exercise.day_of_week).maximum(:position).to_i + 1

      if exercise.save
        redirect_to trainer_routine_path(@routine), notice: "Ejercicio agregado."
      else
        redirect_to trainer_routine_path(@routine), inertia: { errors: exercise.errors }
      end
    end

    def update
      previous_day = @exercise.day_of_week
      requested_day = exercise_params[:day_of_week]&.to_i
      @exercise.position = @routine.exercises.where(day_of_week: requested_day).where.not(id: @exercise.id).maximum(:position).to_i + 1 if requested_day != previous_day

      if @exercise.update(exercise_params)
        normalize_positions!(previous_day) if requested_day != previous_day
        redirect_to trainer_routine_path(@routine), notice: "Ejercicio actualizado."
      else
        redirect_to trainer_routine_path(@routine), inertia: { errors: @exercise.errors }
      end
    end

    def destroy
      day = @exercise.day_of_week
      @exercise.destroy!
      normalize_positions!(day)
      redirect_to trainer_routine_path(@routine), notice: "Ejercicio eliminado."
    end

    def move
      exercises = @routine.exercises.where(day_of_week: @exercise.day_of_week).order(:position, :created_at).to_a
      current_index = exercises.index(@exercise)
      target_index = params[:direction] == "up" ? current_index - 1 : current_index + 1

      if target_index.between?(0, exercises.length - 1)
        exercises[current_index], exercises[target_index] = exercises[target_index], exercises[current_index]
        Exercise.transaction { exercises.each_with_index { |exercise, index| exercise.update!(position: index + 1) } }
      end

      redirect_to trainer_routine_path(@routine), notice: "Orden de ejercicios actualizado."
    end

    private

    def set_routine
      profile = current_user.trainer_profile || current_user.create_trainer_profile!
      @routine = profile.routines.find(params[:routine_id])
    end

    def set_exercise
      @exercise = @routine.exercises.find(params[:id])
    end

    def exercise_params
      params.require(:exercise)
        .permit(:exercise_template_id, :name, :sets, :repetitions, :rest_seconds, :suggested_weight_lb, :notes, :day_of_week)
        .except(:exercise_template_id)
    end

    def normalize_positions!(day)
      @routine.exercises.where(day_of_week: day).order(:position, :created_at).each_with_index do |exercise, index|
        exercise.update_column(:position, index + 1)
      end
    end
  end
end
