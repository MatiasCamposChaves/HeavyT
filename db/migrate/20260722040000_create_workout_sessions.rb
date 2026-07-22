class CreateWorkoutSessions < ActiveRecord::Migration[8.1]
  def change
    create_table :workout_sessions do |t|
      t.references :routine_assignment, null: false, foreign_key: true
      t.string :status, null: false, default: "in_progress"
      t.datetime :started_at, null: false
      t.datetime :completed_at
      t.text :notes

      t.timestamps
    end

    add_index :workout_sessions, [:routine_assignment_id, :status]
  end
end
