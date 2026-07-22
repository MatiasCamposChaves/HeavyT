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

ActiveRecord::Schema[8.1].define(version: 2026_07_22_000000) do
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
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "full_name", null: false
    t.string "password_digest", null: false
    t.string "phone", null: false
    t.string "role", default: "client", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["role"], name: "index_users_on_role"
  end

  add_foreign_key "client_profiles", "trainer_profiles"
  add_foreign_key "client_profiles", "users"
  add_foreign_key "trainer_invites", "trainer_profiles"
  add_foreign_key "trainer_profiles", "users"
end
