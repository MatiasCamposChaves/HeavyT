require "test_helper"

class RoutineTest < ActiveSupport::TestCase
  test "exercise requires positive sets and repetitions" do
    trainer = create_user("trainer")
    routine = trainer.trainer_profile.routines.create!(name: "Pecho")
    exercise = routine.exercises.new(name: "Press", sets: 0, repetitions: 0)

    assert_not exercise.valid?
    assert exercise.errors[:sets].present?
    assert exercise.errors[:repetitions].present?
  end

  test "routine can only be assigned to a linked client and becomes active" do
    trainer = create_user("trainer")
    client = create_user("client")
    client.client_profile.update!(trainer_profile: trainer.trainer_profile, linked_at: Time.current)
    routine = trainer.trainer_profile.routines.create!(name: "Pecho")
    routine.exercises.create!(name: "Press", sets: 4, repetitions: 10, position: 1)

    routine.assign_to!([ client.client_profile ])

    assert_equal "active", routine.reload.status
    assert_includes client.client_profile.routines, routine
  end

  test "expired assignment is no longer active and can be extended" do
    trainer = create_user("trainer")
    client = create_user("client")
    client.client_profile.update!(trainer_profile: trainer.trainer_profile, linked_at: Time.current)
    routine = trainer.trainer_profile.routines.create!(name: "Espalda", status: "active")
    assignment = routine.routine_assignments.create!(client_profile: client.client_profile, assigned_at: Time.current,
      expires_on: Date.current)

    assert_not_includes client.client_profile.routine_assignments.active, assignment
    assignment.extend_for_weeks!(1)
    assert_equal Date.current + 1.week, assignment.reload.expires_on
    assert_includes client.client_profile.routine_assignments.active, assignment
  end

  test "routine with workout history can be deleted" do
    trainer = create_user("trainer")
    client = create_user("client")
    client.client_profile.update!(trainer_profile: trainer.trainer_profile, linked_at: Time.current)
    routine = trainer.trainer_profile.routines.create!(name: "Pierna", status: "active")
    exercise = routine.exercises.create!(name: "Sentadilla", sets: 3, repetitions: 10, position: 1)
    assignment = routine.routine_assignments.create!(client_profile: client.client_profile, assigned_at: Time.current)
    workout = assignment.workout_sessions.create!(started_at: Time.current)
    workout.exercise_results.create!(exercise: exercise)

    assert_difference("Routine.count", -1) { routine.destroy! }
    assert_not WorkoutSession.exists?(workout.id)
    assert_not ExerciseResult.exists?(exercise_id: exercise.id)
  end

  private

  def create_user(role)
    User.create!(full_name: "Test #{role}", email: "#{role}-#{SecureRandom.hex(5)}@example.com",
      phone: "+502 5555 5555", password: "password123", role: role)
  end
end
