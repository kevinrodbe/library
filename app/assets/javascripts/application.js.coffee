#= require jquery
#= require jquery-ui
#= require underscore
#= require backbone
#= require_self
#= require_tree .


window.app = {}

app.slides = {}
app.challenges = {}

app.collection = app.slides

app.loader = (name) ->
  challenge = app.collection[name]

  if challenge?
    if challenge.dependencies?.length > 0
      challenge.dependencies.forEach (c) ->
        app.loader c

    challenge.func.apply window
  else
    alert "Could not find " + name

window.createSlide = ->
  args = Array.prototype.slice.call(arguments, 0);
  name = args.shift()
  func = args.pop()

  app.slides[name] =
    func: func
    dependencies: args

app.createChallenge = ->
  args = Array.prototype.slice.call(arguments, 0);
  name = args.shift()
  func = args.pop()

  app.challenges[name] = func: func

$ ->
  challenge_slot = location.hash.replace('#', '')

  if challenge_slot == ''
    challenge_slot = 'app'

  app.loader challenge_slot
