# frozen_string_literal: true

module Trainer
  class ProfilesController < InertiaController
    include ProfileManagement
    before_action -> { authorize_role!(:trainer) }
  end
end
