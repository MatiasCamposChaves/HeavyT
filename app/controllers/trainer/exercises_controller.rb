# frozen_string_literal: true

module Trainer
  class ExercisesController < InertiaController
    before_action -> { authorize_role!(:trainer) }
    before_action :set_routine
    before_action :set_exercise, only: [:update, :destroy]

    def create
      exercise = @routine.exercises.new(exercise_params)
      exercise.position ||= @routine.exercises.maximum(:position).to_i + 1

      if exercise.save
        redirect_to trainer_routine_path(@routine), notice: "Ejercicio agregado."
      else
        redirect_to trainer_routine_path(@routine), inertia: { errors: exercise.errors }
      end
    end

    def update
      if @exercise.update(exercise_params)
        redirect_to trainer_routine_path(@routine), notice: "Ejercicio actualizado."
      else
        redirect_to trainer_routine_path(@routine), inertia: { errors: @exercise.errors }
      end
    end

    def destroy
      @exercise.destroy!
      redirect_to trainer_routine_path(@routine), notice: "Ejercicio eliminado."
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
      params.require(:exercise).permit(
        :name, :sets, :repetitions, :rest_seconds, :suggested_weight_lb, :notes, :position,
      )
    end
  end
end
