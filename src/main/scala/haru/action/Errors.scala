package haru.action

import xitrum.annotation.{Error404, Error500}
import xitrum.Action

@Error404
class NotFoundError extends Action {
  def execute() {
    respondView()
  }
}

@Error500
class ServerError extends Action {
  def execute() {
    respondView()
  }
}
