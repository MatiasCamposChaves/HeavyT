# frozen_string_literal: true

class CreateTrainerClientLinking < ActiveRecord::Migration[8.1]
  def change
    create_table :trainer_profiles do |t|
      t.references :user, null: false, foreign_key: true, index: { unique: true }
      t.timestamps
    end

    create_table :client_profiles do |t|
      t.references :user, null: false, foreign_key: true, index: { unique: true }
      t.references :trainer_profile, null: true, foreign_key: true
      t.datetime :linked_at
      t.timestamps
    end

    create_table :trainer_invites do |t|
      t.references :trainer_profile, null: false, foreign_key: true
      t.string :code, null: false
      t.datetime :expires_at, null: false
      t.datetime :revoked_at
      t.timestamps
    end

    add_index :trainer_invites, :code, unique: true
    add_index :trainer_invites, [:trainer_profile_id, :expires_at]
  end
end
