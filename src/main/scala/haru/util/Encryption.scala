package haru.util

import java.security.MessageDigest

object Encryption {
  // query function 사용이 어렵기 때문에.. Software 암호화로 대체하여 사용 
  def md5(password: String): String = {
    val m = MessageDigest.getInstance("MD5")
    // sub password
    m.update("abcd12345678defglsiefc".getBytes("UTF-8"))
    m.update(password.getBytes("UTF-8"))
    return new String(m.digest())
  }
}