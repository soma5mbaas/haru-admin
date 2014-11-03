package haru.dao

import scala.slick.driver.MySQLDriver.simple._
import scala.slick.lifted.ProvenShape
import scala.slick.lifted.Tag
import java.sql.SQLIntegrityConstraintViolationException
import scala.slick.jdbc.{ GetResult, StaticQuery => Q }
import Q.interpolation

object ReviewDao extends DatabasePool {

  def findReviewList(appid: String, market:String): List[Map[String, Any]] = databasePool withSession {
    implicit session =>
      /// TODO 만약없다면 exception??
      val query = sql"""
      select applicationid, commentid, market, imagesource, name, date, rating, title, body 
      from Reviews 
      where applicationid=$appid  and  market = $market order by date desc
       """.as[(String, String, String, String, String, Long, Int, String, String)]

      val reviewlist = query.list
      var reviews: List[Map[String, Any]] = List();
      reviewlist.foreach { p =>
        reviews ++= List(Map("applicationid" -> p._1, "commentid" -> p._2, "market" -> p._3, "imagesource" -> p._4, "name" -> p._5, "date" -> p._6, "rating" -> p._7, "title" -> p._8, "body" -> p._9))
      }
      return reviews
  }
}