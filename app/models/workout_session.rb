# frozen_string_literal: true

class WorkoutSession < ApplicationRecord
  STATUSES = %w[in_progress completed].freeze

  belongs_to :routine_assignment
  has_one :routine, through: :routine_assignment
  has_one :client_profile, through: :routine_assignment
  has_many :exercise_results, dependent: :destroy

  validates :status, inclusion: { in: STATUSES }
  validates :started_at, presence: true
  validates :day_of_week, inclusion: { in: Exercise::DAYS.keys }, allow_nil: true
  validates :notes, length: { maximum: 1_000 }

  def completed?
    status == "completed"
  end

  def day_name
    Exercise::DAYS[day_of_week]
  end

  def complete!
    raise ActiveRecord::RecordInvalid, self unless exercise_results.all?(&:completed?)

    update!(status: "completed", completed_at: Time.current)
  end
end
