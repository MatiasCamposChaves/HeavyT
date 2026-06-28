# frozen_string_literal: true

class RegistrationsController < InertiaController
  before_action :redirect_signed_in_user, only: :create

  def create
    user = User.new(user_params)

    if user.save
      reset_session
      session[:user_id] = user.id
      redirect_to dashboard_path
    else
      redirect_to register_path, inertia: { errors: user.errors }
    end
  end

  private

  def user_params
    params.require(:user).permit(:full_name, :email, :phone, :password)
  end
end
