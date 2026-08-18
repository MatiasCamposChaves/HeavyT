# frozen_string_literal: true

class RemovePrescriptionDefaultsFromExerciseTemplates < ActiveRecord::Migration[8.1]
  def change
    remove_column :exercise_templates, :default_sets, :integer
    remove_column :exercise_templates, :default_repetitions, :integer
    remove_column :exercise_templates, :default_rest_seconds, :integer
    remove_column :exercise_templates, :default_weight_lb, :decimal, precision: 7, scale: 2
  end
end
