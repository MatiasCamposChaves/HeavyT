class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  # Changes to the importmap will invalidate the etag for HTML responses
  stale_when_importmap_changes

  helper_method :current_user, :user_signed_in?

  private

  def current_user
    @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
  end

  def user_signed_in?
    current_user.present?
  end

  def authenticate_user!
    if current_user&.blocked?
      reset_session
      return redirect_to login_path, alert: "Tu cuenta está bloqueada. Contacta al administrador."
    end

    return if user_signed_in?

    redirect_to login_path
  end

  def authorize_role!(*roles)
    authenticate_user!
    return if performed? || roles.map(&:to_s).include?(current_user.role)

    redirect_to dashboard_path, alert: "No tienes permiso para acceder a esa sección."
  end

  def dashboard_path_for(user)
    case user.role
    when "admin" then admin_dashboard_path
    when "trainer" then trainer_dashboard_path
    else client_dashboard_path
    end
  end

  def redirect_signed_in_user
    redirect_to dashboard_path_for(current_user) if user_signed_in?
  end
end
