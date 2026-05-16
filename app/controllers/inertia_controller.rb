# frozen_string_literal: true

class InertiaController < ApplicationController
  # Share data with all Inertia responses.
  # inertia_share user: -> { Current.user&.as_json(only: [:id, :name, :email]) }
end
