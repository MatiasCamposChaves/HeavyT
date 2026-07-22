# frozen_string_literal: true

class RoutineAssignment < ApplicationRecord
  STATUSES = %w[active archived].freeze

  belongs_to :routine
  belongs_to :client_profile

  validates :client_profile_id, uniqueness: { scope: :routine_id }
  validates :assigned_at, presence: true
  validates :status, inclusion: { in: STATUSES }
  validate :client_belongs_to_routine_trainer

  private

  def client_belongs_to_routine_trainer
    return if routine.blank? || client_profile.blank?
    return if client_profile.trainer_profile_id == routine.trainer_profile_id

    errors.add(:client_profile, "no pertenece a este entrenador")
  end
end
