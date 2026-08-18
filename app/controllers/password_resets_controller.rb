# frozen_string_literal: true

class PasswordResetsController < InertiaController
  before_action :redirect_signed_in_user
  before_action :set_user_from_token, only: [:edit, :update]

  TOKEN_TTL = 30.minutes

  def new
    render inertia: "auth/password_resets/new"
  end

  def create
    user = User.active.find_by(email: email_param)
    PasswordResetMailer.with(user: user).reset.deliver_now if user

    redirect_to login_path, notice: "Si el correo existe, te enviamos un enlace para restablecer tu contraseña."
  end

  def edit
    render inertia: "auth/password_resets/edit", props: { token: params[:token] }
  end

  def update
    if @user.update(password_params)
      redirect_to login_path, notice: "Tu contraseña se actualizó correctamente. Ya puedes iniciar sesión."
    else
      redirect_to edit_password_reset_path(params[:token]), inertia: { errors: @user.errors }
    end
  end

  private

  def email_param
    params.require(:password_reset).permit(:email)[:email].to_s.strip.downcase
  end

  def password_params
    params.require(:user).permit(:password, :password_confirmation)
  end

  def set_user_from_token
    @user = User.find_signed(params[:token], purpose: :password_reset)
    return if @user

    redirect_to new_password_reset_path, alert: "El enlace de recuperación expiró o no es válido."
  end
end
