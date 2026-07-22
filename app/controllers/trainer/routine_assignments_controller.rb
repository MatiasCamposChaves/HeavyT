# frozen_string_literal: true

module Trainer
  class RoutineAssignmentsController < InertiaController
    before_action -> { authorize_role!(:trainer) }

    def create
      profile = current_user.trainer_profile || current_user.create_trainer_profile!
      routine = profile.routines.find(params[:routine_id])
      client_ids = Array(params.dig(:assignment, :client_profile_ids)).reject(&:blank?)
      clients = profile.client_profiles.where(id: client_ids)

      if clients.empty?
        return redirect_to trainer_routine_path(routine),
          inertia: { errors: { clients: ["Selecciona al menos un cliente vinculado."] } }
      end

      routine.assign_to!(clients)
      redirect_to trainer_routine_path(routine), notice: "Rutina asignada a #{clients.size} cliente(s)."
    rescue ActiveRecord::RecordInvalid
      redirect_to trainer_routine_path(routine),
        inertia: { errors: { clients: ["Agrega al menos un ejercicio antes de asignar la rutina."] } }
    end
  end
end
