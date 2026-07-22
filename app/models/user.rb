# frozen_string_literal: true

class User < ApplicationRecord
  ROLES = %w[client trainer admin].freeze

  has_secure_password

  has_one :trainer_profile, dependent: :destroy
  has_one :client_profile, dependent: :destroy

  before_validation :normalize_email
  after_create :create_role_profile

  validates :full_name, presence: true, length: { maximum: 120 }
  validates :email, presence: true, uniqueness: { case_sensitive: false },
    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :phone, presence: true, length: { maximum: 30 }
  validates :password, length: { minimum: 8 }, allow_nil: true
  validates :role, inclusion: { in: ROLES }

  scope :active, -> { where(blocked_at: nil) }
  scope :blocked, -> { where.not(blocked_at: nil) }

  def client?
    role == "client"
  end

  def trainer?
    role == "trainer"
  end

  def admin?
    role == "admin"
  end

  def blocked?
    blocked_at.present?
  end

  private

  def normalize_email
    self.email = email.to_s.strip.downcase
  end

  def create_role_profile
    create_trainer_profile! if trainer?
    create_client_profile! if client?
  end
end
