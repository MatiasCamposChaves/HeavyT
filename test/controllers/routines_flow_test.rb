require "test_helper"

class RoutinesFlowTest < ActionDispatch::IntegrationTest
  setup do
    @trainer = create_user("trainer")
    @client = create_user("client")
    @client.client_profile.update!(trainer_profile: @trainer.trainer_profile, linked_at: Time.current)
  end

  test "trainer creates updates and deletes a routine" do
    sign_in(@trainer)

    assert_difference("Routine.count", 1) do
      post trainer_routines_path, params: { routine: { name: "Rutina de pecho", goal: "Hipertrofia" } }
    end
    routine = @trainer.trainer_profile.routines.last
    assert_redirected_to trainer_routine_path(routine)

    patch trainer_routine_path(routine), params: { routine: { name: "Pecho avanzado" } }
    assert_equal "Pecho avanzado", routine.reload.name

    assert_difference("Routine.count", -1) { delete trainer_routine_path(routine) }
  end

  test "trainer adds edits and removes an exercise" do
    routine = @trainer.trainer_profile.routines.create!(name: "Piernas")
    sign_in(@trainer)

    assert_difference("Exercise.count", 1) do
      post trainer_routine_exercises_path(routine), params: {
        exercise: { name: "Sentadilla", sets: 4, repetitions: 8, rest_seconds: 90 },
      }
    end
    exercise = routine.exercises.last

    patch trainer_routine_exercise_path(routine, exercise), params: { exercise: { repetitions: 10 } }
    assert_equal 10, exercise.reload.repetitions
    assert_difference("Exercise.count", -1) { delete trainer_routine_exercise_path(routine, exercise) }
  end

  test "trainer assigns routine and client can view it" do
    routine = @trainer.trainer_profile.routines.create!(name: "Espalda")
    routine.exercises.create!(name: "Remo", sets: 4, repetitions: 12, position: 1)
    sign_in(@trainer)

    post trainer_routine_assignments_path(routine), params: {
      assignment: { client_profile_ids: [@client.client_profile.id] },
    }
    assert_redirected_to trainer_routine_path(routine)

    delete logout_path
    sign_in(@client)
    get client_routines_path
    assert_response :success
    get client_routine_path(routine)
    assert_response :success
  end

  test "trainer cannot edit another trainers routine" do
    another_trainer = create_user("trainer")
    routine = another_trainer.trainer_profile.routines.create!(name: "Privada")
    sign_in(@trainer)

    get trainer_routine_path(routine)

    assert_response :not_found
  end

  private

  def create_user(role)
    User.create!(full_name: "Test #{role}", email: "#{role}-#{SecureRandom.hex(5)}@example.com",
      phone: "+502 5555 5555", password: "password123", role: role)
  end

  def sign_in(user)
    post login_path, params: { session: { email: user.email, password: "password123" } }
  end
end
