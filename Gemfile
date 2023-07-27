source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.2.2"

gem "bcrypt", "~> 3.1.7"
gem "bootsnap", require: false
gem "freezolite", require: false
gem "importmap-rails"
gem "litestack"
gem 'pagy', '~> 6.0'
gem "puma", "~> 6.0"
gem "rails", github: "rails/rails", branch: "main"
gem "sprockets-rails"
gem "stimulus-rails"
gem "tailwindcss-rails"
gem "turbo-rails"
# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
# gem "image_processing", "~> 1.2"

group :development, :test do
  gem "debug"
end

group :development do
  eval_gemfile "gemfiles/rubocop.gemfile"
  gem "ruby-lsp-rails"
  gem "web-console"
end

group :test do
  gem "capybara"
  gem "cuprite"
end
