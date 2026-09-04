require "test_helper"

class ExerciseTest < ActiveSupport::TestCase
  setup do
    trainer = User.create!(
      full_name: "Trainer",
      email: "trainer-#{SecureRandom.hex(5)}@example.com",
      phone: "+502 5555 5555",
      password: "password123",
      role: "trainer",
    )
    @routine = trainer.trainer_profile.routines.create!(name: "Tecnicas")
  end

  test "standard set is the default" do
    exercise = @routine.exercises.create!(name: "Press", sets: 3, repetitions: 10)

    assert_equal "standard", exercise.set_type
    assert_equal "Serie normal", exercise.set_type_name
  end

  test "paired set requires a paired exercise name" do
    exercise = @routine.exercises.new(name: "Curl", sets: 3, repetitions: 12, set_type: "bi_set")

    assert_not exercise.valid?
    assert_not_empty exercise.errors[:paired_exercise_name]

    exercise.paired_exercise_name = "Extension de triceps"
    assert_predicate exercise, :valid?
  end

  test "drop set requires a drop count" do
    exercise = @routine.exercises.new(name: "Elevaciones", sets: 3, repetitions: 12, set_type: "drop_set")

    assert_not exercise.valid?
    assert_not_empty exercise.errors[:drop_sets_count]

    exercise.drop_sets_count = 2
    assert_predicate exercise, :valid?
  end
end
