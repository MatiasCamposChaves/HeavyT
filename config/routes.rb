Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  root "auth#landing"
  get "login", to: "auth#login", as: :login
  post "login", to: "sessions#create"
  delete "logout", to: "sessions#destroy", as: :logout
  get "register", to: "auth#register", as: :register
  post "register", to: "registrations#create"
  get "dashboard", to: "dashboard#index", as: :dashboard

  namespace :client do
    get "dashboard", to: "dashboard#index"
    post "trainer-link", to: "trainer_links#create", as: :trainer_link
  end

  namespace :trainer do
    get "dashboard", to: "dashboard#index"
    post "invite", to: "invites#create", as: :invite
  end

  namespace :admin do
    get "dashboard", to: "dashboard#index"
  end

  get "inertia-example", to: "inertia_example#index"
end
