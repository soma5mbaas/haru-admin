package haru.util

import java.security.MessageDigest

object CryptoMD5 {
 def md5(password:String) : String = {
    val m = MessageDigest.getInstance("MD5")
     m.update("abcd12345678defglsiefc".getBytes("UTF-8")) 
	 m.update(password.getBytes("UTF-8"))
	 return new String(m.digest())
 }
}