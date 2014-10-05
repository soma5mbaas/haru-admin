package haru.util

import java.security.SecureRandom

object BearerTokenGenerator {
  val TOKEN_LENGTH = 32
  val TOKEN_CHARS = 
     "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-._"
  val secureRandom = new SecureRandom()
    
  def generateToken:String =  
    generateToken(TOKEN_LENGTH)   
  
  def generateToken(tokenLength: Int): String =
    if(tokenLength == 0) "" else TOKEN_CHARS(secureRandom.nextInt(TOKEN_CHARS.length())) + 
     generateToken(tokenLength - 1)
  
}

