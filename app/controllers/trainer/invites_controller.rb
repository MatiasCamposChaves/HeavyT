# frozen_string_literal: true

module Trainer
  class InvitesController < InertiaController
    before_action -> { authorize_role!(:trainer) }

    def create
      profile = current_user.trainer_profile || current_user.create_trainer_profile!
      profile.generate_invite!

      redirect_to trainer_dashboard_path, notice: "Código generado. Será válido durante 24 horas."
    end
  end
end
