# frozen_string_literal: true

module Client
  class ExerciseResultsController < InertiaController
    before_action -> { authorize_role!(:client) }

    def update
      profile = current_user.client_profile || current_user.create_client_profile!
      workout = profile.workout_sessions.find(params[:workout_session_id])
      result = workout.exercise_results.find(params[:id])

      if workout.status == "completed"
        redirect_to client_workout_session_path(workout), alert: "Este entrenamiento ya fue finalizado."
      elsif result.update(result_params)
        redirect_to client_workout_session_path(workout), notice: "Ejercicio guardado."
      else
        redirect_to client_workout_session_path(workout), inertia: { errors: result.errors }
      end
    end

    private

    def result_params
      params.require(:exercise_result).permit(
        :completed_sets, :actual_repetitions, :actual_weight_lb, :completed, :notes,
        :paired_actual_repetitions, :paired_actual_weight_lb,
        drop_set_results: [ :repetitions, :weight_lb ],
      )
    end
  end
end
