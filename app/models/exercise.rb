# frozen_string_literal: true

class Exercise < ApplicationRecord
  belongs_to :routine, inverse_of: :exercises

  validates :name, presence: true, length: { maximum: 120 }
  validates :sets, numericality: { only_integer: true, greater_than: 0 }
  validates :repetitions, numericality: { only_integer: true, greater_than: 0 }
  validates :rest_seconds, numericality: { only_integer: true, greater_than_or_equal_to: 0 }, allow_nil: true
  validates :suggested_weight_lb, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :notes, length: { maximum: 500 }
  validates :position, numericality: { only_integer: true, greater_than: 0 }
end
