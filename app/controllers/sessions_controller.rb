# frozen_string_literal: true

class SessionsController < InertiaController
  before_action :redirect_signed_in_user, only: :create

  def create
    user = User.find_by(email: session_params[:email].to_s.strip.downcase)

    if user&.authenticate(session_params[:password])
      reset_session
      session[:user_id] = user.id
      redirect_to dashboard_path
    else
      redirect_to login_path, inertia: { errors: { email: ["Correo o contraseña incorrectos"] } }
    end
  end

  def destroy
    reset_session
    redirect_to login_path
  end

  private

  def session_params
    params.require(:session).permit(:email, :password)
  end
end
