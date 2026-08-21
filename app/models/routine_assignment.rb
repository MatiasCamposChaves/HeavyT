# frozen_string_literal: true

class RoutineAssignment < ApplicationRecord
  STATUSES = %w[active archived].freeze
  scope :active, -> { where(status: "active").where("expires_on IS NULL OR expires_on > ?", Date.current) }
  scope :pending_expiration_decision, -> { where(status: "active").where(expires_on: ..Date.current) }

  belongs_to :routine
  belongs_to :client_profile
  has_many :workout_sessions, dependent: :destroy

  validates :client_profile_id, uniqueness: { scope: :routine_id }
  validates :assigned_at, presence: true
  validates :status, inclusion: { in: STATUSES }
  validate :client_belongs_to_routine_trainer

  def expiring_tomorrow?
    status == "active" && expires_on == Date.current.tomorrow
  end

  def expired?
    status == "active" && expires_on.present? && expires_on <= Date.current
  end

  def extend_for_weeks!(weeks)
    duration = Integer(weeks)
    raise ArgumentError unless duration.between?(1, 52)

    update!(expires_on: [ expires_on, Date.current ].compact.max + duration.weeks, status: "active")
  end

  def archive!
    update!(status: "archived")
  end

  private

  def client_belongs_to_routine_trainer
    return if routine.blank? || client_profile.blank?
    return if client_profile.trainer_profile_id == routine.trainer_profile_id

    errors.add(:client_profile, "no pertenece a este entrenador")
  end
end
