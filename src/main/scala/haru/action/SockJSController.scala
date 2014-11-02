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
import xitrum.SockJsText
import xitrum.annotation.SOCKJS
import akka.actor.{Actor, ActorRef, Props, Terminated}
import glokka.Registry
import xitrum.{Config, Log, SockJsAction, SockJsText, WebSocketAction, WebSocketText, WebSocketBinary, WebSocketPing, WebSocketPong}
import xitrum.annotation.{GET, SOCKJS, WEBSOCKET}
import xitrum.SkipCsrfCheck
import xitrum.ActorAction
import scala.util.parsing.json.JSON._
import scala.util.parsing.json.JSONArray
import scala.util.parsing.json.JSONObject

@GET("/qna/webhook")
class QnAWebHook extends ActorAction with SkipCsrfCheck with LookupOrCreateChatRoom {
  import ChatRoom._
  var test ="" 
  def execute() {
    //val appid = param[Int]("appid")
    //test = "{\"appid\":\"934b90c0-20e5-40f4-94e7-31c05840ec83\", \"qna\":\"question\"}";
    test = JSONArray("message" :: JSONObject (Map ("appid" -> "934b90c0-20e5-40f4-94e7-31c05840ec83", "qna" -> "question")) :: Nil) .toString()
    
	registry ! Registry.Register(ROOM_NAME, Props[ChatRoom])
    context.become(WebHookRegister)
  }

  private def WebHookRegister(): Actor.Receive = {
    case msg: Registry.FoundOrCreated =>
      val chatRoom = msg.ref
      chatRoom !  Msg(test)
      respondJson("{success:true}") 
      //context.become(onJoinChatRoom(chatRoom))
  }
  
  def onJoinChatRoom(chatRoom: ActorRef) = {
    case WebHookJoin =>
      chatRoom ! Msg(test)
      respondJson("{success:true}") 
  }
}


@SOCKJS("sockJsChat")
class SockJsChatActor extends SockJsAction with LookupOrCreateChatRoom {
  def execute() {
    joinChatRoom()
  }

  def onJoinChatRoom(chatRoom: ActorRef) = {
    case SockJsText(msg) =>
      chatRoom ! ChatRoom.Msg(msg)

    case ChatRoom.Msg(body) =>
      log.debug("Socket Send Msg: " + body)
      respondSockJsText(body)
      
    case message:String =>
      log.debug("sockJsChat string Send Msg: " + message)
      respondSockJsText(message)
  }
}



object ChatRoom {
  val MAX_MSGS   = 20
  val ROOM_NAME  = "chatRoom"
  val PROXY_NAME = "chatRoomProxy"

  // Subscribers:
  // * To join a chat room, send Join
  // * When there's a chat message, receive Msg
  case object Join
  case object WebHookJoin
  case class  Msg(body: String)

  // Registry is used for looking up chat room actor by name.
  // For simplicity, this demo uses only one chat room (lobby chat room).
  // If you want many chat rooms, create more chat rooms with different names.
  val registry = Registry.start(Config.actorSystem, PROXY_NAME)
}

/** Subclasses should implement onJoinChatRoom and call joinChatRoom. */
trait LookupOrCreateChatRoom {
  this: Actor =>

  import ChatRoom._

  def onJoinChatRoom(chatRoom: ActorRef): Actor.Receive

  def joinChatRoom() {
    registry ! Registry.Register(ROOM_NAME, Props[ChatRoom])
    context.become(waitForRegisterResult)
  }

  private def waitForRegisterResult(): Actor.Receive = {
    case msg: Registry.FoundOrCreated =>
      val chatRoom = msg.ref
      chatRoom ! Join
      context.become(onJoinChatRoom(chatRoom))
  }
}

class ChatRoom extends Actor with Log {
  import ChatRoom._

  private var subscribers = Seq.empty[ActorRef]
  private var msgs        = Seq.empty[String]

  def receive = {
    case WebHookJoin =>
     sender ! WebHookJoin
    case Join =>
      val subscriber = sender
      subscribers = subscribers :+ sender
      context.watch(subscriber)
      msgs foreach (sender ! Msg(_))
   

    //socket send와 관련됨..  
    case m @ Msg(body) =>
      log.debug("ChatRoom Send Msg: " + body + subscribers.length)
     
      msgs = Seq(body)
      //if (msgs.length > MAX_MSGS) msgs = msgs.drop(1)
      subscribers foreach (_ ! m)

    case message : String =>
      log.debug("ChatRoom receive: " + message)
      subscribers foreach (_ ! message)

    case Terminated(subscriber) =>
      subscribers = subscribers.filterNot(_ == subscriber)
      log.debug("Left chat room: " + subscriber)
  }
}
