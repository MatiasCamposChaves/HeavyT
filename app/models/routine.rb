# frozen_string_literal: true

class Routine < ApplicationRecord
  STATUSES = %w[draft active].freeze

  belongs_to :trainer_profile
  has_many :exercises, -> { order(:position, :created_at) }, dependent: :destroy, inverse_of: :routine
  has_many :routine_assignments, dependent: :destroy
  has_many :client_profiles, through: :routine_assignments

  validates :name, presence: true, length: { maximum: 120 }
  validates :description, length: { maximum: 1_000 }
  validates :goal, length: { maximum: 80 }
  validates :status, inclusion: { in: STATUSES }

  def assign_to!(client_profiles)
    raise ActiveRecord::RecordInvalid, self if exercises.empty?

    transaction do
      routine_assignments.where.not(client_profile_id: client_profiles.map(&:id)).destroy_all
      client_profiles.each do |client_profile|
        routine_assignments.find_or_create_by!(client_profile: client_profile) do |assignment|
          assignment.assigned_at = Time.current
        end
      end
      update!(status: "active")
    end
  end
end
