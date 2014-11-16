package haru.action

import java.net.URLEncoder

import org.apache.http.client.config.RequestConfig
import org.apache.http.client.methods.HttpGet
import org.apache.http.impl.client.HttpClientBuilder

import haru.dao.MonetizationDao
import spray.json._
import spray.json.DefaultJsonProtocol
import xitrum.annotation.GET
//{"results":[],"count":2}

case class UserCount(results: Option[Any], count: Int)
object UserCountProtocol extends DefaultJsonProtocol {
  implicit object UserCountJsonFormat extends RootJsonFormat[UserCount] {
    def write(c: UserCount) = JsObject(
      "count" -> JsNumber(c.count))
    def read(value: JsValue) = {
      value.asJsObject.getFields("results", "count") match {
        case Seq(_, JsNumber(count)) =>
          new UserCount(null, count.toInt)
        case _ => throw new DeserializationException("Color expected")
      }
    }
  }
}

@GET("/monetization")
class GetMonetization extends Api2 {

  import UserCountProtocol._

  def execute() {
    val appid = param[String]("appid")
    val startday = param[String]("startday")
    val endday = param[String]("endday")
    val nation = param[String]("nation")

    // send the post request
    val url = "http://api.haru.io/1/classes/Users?limit=0&count=1&where={}";
    val safeUrl = "http://api.haru.io/1/classes/Users?limit=0&count=1&where=" + URLEncoder.encode("{}", "UTF-8");
    println(safeUrl);
    val getrequeset = new HttpGet(safeUrl)

    getrequeset.addHeader("Application-Id", appid)
    getrequeset.addHeader("Content-Type", "application/json")

    val requesetConfig = RequestConfig.custom().build()

    val client = HttpClientBuilder.create().build();
    val response = client.execute(getrequeset)
    val entity = response.getEntity()
    System.out.println(response.getStatusLine());

    var content = ""
    if (entity != null) {
      val inputStream = entity.getContent()
      content = scala.io.Source.fromInputStream(inputStream).getLines.mkString
      println(content);
      inputStream.close
    }
    client.close();

    import PushtotalProtocol._
    val jsoncontent = content.parseJson
    val contentjson = jsoncontent.convertTo[UserCount]
    val monetization = MonetizationDao.GetMonetization(appid, startday, endday, nation, contentjson.count)
   
    respondJson(monetization)
    
    
    //val Itemdata = Map("toplist" -> toplist, "itemlist" -> itemlists)

  }
}

@GET("/monetization/item")
class GetMonetizationItemList extends Api2 {

  def execute() {
    val appid = param[String]("appid")
    val startday = param[String]("startday")
    val endday = param[String]("endday")
    val nation = param[String]("nation")
    
    val monetization = MonetizationDao.GetItemList(appid, startday, endday, nation)
   
    respondJson(monetization)
  }
}

