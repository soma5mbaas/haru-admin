package haru.dao

import scala.slick.driver.MySQLDriver.simple._
import scala.slick.lifted.ProvenShape
import scala.slick.lifted.Tag
import java.sql.SQLIntegrityConstraintViolationException
import scala.slick.jdbc.{ GetResult, StaticQuery => Q }
import Q.interpolation
object DashboardDao extends DatabasePool {

  def getDashboardData(appid: String): Map[String, Any] = databasePool withSession {
    implicit session =>
      /// TODO 만약없다면 exception??
      val apirequestquery = sql"""
      select reqdate, count(reqdate) count  from UserRequestlog 
      where applicationid = $appid
      group by reqdate having reqdate >= ADDDATE(DATE(NOW()), -7)
       """.as[(String, Int)]

      val apirequest = apirequestquery.list
      var apirequests: List[Map[String, Any]] = List();
      apirequest.foreach { p =>
        apirequests ++= List(Map("reqdate" -> p._1, "count" -> p._2))
      }
      
      
       val pushrequestquery = sql"""
     select FROM_UNIXTIME(sendtime / 1000, '%Y-%m-%d') date, count(FROM_UNIXTIME(sendtime / 1000, '%m-%d')) count, sum(totalcount) 
       from Pushs where appid = $appid 
     group by date having date >= ADDDATE(DATE(NOW()), -7)
       """.as[(String, Int)]

      val pushrequest = pushrequestquery.list
      var pushrequests : List[Map[String, Any]] = List();
      pushrequest.foreach { p =>
        pushrequests ++= List(Map("reqdate" -> p._1, "count" -> p._2))
      }
      
      val dashboard = Map("api" -> apirequests, "push" -> pushrequests)

      return dashboard
  }
  
}

// push_table.filter(p => p.appid === appid).sortBy(_.sendtime.desc).drop(page * limit).take(limit).run