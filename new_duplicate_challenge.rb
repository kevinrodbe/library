require 'rubygems'
require 'fileutils'
require 'pathname'
require 'active_support/core_ext'

## Usage ##

# Requires activesupport (gem install activesupport)
#
# cd into the maps_challenges directory, and then run this script like so:
# $ ruby new_duplicate_challenge.rb ./ProjectToDuplicate ./NewProject

source = ARGV[0]
source_name = source.split("/").last
destination = ARGV[1]
destination_name = destination.split("/").last

puts "Duplicating the #{source_name} challenge to #{destination_name}"

# TODO: make this come from the user
decision = "yes"

if decision.starts_with?("y")

  FileUtils.cp_r source, destination

  FileUtils.mv "#{destination}/#{source_name}", "#{destination}/#{destination_name}"

  FileUtils.mv "#{destination}/#{destination}/#{source_name}Tests", "#{destination}/#{destination}/#{destination_name}Tests"

  FileUtils.mv "#{destination}/#{source_name}.xcodeproj", "#{destination}/#{destination_name}.xcodeproj"

  FileUtils.mv "#{destination}/#{source_name}.xcworkspace", "#{destination}/#{destination_name}.xcworkspace"

  # Remove files that shouldn't be copied
  Dir["#{destination}/**/*.xccheckout"].each {|f| FileUtils.rm(f) }
  Dir["#{destination}/**/*.xcuserstate"].each {|f| FileUtils.rm(f) } 

  Dir["#{destination}/**/*.xcscheme"].each {|f| FileUtils.mv(f, f.gsub("#{source_name}", "#{destination_name}")) if f.include?(source_name) }

  Dir["#{destination}/**/*#{source_name}*"].each {|f| FileUtils.mv f, f.gsub("#{source_name}", "#{destination_name}") }

  `cd #{destination_name}; grep -rl '#{source_name}' . | xargs sed -i "" 's/#{source_name}/#{destination_name}/g'`

  `cd #{destination_name}; grep -rl '#{source_name.underscore}' . | xargs sed -i "" 's/#{source_name.underscore}/#{destination_name.underscore}/g'`

  puts "Successfully duplicated challenges, opening new workspace..."

  `open #{destination}/#{destination_name}.xcworkspace`
else
  puts "exiting..."
end