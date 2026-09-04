require "test_helper"

class WorkoutSessionsTest < ActionDispatch::IntegrationTest
  setup do
    @trainer = create_user("trainer")
    @client = create_user("client")
    @client.client_profile.update!(trainer_profile: @trainer.trainer_profile, linked_at: Time.current)
    @routine = @trainer.trainer_profile.routines.create!(name: "Fuerza", status: "active")
    @exercise = @routine.exercises.create!(name: "Sentadilla", sets: 4, repetitions: 8, position: 1)
    @assignment = @routine.routine_assignments.create!(client_profile: @client.client_profile, assigned_at: Time.current)
  end

  test "client starts a workout and records an exercise" do
    sign_in(@client)

    assert_difference("WorkoutSession.count", 1) do
      post client_routine_workout_sessions_path(@routine), params: { day_of_week: 1 }
    end

    workout = @assignment.workout_sessions.last
    assert_redirected_to client_workout_session_path(workout)
    assert_equal [ @exercise.id ], workout.exercise_results.pluck(:exercise_id)

    result = workout.exercise_results.first
    patch client_workout_session_exercise_result_path(workout, result), params: {
      exercise_result: { completed_sets: 4, actual_repetitions: 8, actual_weight_lb: 185, completed: true }
    }

    assert_redirected_to client_workout_session_path(workout)
    assert_equal 185, result.reload.actual_weight_lb
    assert_predicate result, :completed?
  end

  test "client cannot finish until every exercise is completed" do
    sign_in(@client)
    post client_routine_workout_sessions_path(@routine), params: { day_of_week: 1 }
    workout = @assignment.workout_sessions.last

    patch complete_client_workout_session_path(workout)
    assert_equal "in_progress", workout.reload.status

    workout.exercise_results.update_all(completed: true)
    patch complete_client_workout_session_path(workout)
    assert_equal "completed", workout.reload.status
    assert_not_nil workout.completed_at
  end

  test "trainer can view only their clients workouts" do
    workout = @assignment.workout_sessions.create!(started_at: Time.current)
    workout.exercise_results.create!(exercise: @exercise)
    sign_in(@trainer)

    get trainer_workout_sessions_path
    assert_response :success
    get trainer_workout_session_path(workout)
    assert_response :success

    other_trainer = create_user("trainer")
    delete logout_path
    sign_in(other_trainer)
    get trainer_workout_session_path(workout)
    assert_response :not_found
  end

  test "trainer can delete only their clients workout history" do
    workout = @assignment.workout_sessions.create!(started_at: Time.current)
    workout.exercise_results.create!(exercise: @exercise)
    sign_in(@trainer)

    assert_difference("WorkoutSession.count", -1) do
      delete trainer_workout_session_path(workout)
    end
    assert_redirected_to trainer_workout_sessions_path

    other_trainer = create_user("trainer")
    other_routine = other_trainer.trainer_profile.routines.create!(name: "Privada", status: "active")
    other_client = create_user("client")
    other_client.client_profile.update!(trainer_profile: other_trainer.trainer_profile)
    other_assignment = other_routine.routine_assignments.create!(client_profile: other_client.client_profile, assigned_at: Time.current)
    other_workout = other_assignment.workout_sessions.create!(started_at: Time.current)

    delete trainer_workout_session_path(other_workout)
    assert_response :not_found
    assert WorkoutSession.exists?(other_workout.id)
  end

  test "client and trainer can view calculated progress" do
    workout = @assignment.workout_sessions.create!(started_at: 1.hour.ago, status: "completed", completed_at: Time.current)
    workout.exercise_results.create!(exercise: @exercise, completed_sets: 4, actual_repetitions: 8, actual_weight_lb: 185, completed: true)

    report = ProgressReport.new(@client.client_profile).as_json
    assert_equal 1, report[:summary][:completed_workouts]
    assert_equal 5920.0, report[:summary][:total_volume_lb]
    assert_equal 185.0, report[:summary][:max_weight_lb]
    assert_equal %w[Lunes Martes Miercoles Jueves Viernes Sabado Domingo], report[:weekly_activity].map { |item| item[:label] }
    current_day = report[:weekly_activity].find { |item| item[:date] == Time.zone.today }
    assert_equal 1, current_day[:value]
    assert_equal Time.zone.today.strftime("%d/%m"), current_day[:short_label]

    sign_in(@client)
    get client_progress_path
    assert_response :success

    delete logout_path
    sign_in(@trainer)
    get trainer_progress_index_path
    assert_response :success
    get trainer_progress_path(@client.client_profile)
    assert_response :success
  end

  test "trainer cannot view another trainers client progress" do
    other_trainer = create_user("trainer")
    sign_in(other_trainer)

    get trainer_progress_path(@client.client_profile)

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
