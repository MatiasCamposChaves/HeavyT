require "test_helper"

class TrainerNotificationsTest < ActionDispatch::IntegrationTest
  setup do
    @trainer = create_user("trainer")
    @client = create_user("client")
    @client.client_profile.update!(trainer_profile: @trainer.trainer_profile, linked_at: Time.current)
    @routine = @trainer.trainer_profile.routines.create!(name: "Pierna", status: "active")
    @assignment = @routine.routine_assignments.create!(client_profile: @client.client_profile,
      assigned_at: Time.current, expires_on: Date.current.tomorrow)
    post login_path, params: { session: { email: @trainer.email, password: "password123" } }
  end

  test "trainer sees routines that expire tomorrow" do
    get trainer_notifications_path

    assert_response :success
    assert_includes response.body, "La rutina está por vencer"
    assert_includes response.body, "Pierna"
  end

  test "trainer extends or archives an assignment" do
    patch extend_assignment_trainer_notification_path(@assignment), params: { weeks: 2 }
    assert_equal Date.current.tomorrow + 2.weeks, @assignment.reload.expires_on

    patch archive_assignment_trainer_notification_path(@assignment)
    assert_equal "archived", @assignment.reload.status
  end

  private

  def create_user(role)
    User.create!(full_name: "Test #{role}", email: "#{role}-#{SecureRandom.hex(5)}@example.com",
      phone: "+502 5555 5555", password: "password123", role: role)
  end
end
