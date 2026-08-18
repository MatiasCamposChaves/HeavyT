# frozen_string_literal: true

class ExerciseTemplate < ApplicationRecord
  MUSCLE_GROUPS = [
    "Pecho",
    "Espalda",
    "Hombros",
    "Bíceps",
    "Tríceps",
    "Antebrazos",
    "Abdomen / core",
    "Glúteos",
    "Cuádriceps",
    "Isquiotibiales",
    "Pantorrillas",
    "Cadera",
    "Piernas",
    "Cuerpo completo",
  ].freeze

  belongs_to :trainer_profile

  validates :name, presence: true, length: { maximum: 120 }
  validates :muscle_group, presence: true, length: { maximum: 80 }
  validates :muscle_group, inclusion: { in: MUSCLE_GROUPS }
  validates :equipment, length: { maximum: 80 }
  validates :notes, length: { maximum: 500 }
end
