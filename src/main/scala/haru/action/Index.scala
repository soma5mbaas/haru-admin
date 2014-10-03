package haru.action

import xitrum.annotation.GET
import xitrum.Action

@GET("")
class Home extends Action {
  def execute() {
    respondView()
  }
}

@GET("/Home")
class Home2 extends Action {
  def execute() {
    respondView()
  }
}
