# frozen_string_literal: true

class AuthController < InertiaController
  before_action :redirect_signed_in_user

  def login
    render inertia: true
  end

  def register
    render inertia: true
  end
end
