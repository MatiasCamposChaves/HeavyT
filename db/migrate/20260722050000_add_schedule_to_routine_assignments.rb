# frozen_string_literal: true

class AddScheduleToRoutineAssignments < ActiveRecord::Migration[8.1]
  def change
    add_column :routine_assignments, :day_of_week, :integer
    add_column :routine_assignments, :expires_on, :date
    add_index :routine_assignments, [:client_profile_id, :day_of_week]
    add_index :routine_assignments, [:status, :expires_on]
  end
end
