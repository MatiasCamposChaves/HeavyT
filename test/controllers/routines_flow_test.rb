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
        exercise: { name: "Sentadilla", sets: 4, repetitions: 8, rest_seconds: 90, position: 99 },
      }
    end
    exercise = routine.exercises.last
    assert_equal 1, exercise.position

    patch trainer_routine_exercise_path(routine, exercise), params: { exercise: { repetitions: 10 } }
    assert_equal 10, exercise.reload.repetitions
    assert_difference("Exercise.count", -1) { delete trainer_routine_exercise_path(routine, exercise) }
  end

  test "trainer reorders exercises and positions stay consecutive" do
    routine = @trainer.trainer_profile.routines.create!(name: "Ordenada")
    first = routine.exercises.create!(name: "Primero", sets: 3, repetitions: 10, position: 1)
    second = routine.exercises.create!(name: "Segundo", sets: 3, repetitions: 10, position: 2)
    third = routine.exercises.create!(name: "Tercero", sets: 3, repetitions: 10, position: 3)
    sign_in(@trainer)

    patch move_trainer_routine_exercise_path(routine, third), params: { direction: "up" }

    assert_redirected_to trainer_routine_path(routine)
    assert_equal [first.id, third.id, second.id], routine.exercises.reload.order(:position).pluck(:id)
    assert_equal [1, 2, 3], routine.exercises.order(:position).pluck(:position)

    delete trainer_routine_exercise_path(routine, first)
    assert_equal [1, 2], routine.exercises.reload.order(:position).pluck(:position)
  end

  test "trainer assigns exercises to separate days" do
    routine = @trainer.trainer_profile.routines.create!(name: "Plan semanal")
    sign_in(@trainer)

    post trainer_routine_exercises_path(routine), params: { exercise: { name: "Sentadilla", sets: 3, repetitions: 10, day_of_week: 1 } }
    post trainer_routine_exercises_path(routine), params: { exercise: { name: "Remo", sets: 3, repetitions: 10, day_of_week: 2 } }

    assert_equal ["Sentadilla"], routine.exercises.where(day_of_week: 1).pluck(:name)
    assert_equal ["Remo"], routine.exercises.where(day_of_week: 2).pluck(:name)
    assert_equal [1], routine.exercises.where(day_of_week: 1).pluck(:position)
    assert_equal [1], routine.exercises.where(day_of_week: 2).pluck(:position)
  end

  test "trainer assigns routine and client can view it" do
    routine = @trainer.trainer_profile.routines.create!(name: "Espalda")
    routine.exercises.create!(name: "Remo", sets: 4, repetitions: 12, position: 1)
    sign_in(@trainer)

    post trainer_routine_assignments_path(routine), params: {
      assignment: { client_profile_ids: [@client.client_profile.id], duration_weeks: 4 },
    }
    assert_redirected_to trainer_routine_path(routine)
    assignment = routine.routine_assignments.find_by!(client_profile: @client.client_profile)
    assert_equal Date.current + 4.weeks, assignment.expires_on

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
