# frozen_string_literal: true

module Client
  class ProfilesController < InertiaController
    include ProfileManagement
    before_action -> { authorize_role!(:client) }
  end
end
