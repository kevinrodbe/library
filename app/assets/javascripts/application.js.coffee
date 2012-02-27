#= require jquery
#= require jquery_ujs
#= require backbone-rails
#= require_self
#= require_tree .


window.slides = {}

window.createSlide = ->
  args = Array.prototype.slice.call(arguments, 0);
  name = args.shift()
  func = args.pop()

  window.slides[name] =
    func: func
    dependencies: args

$ ->

  loadSlide = (name) ->
    challenge = window.slides[name]

    if challenge?
      if challenge.dependencies.length > 0
        challenge.dependencies.forEach (c) ->
          loadSlide c

      challenge.func()
    else
      alert "Could not find challenge " + name

  
  challenge_slot = location.hash.replace('#', '')

  if challenge_slot == ''
    challenge_slot = 'app'

  loadSlide challenge_slot
