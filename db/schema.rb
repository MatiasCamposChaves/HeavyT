# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_07_22_060000) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "client_profiles", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "linked_at"
    t.bigint "trainer_profile_id"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["trainer_profile_id"], name: "index_client_profiles_on_trainer_profile_id"
    t.index ["user_id"], name: "index_client_profiles_on_user_id", unique: true
  end

  create_table "exercise_results", force: :cascade do |t|
    t.integer "actual_repetitions", default: 0, null: false
    t.decimal "actual_weight_lb", precision: 7, scale: 2
    t.boolean "completed", default: false, null: false
    t.integer "completed_sets", default: 0, null: false
    t.datetime "created_at", null: false
    t.bigint "exercise_id", null: false
    t.text "notes"
    t.datetime "updated_at", null: false
    t.bigint "workout_session_id", null: false
    t.index ["exercise_id"], name: "index_exercise_results_on_exercise_id"
    t.index ["workout_session_id", "exercise_id"], name: "index_exercise_results_on_workout_session_id_and_exercise_id", unique: true
    t.index ["workout_session_id"], name: "index_exercise_results_on_workout_session_id"
  end

  create_table "exercises", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "day_of_week", default: 1, null: false
    t.string "name", null: false
    t.text "notes"
    t.integer "position", default: 1, null: false
    t.integer "repetitions", null: false
    t.integer "rest_seconds"
    t.bigint "routine_id", null: false
    t.integer "sets", null: false
    t.decimal "suggested_weight_lb", precision: 7, scale: 2
    t.datetime "updated_at", null: false
    t.index ["routine_id", "day_of_week", "position"], name: "index_exercises_on_routine_day_and_position"
    t.index ["routine_id", "position"], name: "index_exercises_on_routine_id_and_position"
    t.index ["routine_id"], name: "index_exercises_on_routine_id"
  end

  create_table "routine_assignments", force: :cascade do |t|
    t.datetime "assigned_at", null: false
    t.bigint "client_profile_id", null: false
    t.datetime "created_at", null: false
    t.date "expires_on"
    t.bigint "routine_id", null: false
    t.string "status", default: "active", null: false
    t.datetime "updated_at", null: false
    t.index ["client_profile_id"], name: "index_routine_assignments_on_client_profile_id"
    t.index ["routine_id", "client_profile_id"], name: "index_assignments_on_routine_and_client", unique: true
    t.index ["routine_id"], name: "index_routine_assignments_on_routine_id"
    t.index ["status", "expires_on"], name: "index_routine_assignments_on_status_and_expires_on"
  end

  create_table "routines", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "description"
    t.string "goal"
    t.string "name", null: false
    t.string "status", default: "draft", null: false
    t.bigint "trainer_profile_id", null: false
    t.datetime "updated_at", null: false
    t.index ["trainer_profile_id", "status"], name: "index_routines_on_trainer_profile_id_and_status"
    t.index ["trainer_profile_id"], name: "index_routines_on_trainer_profile_id"
  end

  create_table "trainer_invites", force: :cascade do |t|
    t.string "code", null: false
    t.datetime "created_at", null: false
    t.datetime "expires_at", null: false
    t.datetime "revoked_at"
    t.bigint "trainer_profile_id", null: false
    t.datetime "updated_at", null: false
    t.index ["code"], name: "index_trainer_invites_on_code", unique: true
    t.index ["trainer_profile_id", "expires_at"], name: "index_trainer_invites_on_trainer_profile_id_and_expires_at"
    t.index ["trainer_profile_id"], name: "index_trainer_invites_on_trainer_profile_id"
  end

  create_table "trainer_profiles", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_trainer_profiles_on_user_id", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.datetime "blocked_at"
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "full_name", null: false
    t.string "password_digest", null: false
    t.string "phone", null: false
    t.string "role", default: "client", null: false
    t.datetime "updated_at", null: false
    t.index ["blocked_at"], name: "index_users_on_blocked_at"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["role"], name: "index_users_on_role"
  end

  create_table "workout_sessions", force: :cascade do |t|
    t.datetime "completed_at"
    t.datetime "created_at", null: false
    t.integer "day_of_week"
    t.text "notes"
    t.bigint "routine_assignment_id", null: false
    t.datetime "started_at", null: false
    t.string "status", default: "in_progress", null: false
    t.datetime "updated_at", null: false
    t.index ["routine_assignment_id", "day_of_week", "status"], name: "index_workouts_on_assignment_day_and_status"
    t.index ["routine_assignment_id", "status"], name: "index_workout_sessions_on_routine_assignment_id_and_status"
    t.index ["routine_assignment_id"], name: "index_workout_sessions_on_routine_assignment_id"
  end

  add_foreign_key "client_profiles", "trainer_profiles"
  add_foreign_key "client_profiles", "users"
  add_foreign_key "exercise_results", "exercises"
  add_foreign_key "exercise_results", "workout_sessions"
  add_foreign_key "exercises", "routines"
  add_foreign_key "routine_assignments", "client_profiles"
  add_foreign_key "routine_assignments", "routines"
  add_foreign_key "routines", "trainer_profiles"
  add_foreign_key "trainer_invites", "trainer_profiles"
  add_foreign_key "trainer_profiles", "users"
  add_foreign_key "workout_sessions", "routine_assignments"
end
