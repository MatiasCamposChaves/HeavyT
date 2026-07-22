# frozen_string_literal: true

class ExerciseResult < ApplicationRecord
  belongs_to :workout_session
  belongs_to :exercise

  validates :exercise_id, uniqueness: { scope: :workout_session_id }
  validates :completed_sets, :actual_repetitions, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :actual_weight_lb, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :notes, length: { maximum: 500 }
  validate :exercise_belongs_to_session_routine

  private

  def exercise_belongs_to_session_routine
    return if exercise.blank? || workout_session.blank?
    return if exercise.routine_id == workout_session.routine_assignment.routine_id

    errors.add(:exercise, "no pertenece a la rutina de esta sesión")
  end
end
