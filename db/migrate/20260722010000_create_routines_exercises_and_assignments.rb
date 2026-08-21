# frozen_string_literal: true

class CreateRoutinesExercisesAndAssignments < ActiveRecord::Migration[8.1]
  def change
    create_table :routines do |t|
      t.references :trainer_profile, null: false, foreign_key: true
      t.string :name, null: false
      t.text :description
      t.string :goal
      t.string :status, null: false, default: "draft"
      t.timestamps
    end

    create_table :exercises do |t|
      t.references :routine, null: false, foreign_key: true
      t.string :name, null: false
      t.integer :sets, null: false
      t.integer :repetitions, null: false
      t.integer :rest_seconds
      t.decimal :suggested_weight, precision: 7, scale: 2
      t.text :notes
      t.integer :position, null: false, default: 1
      t.timestamps
    end

    create_table :routine_assignments do |t|
      t.references :routine, null: false, foreign_key: true
      t.references :client_profile, null: false, foreign_key: true
      t.datetime :assigned_at, null: false
      t.string :status, null: false, default: "active"
      t.timestamps
    end

    add_index :routines, [ :trainer_profile_id, :status ]
    add_index :exercises, [ :routine_id, :position ]
    add_index :routine_assignments, [ :routine_id, :client_profile_id ], unique: true,
      name: "index_assignments_on_routine_and_client"
  end
end
