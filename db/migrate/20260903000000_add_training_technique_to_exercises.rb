# frozen_string_literal: true

class AddTrainingTechniqueToExercises < ActiveRecord::Migration[8.1]
  def change
    add_column :exercises, :set_type, :string, null: false, default: "standard"
    add_column :exercises, :paired_exercise_name, :string
    add_column :exercises, :drop_sets_count, :integer
    add_column :exercises, :technique_notes, :text
  end
end
