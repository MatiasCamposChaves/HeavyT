class CreateExerciseResults < ActiveRecord::Migration[8.1]
  def change
    create_table :exercise_results do |t|
      t.references :workout_session, null: false, foreign_key: true
      t.references :exercise, null: false, foreign_key: true
      t.integer :completed_sets, null: false, default: 0
      t.integer :actual_repetitions, null: false, default: 0
      t.decimal :actual_weight_lb, precision: 7, scale: 2
      t.boolean :completed, null: false, default: false
      t.text :notes

      t.timestamps
    end

    add_index :exercise_results, [:workout_session_id, :exercise_id], unique: true
  end
end
