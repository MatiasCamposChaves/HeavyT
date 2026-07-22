# frozen_string_literal: true

class Exercise < ApplicationRecord
  DAYS = {
    1 => "Lunes", 2 => "Martes", 3 => "Miércoles", 4 => "Jueves",
    5 => "Viernes", 6 => "Sábado", 0 => "Domingo"
  }.freeze

  belongs_to :routine, inverse_of: :exercises
  has_many :exercise_results, dependent: :restrict_with_error

  validates :name, presence: true, length: { maximum: 120 }
  validates :sets, numericality: { only_integer: true, greater_than: 0 }
  validates :repetitions, numericality: { only_integer: true, greater_than: 0 }
  validates :rest_seconds, numericality: { only_integer: true, greater_than_or_equal_to: 0 }, allow_nil: true
  validates :suggested_weight_lb, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :notes, length: { maximum: 500 }
  validates :position, numericality: { only_integer: true, greater_than: 0 }
  validates :day_of_week, inclusion: { in: DAYS.keys }

  def day_name
    DAYS[day_of_week]
  end
end
