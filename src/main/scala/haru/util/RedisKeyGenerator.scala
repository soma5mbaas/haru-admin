package haru.util

object RedisKeyGenerator {
  def getClass(appid: String): String = {
    "rs:classes:" + appid
  }

  def getSchema(appid: String, classes: String): String = {
    "rs:schema:" + classes + ":" + appid
  }
}