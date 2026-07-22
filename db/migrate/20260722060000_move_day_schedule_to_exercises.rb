# frozen_string_literal: true

class MoveDayScheduleToExercises < ActiveRecord::Migration[8.1]
  def change
    add_column :exercises, :day_of_week, :integer, default: 1, null: false
    add_index :exercises, [:routine_id, :day_of_week, :position], name: "index_exercises_on_routine_day_and_position"
    add_column :workout_sessions, :day_of_week, :integer
    add_index :workout_sessions, [:routine_assignment_id, :day_of_week, :status], name: "index_workouts_on_assignment_day_and_status"

    remove_index :routine_assignments, column: [:client_profile_id, :day_of_week]
    remove_column :routine_assignments, :day_of_week, :integer
  end
end
