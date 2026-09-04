# frozen_string_literal: true

class Exercise < ApplicationRecord
  DAYS = {
    1 => "Lunes", 2 => "Martes", 3 => "Miércoles", 4 => "Jueves",
    5 => "Viernes", 6 => "Sábado", 0 => "Domingo"
  }.freeze
  SET_TYPES = {
    "standard" => "Serie normal",
    "bi_set" => "Biserie",
    "super_set" => "Superserie",
    "drop_set" => "Drop set"
  }.freeze

  belongs_to :routine, inverse_of: :exercises
  has_many :exercise_results, dependent: :restrict_with_error

  before_validation :normalize_training_technique

  validates :name, presence: true, length: { maximum: 120 }
  validates :sets, numericality: { only_integer: true, greater_than: 0 }
  validates :repetitions, numericality: { only_integer: true, greater_than: 0 }
  validates :rest_seconds, numericality: { only_integer: true, greater_than_or_equal_to: 0 }, allow_nil: true
  validates :suggested_weight_lb, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :notes, length: { maximum: 500 }
  validates :set_type, inclusion: { in: SET_TYPES.keys }
  validates :paired_exercise_name, length: { maximum: 120 }
  validates :paired_exercise_name, presence: true, if: :paired_set?
  validates :drop_sets_count, numericality: { only_integer: true, greater_than: 0 }, allow_nil: true
  validates :drop_sets_count, presence: true, if: :drop_set?
  validates :technique_notes, length: { maximum: 500 }
  validates :position, numericality: { only_integer: true, greater_than: 0 }
  validates :day_of_week, inclusion: { in: DAYS.keys }

  def day_name
    DAYS[day_of_week]
  end

  def set_type_name
    SET_TYPES[set_type]
  end

  def paired_set?
    set_type.in?(%w[bi_set super_set])
  end

  def drop_set?
    set_type == "drop_set"
  end

  private

  def normalize_training_technique
    self.set_type = "standard" if set_type.blank?
    self.paired_exercise_name = nil unless paired_set?
    self.drop_sets_count = nil unless drop_set?
    self.technique_notes = nil if technique_notes.blank?
  end
end
