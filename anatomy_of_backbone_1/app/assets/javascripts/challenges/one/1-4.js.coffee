app.createChallenge '1-4', ->

  # View instance
  #
  # Instructions:
  #
  # The perfect place to put our display code now exists!  Now it's
  # time to create our first AppointmentView instance.  When doing so, don't forget to
  # include the appointment model instance we just created.  Assign the instance to a variable.
  #
  # *Implementors note*  For things like instances, I think it's important we keep the variable naming flexible.
  # That means that the user can name the variable anything.  This poses two problems:
  #
  # 1. Making sure they create a variable with the correct value.  I put together
  # some prototype code that makes it possible to check if any variable defined inside
  # of some javascript matches a certain value.  You can find that code here: https://gist.github.com/cca9b0005fb2d428117b.
  #
  # 2. In a subsequent challenge, the user will have to use the variable name
  # they just created and so we can't assume variable names in our description.
  #
  # 3. Might need to use execute code from a previous challenge in the setup to a subsequent one.
  # We've kind of done this before with tryruby but it's error prone.
  #
  # initial code:
  
  # Answer:
  `appointmentView = new AppointmentView({model: appointment});`


