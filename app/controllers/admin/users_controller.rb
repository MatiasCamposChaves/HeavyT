# frozen_string_literal: true

module Admin
  class UsersController < InertiaController
    before_action -> { authorize_role!(:admin) }
    before_action :set_user, except: :index

    def index
      users = User.where.not(role: "admin").order(:full_name)
      users = users.where(role: params[:role]) if %w[client trainer].include?(params[:role])
      users = params[:status] == "blocked" ? users.blocked : users.active if %w[active blocked].include?(params[:status])

      if params[:q].present?
        term = "%#{ActiveRecord::Base.sanitize_sql_like(params[:q].strip)}%"
        users = users.where("full_name ILIKE :term OR email ILIKE :term", term: term)
      end

      render inertia: {
        user: current_user.as_json(only: [:full_name, :email, :phone, :role]),
        users: users.limit(100).map { |item| user_summary(item) },
        filters: { q: params[:q].to_s, role: params[:role].to_s, status: params[:status].to_s },
      }
    end

    def show
      render inertia: { user: current_user_json, managed_user: user_detail(@user) }
    end

    def edit
      render inertia: { user: current_user_json, managed_user: user_detail(@user) }
    end

    def update
      if @user.update(user_params)
        redirect_to admin_user_path(@user), notice: "Usuario actualizado."
      else
        redirect_to edit_admin_user_path(@user), inertia: { errors: @user.errors }
      end
    end

    def block
      @user.update!(blocked_at: Time.current)
      redirect_to admin_user_path(@user), notice: "Usuario bloqueado."
    end

    def unblock
      @user.update!(blocked_at: nil)
      redirect_to admin_user_path(@user), notice: "Usuario reactivado."
    end

    private

    def set_user
      @user = User.where.not(role: "admin").find(params[:id])
    end

    def user_params
      params.require(:user).permit(:full_name, :phone)
    end

    def current_user_json
      current_user.as_json(only: [:full_name, :email, :phone, :role])
    end

    def user_summary(item)
      item.as_json(only: [:id, :full_name, :email, :phone, :role, :blocked_at]).merge(
        blocked: item.blocked?,
        related_count: item.trainer? ? item.trainer_profile&.client_profiles&.count.to_i : item.client_profile&.routines&.count.to_i,
      )
    end

    def user_detail(item)
      user_summary(item).merge(
        trainer: item.client? ? item.client_profile&.trainer_profile&.user&.as_json(only: [:id, :full_name, :email]) : nil,
      )
    end
  end
end
