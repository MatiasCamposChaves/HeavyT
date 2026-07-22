# frozen_string_literal: true

module Client
  class TrainerLinksController < InertiaController
    before_action -> { authorize_role!(:client) }

    def create
      profile = current_user.client_profile || current_user.create_client_profile!

      if profile.trainer_profile.present?
        return redirect_with_error("Tu cuenta ya está vinculada con un entrenador.")
      end

      invite = TrainerInvite.find_active(params.dig(:trainer_link, :code))
      return redirect_with_error("El código es inválido o ya venció.") unless invite

      profile.link_to!(invite)
      redirect_to client_dashboard_path, notice: "Te vinculaste con #{invite.trainer_profile.user.full_name}."
    rescue TrainerInvite::InvalidCode
      redirect_with_error("El código es inválido o ya venció.")
    end

    private

    def redirect_with_error(message)
      redirect_to client_dashboard_path, inertia: { errors: { code: [message] } }
    end
  end
end
