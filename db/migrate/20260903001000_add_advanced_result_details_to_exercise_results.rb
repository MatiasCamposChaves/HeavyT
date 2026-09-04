# frozen_string_literal: true

class AddAdvancedResultDetailsToExerciseResults < ActiveRecord::Migration[8.1]
  def change
    add_column :exercise_results, :paired_actual_repetitions, :integer, null: false, default: 0
    add_column :exercise_results, :paired_actual_weight_lb, :decimal, precision: 7, scale: 2
    add_column :exercise_results, :drop_set_results, :jsonb, null: false, default: []
  end
end
