require "test_helper"

class TrainerLinkingTest < ActionDispatch::IntegrationTest
  test "trainer generates an active invite" do
    trainer = create_user(role: "trainer")
    sign_in(trainer)

    assert_difference("TrainerInvite.count", 1) do
      post trainer_invite_path
    end

    assert_redirected_to trainer_dashboard_path
    assert trainer.trainer_profile.current_invite.active?
  end

  test "client links to trainer with a valid code" do
    trainer = create_user(role: "trainer")
    client = create_user(role: "client")
    invite = trainer.trainer_profile.generate_invite!
    sign_in(client)

    post client_trainer_link_path, params: { trainer_link: { code: invite.code.downcase } }

    assert_redirected_to client_dashboard_path
    assert_equal trainer.trainer_profile, client.client_profile.reload.trainer_profile
    assert client.client_profile.linked_at.present?
  end

  test "client cannot link with an expired code" do
    trainer = create_user(role: "trainer")
    client = create_user(role: "client")
    invite = trainer.trainer_profile.trainer_invites.create!(code: "OLD123", expires_at: 1.minute.ago)
    sign_in(client)

    post client_trainer_link_path, params: { trainer_link: { code: invite.code } }

    assert_redirected_to client_dashboard_path
    assert_nil client.client_profile.reload.trainer_profile
  end

  test "client cannot replace an existing trainer" do
    first_trainer = create_user(role: "trainer")
    second_trainer = create_user(role: "trainer")
    client = create_user(role: "client")
    client.client_profile.update!(trainer_profile: first_trainer.trainer_profile, linked_at: Time.current)
    invite = second_trainer.trainer_profile.generate_invite!
    sign_in(client)

    post client_trainer_link_path, params: { trainer_link: { code: invite.code } }

    assert_equal first_trainer.trainer_profile, client.client_profile.reload.trainer_profile
  end

  private

  def create_user(role:)
    User.create!(
      full_name: "Test #{role}",
      email: "#{role}-#{SecureRandom.hex(5)}@example.com",
      phone: "+502 5555 5555",
      password: "password123",
      role: role,
    )
  end

  def sign_in(user)
    post login_path, params: { session: { email: user.email, password: "password123" } }
  end
end
