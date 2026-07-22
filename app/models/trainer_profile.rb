# frozen_string_literal: true

class TrainerProfile < ApplicationRecord
  INVITE_DURATION = 24.hours

  belongs_to :user
  has_many :client_profiles, dependent: :nullify
  has_many :clients, through: :client_profiles, source: :user
  has_many :trainer_invites, dependent: :destroy
  has_many :routines, dependent: :destroy

  validate :user_must_be_trainer

  def current_invite
    trainer_invites.active.order(created_at: :desc).first
  end

  def generate_invite!
    transaction do
      trainer_invites.active.update_all(revoked_at: Time.current)
      create_unique_invite!
    end
  end

  private

  def create_unique_invite!
    loop do
      code = SecureRandom.alphanumeric(6).upcase
      return trainer_invites.create!(code: code, expires_at: INVITE_DURATION.from_now)
    rescue ActiveRecord::RecordNotUnique
      next
    rescue ActiveRecord::RecordInvalid => error
      raise unless error.record.errors[:code].any? && TrainerInvite.exists?(code: code)

      next
    end
  end

  def user_must_be_trainer
    errors.add(:user, "debe ser un entrenador") unless user&.trainer?
  end
end
