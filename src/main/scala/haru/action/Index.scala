package haru.action

import xitrum.annotation.GET
import xitrum.Action

@GET("")
class Index extends Action {
  def execute() {
    respondView()
  }
}
