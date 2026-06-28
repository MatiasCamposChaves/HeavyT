# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password

  before_validation :normalize_email

  validates :full_name, presence: true, length: { maximum: 120 }
  validates :email, presence: true, uniqueness: { case_sensitive: false },
    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :phone, presence: true, length: { maximum: 30 }
  validates :password, length: { minimum: 8 }, allow_nil: true

  private

  def normalize_email
    self.email = email.to_s.strip.downcase
  end
end
