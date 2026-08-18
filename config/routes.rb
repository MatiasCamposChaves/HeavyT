Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  root "auth#login"
  get "login", to: "auth#login", as: :login
  post "login", to: "sessions#create"
  delete "logout", to: "sessions#destroy", as: :logout
  get "register", to: "auth#register", as: :register
  post "register", to: "registrations#create"
  get "password/forgot", to: "password_resets#new", as: :new_password_reset
  post "password/forgot", to: "password_resets#create", as: :password_resets
  get "password/reset/:token", to: "password_resets#edit", as: :edit_password_reset
  patch "password/reset/:token", to: "password_resets#update", as: :password_reset
  get "dashboard", to: "dashboard#index", as: :dashboard

  namespace :client do
    get "dashboard", to: "dashboard#index"
    post "trainer-link", to: "trainer_links#create", as: :trainer_link
    resources :routines, only: [:index, :show] do
      resources :workout_sessions, only: :create
    end
    resources :workout_sessions, path: "workouts", only: [:index, :show] do
      member { patch :complete }
      resources :exercise_results, only: :update
    end
    resource :progress, only: :show, controller: "progress"
    resources :notifications, only: :index
    resource :profile, only: [:show, :update]
  end

  namespace :trainer do
    get "dashboard", to: "dashboard#index"
    post "invite", to: "invites#create", as: :invite
    get "exercise-bank", to: "exercise_templates#index", as: :exercise_bank
    resources :exercise_templates, only: [:create, :update, :destroy]
    resources :routines do
        resources :exercises, only: [:create, :update, :destroy] do
          member { patch :move }
        end
      resource :assignments, only: :create, controller: "routine_assignments"
    end
    resources :workout_sessions, path: "workouts", only: [:index, :show, :destroy]
    resources :progress, only: [:index, :show], controller: "progress"
    resources :notifications, only: :index do
      member do
        patch :extend_assignment
        patch :archive_assignment
      end
    end
    resource :profile, only: [:show, :update]
  end

  namespace :admin do
    get "dashboard", to: "dashboard#index"
    resource :profile, only: [:show, :update]
    resources :users, only: [:index, :show, :edit, :update] do
      member do
        patch :block
        patch :unblock
      end
    end
  end

  get "inertia-example", to: "inertia_example#index"
end
