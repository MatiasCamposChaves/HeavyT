# frozen_string_literal: true

class RegistrationsController < InertiaController
  before_action :redirect_signed_in_user, only: :create

  def create
    user = User.new(user_params)

    if user.save
      reset_session
      session[:user_id] = user.id
      redirect_to dashboard_path_for(user)
    else
      redirect_to register_path, inertia: { errors: user.errors }
    end
  end

  private

  def user_params
    permitted = params.require(:user).permit(:full_name, :email, :phone, :password, :password_confirmation)
    requested_role = params.dig(:user, :role)
    permitted[:role] = %w[client trainer].include?(requested_role) ? requested_role : "client"
    permitted
  end
end
