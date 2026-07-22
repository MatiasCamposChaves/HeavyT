# frozen_string_literal: true

class ClientProfile < ApplicationRecord
  belongs_to :user
  belongs_to :trainer_profile, optional: true

  validate :user_must_be_client

  def link_to!(invite)
    raise ActiveRecord::RecordInvalid, self if trainer_profile.present?
    raise TrainerInvite::InvalidCode unless invite&.active?

    update!(trainer_profile: invite.trainer_profile, linked_at: Time.current)
  end

  private

  def user_must_be_client
    errors.add(:user, "debe ser un cliente") unless user&.client?
  end
end
