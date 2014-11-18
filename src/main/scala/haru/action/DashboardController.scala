package haru.action

import java.net.URLEncoder

import scala.reflect.runtime.universe

import org.apache.http.client.config.RequestConfig
import org.apache.http.client.methods.HttpGet
import org.apache.http.impl.client.HttpClientBuilder
import org.joda.time.DateTime
import org.joda.time.format.DateTimeFormat

import UserCountProtocol.UserCountJsonFormat
import haru.dao.DashboardDao
import spray.json.pimpString
import xitrum.annotation.GET


@GET("/dashboard/request")
class dashbaordGraph extends Api2 {
  def execute() {
    val appid = param[String]("appid")
      val dashboarddata = DashboardDao.getDashboardData(appid)
      respondJson(dashboarddata)
  }
}

@GET("/dashboard/info")
class getDashboardInfo extends Api2 {
  def execute() {
    val appid = param[String]("appid")
      
    val usercount = getUserCount(appid)
    println(usercount);
    val dashboarddata = DashboardDao.getDashboardInfo(appid, usercount, Today())
     
    //val dashboard = Map("usercount" -> usercount)

    respondJson(dashboarddata)
  }
  def Today(pattern: String = "yyyy-MM-dd") = DateTimeFormat.forPattern(pattern).print(DateTime.now())
  
  def getUserCount(appid:String) : Int =  {
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
    import UserCountProtocol._
    val jsoncontent = content.parseJson
    val contentjson = jsoncontent.convertTo[UserCount]
    return contentjson.count;
  }
}

