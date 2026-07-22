require "test_helper"

class ClientNotificationsTest < ActionDispatch::IntegrationTest
  setup do
    @trainer = create_user("trainer")
    @client = create_user("client")
    @client.client_profile.update!(trainer_profile: @trainer.trainer_profile, linked_at: Time.current)
    @routine = @trainer.trainer_profile.routines.create!(name: "Plan de fuerza", status: "active")
    @routine.exercises.create!(name: "Sentadilla", sets: 3, repetitions: 10, position: 1, day_of_week: Date.current.wday)
    @assignment = @routine.routine_assignments.create!(client_profile: @client.client_profile,
      assigned_at: Time.current, expires_on: Date.current + 4.weeks)
    post login_path, params: { session: { email: @client.email, password: "password123" } }
  end

  test "client sees assigned routine notification with expiration" do
    get client_notifications_path

    assert_response :success
    assert_includes response.body, "Se te asignó una rutina"
    assert_includes response.body, "Plan de fuerza"
    assert_includes response.body, @assignment.expires_on.to_s
  end

  test "client dashboard includes todays workout" do
    get client_dashboard_path

    assert_response :success
    assert_includes response.body, "Entrenamiento de hoy"
    assert_includes response.body, "Plan de fuerza"
  end

  private

  def create_user(role)
    User.create!(full_name: "Test #{role}", email: "#{role}-#{SecureRandom.hex(5)}@example.com",
      phone: "+502 5555 5555", password: "password123", role: role)
  end
end
