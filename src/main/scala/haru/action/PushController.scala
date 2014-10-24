package haru.action

import scala.reflect.runtime.universe

import org.apache.http.client.methods.HttpPost
import org.apache.http.entity.StringEntity
import org.apache.http.impl.client.HttpClientBuilder
import org.joda.time.DateTimeZone

import akka.actor.Actor
import akka.actor.ActorLogging
import akka.actor.ActorSystem
import akka.actor.Props
import akka.actor.actorRef2Scala
import haru.dao.PushDao
import xitrum.Log
import xitrum.annotation.GET
import xitrum.annotation.POST


@POST("push/register")
class PushRegister extends Api2{
  def execute() {
    val appid = param[String]("appid")
    
    val pushtype = param[Int]("pushtype")
    val wherevalue = param[String]("wherevalue")
    
    val messagetype = param[Int]("messagetype")
    val message = param[String]("message")
    val totalcount = param[Int]("totalcount")
      
    val sendtimezone = param[String]("sendtimezone")    
    val sendtime = param[Long]("sendtime")
    val expirationtime = param[Long]("expirationtime")
    val status = param[Int]("status")
      
    PushDao.insertPush(appid, pushtype, Some(wherevalue), message, messagetype, totalcount, DateTimeZone.forID(sendtimezone).getID(),sendtime, expirationtime, status);
    

    sendPushActor(appid, message)
    
    respondJson("{success:1}");
  }

  def sendPushActor(appid : String, message:String){
    val system = ActorSystem("MySystem")
	val pushactor = system.actorOf(Props[PushActor], name = "pusher")
	pushactor ! PushMessage(appid, message)
  }
}

@GET("push/list")
class PushList extends Api2 {
  def execute() {
    val limit = param[Int]("limit");
    val page = param[Int]("page");
    
    respondJson(PushDao.SelectPush(limit, page));
  }
}

case class PushMessage(appid: String, message : String)
class PushActor extends Actor with ActorLogging {
  def receive = {
    case PushMessage(appid, message) ⇒ 
    	Log.info("Actor receive")
    	val url = "http://stage.haru.io:10300/push";
    	val post = new HttpPost(url)
	    post.addHeader("Application-Id", appid)
	    post.addHeader("Content-Type","application/json")
	    val json = "{\"where\":{\"pushType\": \"mqtt\"}, \"notification\":"+message+"}"
	    post.setEntity(new StringEntity(json));
	    
	    // send the post request
	    val client = HttpClientBuilder.create().build();
	    val response = client.execute(post)
  }
}