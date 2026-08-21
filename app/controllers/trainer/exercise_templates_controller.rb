# frozen_string_literal: true

module Trainer
  class ExerciseTemplatesController < InertiaController
    before_action -> { authorize_role!(:trainer) }
    before_action :set_profile
    before_action :set_template, only: [ :update, :destroy ]

    def index
      render inertia: {
        user: user_json,
        muscle_groups: ExerciseTemplate::MUSCLE_GROUPS,
        exercise_templates: @profile.exercise_templates.order(:name).as_json(
          only: [ :id, :name, :muscle_group, :equipment, :notes ],
        )
      }
    end

    def create
      template = @profile.exercise_templates.new(template_params)

      if template.save
        redirect_to trainer_exercise_bank_path, notice: "Ejercicio guardado en el banco."
      else
        redirect_to trainer_exercise_bank_path, inertia: { errors: template.errors }
      end
    end

    def update
      if @template.update(template_params)
        redirect_to trainer_exercise_bank_path, notice: "Ejercicio actualizado."
      else
        redirect_to trainer_exercise_bank_path, inertia: { errors: @template.errors }
      end
    end

    def destroy
      @template.destroy!
      redirect_to trainer_exercise_bank_path, notice: "Ejercicio eliminado del banco."
    end

    private

    def set_profile
      @profile = current_user.trainer_profile || current_user.create_trainer_profile!
    end

    def set_template
      @template = @profile.exercise_templates.find(params[:id])
    end

    def template_params
      params.require(:exercise_template).permit(:name, :muscle_group, :equipment, :notes)
    end

    def user_json
      current_user.as_json(only: [ :full_name, :email, :phone, :role ])
    end
  end
end
