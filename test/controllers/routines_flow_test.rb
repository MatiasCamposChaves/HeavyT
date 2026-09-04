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
        exercise: { name: "Sentadilla", sets: 4, repetitions: 8, rest_seconds: 90, position: 99 }
      }
    end
    exercise = routine.exercises.last
    assert_equal 1, exercise.position

    patch trainer_routine_exercise_path(routine, exercise), params: { exercise: { repetitions: 10 } }
    assert_equal 10, exercise.reload.repetitions
    assert_difference("Exercise.count", -1) { delete trainer_routine_exercise_path(routine, exercise) }
  end

  test "trainer adds an exercise from the exercise bank" do
    routine = @trainer.trainer_profile.routines.create!(name: "Banco")
    template = @trainer.trainer_profile.exercise_templates.create!(
      name: "Press banca",
      muscle_group: "Pecho",
      notes: "Controlar tecnica",
    )
    sign_in(@trainer)

    assert_difference("Exercise.count", 1) do
      post trainer_routine_exercises_path(routine), params: {
        exercise: {
          exercise_template_id: template.id,
          name: template.name,
          sets: 4,
          repetitions: 8,
          rest_seconds: 90,
          suggested_weight_lb: 135,
          notes: template.notes
        }
      }
    end

    exercise = routine.exercises.last
    assert_equal "Press banca", exercise.name
    assert_equal 4, exercise.sets
    assert_equal 8, exercise.repetitions
    assert_equal 90, exercise.rest_seconds
    assert_equal 135, exercise.suggested_weight_lb
  end

  test "trainer adds advanced set techniques to routine exercises" do
    routine = @trainer.trainer_profile.routines.create!(name: "Tecnicas avanzadas")
    sign_in(@trainer)

    assert_difference("Exercise.count", 1) do
      post trainer_routine_exercises_path(routine), params: {
        exercise: {
          name: "Press banca",
          sets: 4,
          repetitions: 8,
          set_type: "super_set",
          paired_exercise_name: "Aperturas",
          technique_notes: "Sin descanso entre ejercicios"
        }
      }
    end

    exercise = routine.exercises.last
    assert_equal "super_set", exercise.set_type
    assert_equal "Aperturas", exercise.paired_exercise_name
    assert_equal "Superserie", exercise.set_type_name
  end

  test "trainer reorders exercises and positions stay consecutive" do
    routine = @trainer.trainer_profile.routines.create!(name: "Ordenada")
    first = routine.exercises.create!(name: "Primero", sets: 3, repetitions: 10, position: 1)
    second = routine.exercises.create!(name: "Segundo", sets: 3, repetitions: 10, position: 2)
    third = routine.exercises.create!(name: "Tercero", sets: 3, repetitions: 10, position: 3)
    sign_in(@trainer)

    patch move_trainer_routine_exercise_path(routine, third), params: { direction: "up" }

    assert_redirected_to trainer_routine_path(routine)
    assert_equal [ first.id, third.id, second.id ], routine.exercises.reload.order(:position).pluck(:id)
    assert_equal [ 1, 2, 3 ], routine.exercises.order(:position).pluck(:position)

    delete trainer_routine_exercise_path(routine, first)
    assert_equal [ 1, 2 ], routine.exercises.reload.order(:position).pluck(:position)
  end

  test "trainer assigns exercises to separate days" do
    routine = @trainer.trainer_profile.routines.create!(name: "Plan semanal")
    sign_in(@trainer)

    post trainer_routine_exercises_path(routine), params: { exercise: { name: "Sentadilla", sets: 3, repetitions: 10, day_of_week: 1 } }
    post trainer_routine_exercises_path(routine), params: { exercise: { name: "Remo", sets: 3, repetitions: 10, day_of_week: 2 } }

    assert_equal [ "Sentadilla" ], routine.exercises.where(day_of_week: 1).pluck(:name)
    assert_equal [ "Remo" ], routine.exercises.where(day_of_week: 2).pluck(:name)
    assert_equal [ 1 ], routine.exercises.where(day_of_week: 1).pluck(:position)
    assert_equal [ 1 ], routine.exercises.where(day_of_week: 2).pluck(:position)
  end

  test "trainer assigns routine and client can view it" do
    routine = @trainer.trainer_profile.routines.create!(name: "Espalda")
    routine.exercises.create!(
      name: "Remo",
      sets: 4,
      repetitions: 12,
      position: 1,
      set_type: "drop_set",
      drop_sets_count: 2,
      technique_notes: "Bajar peso sin descanso"
    )
    sign_in(@trainer)

    post trainer_routine_assignments_path(routine), params: {
      assignment: { client_profile_ids: [ @client.client_profile.id ], duration_weeks: 4 }
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
    exercise = inertia_props.fetch("routine").fetch("exercises").first
    assert_equal "drop_set", exercise.fetch("set_type")
    assert_equal "Drop set", exercise.fetch("set_type_name")
    assert_equal 2, exercise.fetch("drop_sets_count")
  end

  test "client stores advanced workout result details" do
    routine = @trainer.trainer_profile.routines.create!(name: "Tecnicas")
    paired = routine.exercises.create!(
      name: "Desplantes",
      sets: 3,
      repetitions: 10,
      position: 1,
      day_of_week: 1,
      set_type: "bi_set",
      paired_exercise_name: "Sentadillas"
    )
    drop = routine.exercises.create!(
      name: "Press banca",
      sets: 3,
      repetitions: 8,
      position: 2,
      day_of_week: 1,
      set_type: "drop_set",
      drop_sets_count: 2
    )
    assignment = routine.routine_assignments.create!(client_profile: @client.client_profile, assigned_at: Time.current, expires_on: 2.weeks.from_now)
    workout = assignment.workout_sessions.create!(started_at: Time.current, day_of_week: 1)
    paired_result = workout.exercise_results.create!(exercise: paired)
    drop_result = workout.exercise_results.create!(exercise: drop)
    sign_in(@client)

    patch client_workout_session_exercise_result_path(workout, paired_result), params: {
      exercise_result: {
        completed_sets: 3,
        actual_repetitions: 10,
        actual_weight_lb: 35,
        paired_actual_repetitions: 12,
        paired_actual_weight_lb: 95,
        completed: true
      }
    }
    patch client_workout_session_exercise_result_path(workout, drop_result), params: {
      exercise_result: {
        completed_sets: 3,
        actual_repetitions: 8,
        actual_weight_lb: 135,
        drop_set_results: [
          { repetitions: 8, weight_lb: 115 },
          { repetitions: 8, weight_lb: 95 }
        ],
        completed: true
      }
    }

    assert_equal 12, paired_result.reload.paired_actual_repetitions
    assert_equal 95, paired_result.paired_actual_weight_lb
    assert_equal [
      { "repetitions" => "8", "weight_lb" => "115" },
      { "repetitions" => "8", "weight_lb" => "95" }
    ], drop_result.reload.drop_set_results
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

  def inertia_props
    JSON.parse(response.body.match(%r{<script data-page="app" type="application/json">(.*?)</script>}m)[1]).fetch("props")
  end
end
