# frozen_string_literal: true

class PasswordResetMailer < ApplicationMailer
  def reset
    @user = params[:user]
    @reset_url = edit_password_reset_url(@user.signed_id(purpose: :password_reset, expires_in: PasswordResetsController::TOKEN_TTL))

    mail(to: @user.email, subject: "Restablece tu contraseña de HeavyT")
  end
end
