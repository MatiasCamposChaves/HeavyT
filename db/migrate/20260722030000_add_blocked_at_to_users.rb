# frozen_string_literal: true

class AddBlockedAtToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :blocked_at, :datetime
    add_index :users, :blocked_at
  end
end
