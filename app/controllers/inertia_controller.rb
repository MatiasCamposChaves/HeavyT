# frozen_string_literal: true

class InertiaController < ApplicationController
  # Share data with all Inertia responses.
  inertia_share auth: lambda {
    {
      user: current_user&.as_json(only: [ :id, :full_name, :email, :phone, :role ])
    }
  }

  inertia_share flash: lambda {
    {
      notice: flash[:notice],
      alert: flash[:alert]
    }
  }
end
