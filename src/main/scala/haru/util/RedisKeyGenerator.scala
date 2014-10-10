package haru.util

object RedisKeyGenerator {
  def getClass(appid: String): String = {
    "ns:classes:" + appid
  }

  def getSchema(appid: String, classes: String): String = {
    "ns:schema:" + classes + ":" + appid
  }
}