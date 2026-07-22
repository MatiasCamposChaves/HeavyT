# frozen_string_literal: true

module Admin
  class ProfilesController < InertiaController
    include ProfileManagement
    before_action -> { authorize_role!(:admin) }
  end
end
