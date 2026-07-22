# frozen_string_literal: true

class RenameSuggestedWeightToPounds < ActiveRecord::Migration[8.1]
  def change
    rename_column :exercises, :suggested_weight, :suggested_weight_lb
  end
end
