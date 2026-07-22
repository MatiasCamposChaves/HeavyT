# frozen_string_literal: true

class TrainerInvite < ApplicationRecord
  class InvalidCode < StandardError; end

  belongs_to :trainer_profile

  before_validation :normalize_code

  validates :code, presence: true, uniqueness: true, length: { is: 6 }
  validates :expires_at, presence: true

  scope :active, -> { where(revoked_at: nil).where("expires_at > ?", Time.current) }

  def self.find_active(code)
    active.find_by(code: normalize(code))
  end

  def self.normalize(code)
    code.to_s.gsub(/\s+/, "").upcase
  end

  def active?
    revoked_at.nil? && expires_at.future?
  end

  private

  def normalize_code
    self.code = self.class.normalize(code)
  end
end
