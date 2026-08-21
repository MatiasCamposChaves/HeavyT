# frozen_string_literal: true

module ProfileManagement
  extend ActiveSupport::Concern

  def show
    render inertia: {
      user: current_user.as_json(only: [ :full_name, :email, :phone, :role ])
    }
  end

  def update
    attributes = profile_params.to_h.symbolize_keys
    if attributes[:password].blank?
      attributes.except!(:password, :password_confirmation)
    end

    if current_user.update(attributes)
      redirect_to profile_path_for_role, notice: "Perfil actualizado."
    else
      redirect_to profile_path_for_role, inertia: { errors: current_user.errors }
    end
  end

  private

  def profile_params
    params.require(:user).permit(:full_name, :phone, :password, :password_confirmation)
  end

  def profile_path_for_role
    public_send("#{current_user.role}_profile_path")
  end
end
