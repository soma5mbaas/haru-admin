package haru.action

import scala.reflect.runtime.universe
import scala.util.parsing.json.JSON._
import scala.util.parsing.json.JSON
import scala.util.parsing.json.JSONArray
import scala.util.parsing.json.JSONObject
import akka.actor.Actor
import akka.actor.ActorLogging
import akka.actor.ActorRef
import akka.actor.ActorSystem
import akka.actor.Props
import akka.actor.Terminated
import akka.actor.actorRef2Scala
import glokka.Registry
import xitrum.ActorAction
import xitrum.Config
import xitrum.Log
import xitrum.SkipCsrfCheck
import xitrum.SockJsAction
import xitrum.SockJsText
import xitrum.WebSocketAction
import xitrum.annotation.GET
import xitrum.annotation.SOCKJS
import spray.json._
import DefaultJsonProtocol._
import haru.dao.WebHookDao
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat

@GET("webhook/info")
class getWebhookInfo extends Api2 {
  def execute() {
    val appid = param[String]("appid").trim()
    
    println(Today())
    
    val recent = WebHookDao.getRecentLatestQnR(appid)
    respondJson(recent)
  }
  
  def Today(pattern: String = "yyyy-MM-dd") = DateTimeFormat.forPattern(pattern).print(DateTime.now())
}


@GET("/crawler/webhook")
class CrawlerWebHook extends ActorAction with SkipCsrfCheck with LookupOrCreateChatRoom {
  import ChatRoom._

  def execute() {
    val appid = param[String]("appid")
    //val messagetype = param[String]("messagetype")
    val store = param[String]("store")
    val messagetype ="App Review"

      WebHookDao.insertLatestQnR(appid, messagetype , store);

    val message = JSONArray("message" :: JSONObject(Map("appid" -> appid, "type" -> messagetype, "message"->store)) :: Nil).toString()
    registry ! Registry.Register(ROOM_NAME, Props[ChatRoom])
    context.become(WebHookRegister(appid, message))
  }

  private def WebHookRegister(appid: String, message: String): Actor.Receive = {
    case msg: Registry.FoundOrCreated =>
      val chatRoom = msg.ref
      chatRoom ! Msg(appid, message)
      respondJson("{success:true}")
  }

  def onJoinChatRoom(chatRoom: ActorRef) = {
    case ChatRoom.Msg(appid, body) =>
      log.debug("Socket Send Msg: " + body)
  }
}

@GET("/qna/webhook")
class QnAWebHook extends ActorAction with SkipCsrfCheck with LookupOrCreateChatRoom {
  import ChatRoom._

  def execute() {
    val appid = param[String]("appid")
    //val messagetype = param[String]("messagetype")
    val messagetype = "Q&A"
    val body = param[String]("body")

    WebHookDao.insertLatestQnR(appid, messagetype, body);

    val message = JSONArray("message" :: JSONObject(Map("appid" -> appid, "type" -> messagetype, "message"->body)) :: Nil).toString()
    registry ! Registry.Register(ROOM_NAME, Props[ChatRoom])
    context.become(WebHookRegister(appid, message))
  }

  private def WebHookRegister(appid: String, message: String): Actor.Receive = {
    case msg: Registry.FoundOrCreated =>
      val chatRoom = msg.ref
      chatRoom ! Msg(appid, message)
      respondJson("{success:true}")
  }

  def onJoinChatRoom(chatRoom: ActorRef) = {
    case ChatRoom.Msg(appid, body) =>
      log.debug("Socket Send Msg: " + body)
  }
}

object MyJsonProtocol extends DefaultJsonProtocol {
  implicit object RegisterSockJSJSONFormat extends RootJsonFormat[ChatRoom.RegisterSockJS] {
    def write(c: ChatRoom.RegisterSockJS) =
      JsArray(JsString(c.typeval), JsString(c.message))

    def read(value: JsValue) = value match {
      case JsArray(Vector(JsString(typeval), JsString(message))) =>
        new ChatRoom.RegisterSockJS(typeval, message)
      case _ => deserializationError("Color expected")
    }
  }
}

@SOCKJS("sockJsChat")
class SockJsChatActor extends SockJsAction with LookupOrCreateChatRoom {
  def execute() {
    log.debug("sockJsChat")
    joinChatRoom()
  }

  def onJoinChatRoom(chatRoom: ActorRef) = {
    case SockJsText(msg) =>
      log.debug(msg)
      import MyJsonProtocol._

      val jsonAst = msg.parseJson
      val parsemsg = jsonAst.convertTo[ChatRoom.RegisterSockJS]
      chatRoom ! parsemsg

    case ChatRoom.Msg(appid, body) =>
      log.debug("Socket Send Msg: " + body)
      respondSockJsText(body)
  }
}

object ChatRoom {
  val MAX_MSGS = 20
  val ROOM_NAME = "chatRoom"
  val PROXY_NAME = "chatRoomProxy"

  // Subscribers:
  // * To join a chat room, send Join
  // * When there's a chat message, receive Msg
  case object Join
  case object WebHookJoin
  case class RegisterSockJS(typeval: String, message: String)
  case class Msg(appid: String, body: String)

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
  private var msgs = Seq.empty[String]
  private val subscribersMap = scala.collection.mutable.Map[String, ActorRef]()
  //  private var subscribersMap = new scala.collection.mutable.Map[String, ActorRef]()
  def receive = {
    case Join =>
      val subscriber = sender
      subscribers = subscribers :+ sender
      context.watch(subscriber)
    case RegisterSockJS(typeval, appid) =>
      val subscriber = sender
      subscribersMap.put(appid, subscriber)
      log.debug(subscriber + " : " + appid + " : " + subscribersMap.toString)

    //socket send와 관련됨..  
    case m @ Msg(appid, body) =>
      val subscriber = subscribersMap.get(appid);
      if (subscriber.isDefined)
        subscriber.get ! m

      log.debug("ChatRoom Send Msg: " + body + subscribers.length)

    case Terminated(subscriber) =>
      subscribers = subscribers.filterNot(_ == subscriber)
      log.debug("Left chat room: " + subscriber)
  }
}
