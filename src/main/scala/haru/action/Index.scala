package haru.action

import xitrum.annotation.GET
import xitrum.Action

@GET("")
class Home extends Action {
  def execute() {
    respondView()
  }
}

@GET("/HomeMin")
class HomeMin extends Action {
  def execute() {
    respondView()
  }
}

@GET("/ping")
class ping extends Action {
  def execute() {
    respondText("hello world");
  }
}
