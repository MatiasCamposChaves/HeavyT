# frozen_string_literal: true

class CreateExerciseTemplates < ActiveRecord::Migration[8.1]
  def change
    create_table :exercise_templates do |t|
      t.references :trainer_profile, null: false, foreign_key: true
      t.string :name, null: false
      t.string :muscle_group, null: false
      t.string :equipment
      t.integer :default_sets
      t.integer :default_repetitions
      t.integer :default_rest_seconds
      t.decimal :default_weight_lb, precision: 7, scale: 2
      t.text :notes

      t.timestamps
    end

    add_index :exercise_templates, [:trainer_profile_id, :name]
  end
end
