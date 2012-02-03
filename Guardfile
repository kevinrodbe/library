# A sample Guardfile
# More info at https://github.com/guard/guard#readme
require 'guard/guard'

module ::Guard
  class Docco < ::Guard::Guard
    def run_all
      true
    end

    def run_on_change(paths)
      file = File.expand_path(paths.first)
      puts "docco #{file}"
      `docco #{file}`
    end
  end
end

guard :docco do
  watch(%r{^levels/.+\.js$})
end
