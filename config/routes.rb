Rails.application.routes.draw do
  get "sign_in", to: "sessions#new", as: :sign_in
  post "sign_in", to: "sessions#create"
  get "sign_up", to: "registrations#new", as: :sign_up
  post "sign_up", to: "registrations#create"
  delete "sign_out", to: "sessions#destroy", as: :sign_out

  resources :artists, only: [:show]
  resources :albums, only: [:show] do
    patch :play, on: :member
  end

  resource :live_station, only: [:show, :update, :edit, :new, :create] do
    member do
      patch :start # start broadcasting the live station
      patch :stop # stop broadcasting the live station
      post :play_next # play the next track in the live station queue
      put ':id/play_control', to: 'live_stations#play_control', as: :play_control # play/pause the live station track
    end

    resources :tracks, only: [:create, :destroy], module: :live_station do
      post :play, on: :member
    end
  end

  resources :live_stations, only: [] do
    get :play, on: :member
  end

  resources :tracks, only: [] do
    post :play_next, on: :member
    get :play, on: :member
  end

  get "search", to: "search#index", as: :search

  # Workaround to support POST to TurboBoost commands
  post "/", to: "home#index"

  root "home#index"
end
