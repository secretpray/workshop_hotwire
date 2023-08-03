source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.2.2"

# Use specific branch of Rails
gem "rails", github: "rails/rails", branch: "main"

gem "anycable-rails-core", require: ["anycable-rails"]
gem "bcrypt", "~> 3.1.7"
gem "bootsnap", require: false
gem "freezolite", require: false
gem "importmap-rails"
gem "litestack"
gem "puma", "~> 6.0"
gem "sprockets-rails"
gem "stimulus-rails"
gem "tailwindcss-rails"
gem "turbo-rails"
gem "turbo_boost-commands"
gem "turbo_power", "~> 0.3.1"

group :development, :test do
  gem "debug"
end

group :test do
  gem "capybara"
  gem "cuprite"
end

group :development do
  gem "web-console"
  gem "ruby-lsp-rails"
  eval_gemfile "gemfiles/rubocop.gemfile"
end
