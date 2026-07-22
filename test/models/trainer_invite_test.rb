require "test_helper"

class TrainerInviteTest < ActiveSupport::TestCase
  test "generated invite expires after 24 hours" do
    trainer = create_user(role: "trainer")

    invite = trainer.trainer_profile.generate_invite!

    assert_equal 6, invite.code.length
    assert_in_delta 24.hours.from_now, invite.expires_at, 2.seconds
    assert invite.active?
  end

  test "generating a new invite revokes the previous one" do
    trainer = create_user(role: "trainer")
    previous = trainer.trainer_profile.generate_invite!

    current = trainer.trainer_profile.generate_invite!

    assert_not previous.reload.active?
    assert current.active?
    assert_not_equal previous.code, current.code
  end

  private

  def create_user(role:)
    User.create!(
      full_name: "Test Trainer",
      email: "trainer-#{SecureRandom.hex(4)}@example.com",
      phone: "+502 5555 5555",
      password: "password123",
      role: role,
    )
  end
end
