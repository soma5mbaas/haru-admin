package haru.dao

import scala.slick.driver.MySQLDriver.simple._
import scala.slick.lifted.ProvenShape
import scala.slick.lifted.Tag
import java.sql.SQLIntegrityConstraintViolationException
import scala.slick.jdbc.{ GetResult, StaticQuery => Q }
import Q.interpolation

object ReviewDao extends DatabasePool {

  def findReviewList(appid: String, lang: String, page: Int, count: Int): List[Map[String, Any]] = databasePool withSession {
    implicit session =>
      /// TODO 만약없다면 exception??
      val query = sql"""
      select applicationid, commentid, market, imagesource, name, date, rating, title, body 
      from Reviews 
      where applicationid=$appid and body != '' and location=$lang order by date desc limit $page, $count
       """.as[(String, String, String, String, String, Long, Int, String, String)]

      val reviewlist = query.list
      var reviews: List[Map[String, Any]] = List();
      reviewlist.foreach { p =>
        reviews ++= List(Map("applicationid" -> p._1, "commentid" -> p._2, "market" -> p._3, "imagesource" -> p._4, "name" -> p._5, "date" -> p._6, "rating" -> p._7, "title" -> p._8, "body" -> p._9))
      }
      return reviews
  }
  def findReviewListWithMarket(appid: String, lang: String, market: String, page: Int, count: Int): List[Map[String, Any]] = databasePool withSession {
    implicit session =>
      /// TODO 만약없다면 exception??
      val query = sql"""
      select applicationid, commentid, market, imagesource, name, date, rating, title, body 
      from Reviews 
      where applicationid=$appid and body != '' and location=$lang and market=$market order by date desc limit $page, $count
       """.as[(String, String, String, String, String, Long, Int, String, String)]

      val reviewlist = query.list
      var reviews: List[Map[String, Any]] = List();
      reviewlist.foreach { p =>
        reviews ++= List(Map("applicationid" -> p._1, "commentid" -> p._2, "market" -> p._3, "imagesource" -> p._4, "name" -> p._5, "date" -> p._6, "rating" -> p._7, "title" -> p._8, "body" -> p._9))
      }
      return reviews
  }

  def findReviewStatistics(appid: String): List[Map[String, Any]] = databasePool withSession {
    implicit session =>
      /// TODO 만약없다면 exception??
      val query = sql"""
      select market.location, market.market, market.cnt from (select location, market, count(*) cnt 
      from Reviews where applicationid = $appid group by location, market ) market order by cnt desc
       """.as[(String, String, Int)]

      val reviewlist = query.list
      var reviews: List[Map[String, Any]] = List();
      reviewlist.foreach { p =>
        reviews ++= List(Map("location" -> p._1, "market" -> p._2, "cnt" -> p._3))
      }
      return reviews
  }

  def findReviewCount(appid: String): List[Map[String, Any]] = databasePool withSession {
    implicit session =>
      /// TODO 만약없다면 exception??
      val query = sql"""
      select SUBSTRING(strdate, 6, 6) strdate, count(strdate) from Reviews 
      where applicationid = $appid and  strdate >= ADDDATE(DATE(NOW()), -7) group by strdate order by strdate; 
       """.as[(String, Int)]

      val reviewlist = query.list
      var reviews: List[Map[String, Any]] = List();
      reviewlist.foreach { p =>
        reviews ++= List(Map("date" -> p._1, "count" -> p._2))
      }
      return reviews
  }

  def findReviewSummery(appid: String): Map[String, Any] = databasePool withSession {
    implicit session =>
      val query = sql"""
      select (select count(strdate) from Reviews where applicationid =$appid and strdate = DATE(NOW())) daily, count(rating) count, avg(rating) rating
      from Reviews where applicationid = $appid
       """.as[(Int, Int, Double)]

      val reviewlist = query.list
      if (reviewlist.length > 0) {
        return Map("daily" -> reviewlist(0)._1, "count" -> reviewlist(0)._2, "rating" -> reviewlist(0)._3)
      } else {
        return Map("daily" -> 0, "count" -> 0, "rating" -> 0)
      }
  }

  def findReviewGraph(appid: String): Map[String, Any] = databasePool withSession {
    implicit session =>
      // Rating 갯수 
      val ratingquery = sql"""
      select rating, count(rating) from Reviews where applicationid =  $appid group by rating order by rating desc
       """.as[(Int, Int)]

      val rating = ratingquery.list
      var ratings: List[Map[String, Any]] = List();
      rating.foreach { p =>
        ratings ++= List(Map("label" -> p._1, "data" -> p._2))
      }

      // 긍정댓글 갯수 
      val negativequery = sql"""
      select SUBSTRING(strdate, 6, 6)  strdate, count(*) negative from Reviews where applicationid =  $appid and  strdate >= ADDDATE(DATE(NOW()), -14) and rating <= 2 group by strdate
       """.as[(String, Int)]

      val negative = negativequery.list
      var negatives: List[Map[String, Any]] = List();
      negative.foreach { p =>
        negatives ++= List(Map("date" -> p._1, "count" -> p._2))
      }

      // 부정댓글 갯수 
      val positivequery = sql"""
      select  SUBSTRING(strdate, 6, 6)  strdate, count(*) positive from Reviews where applicationid =  $appid and  strdate >= ADDDATE(DATE(NOW()), -14) and rating >= 4 group by strdate
       """.as[(String, Int)]
      //select strdate, count(*) positive from Reviews where applicationid = '934b90c0-20e5-40f4-94e7-31c05840ec83' and  strdate >= ADDDATE(DATE(NOW()), -14) and rating >= 4 group by strdate;

      val positive = positivequery.list
      var positives: List[Map[String, Any]] = List();
      positive.foreach { p =>
        positives ++= List(Map("date" -> p._1, "count" -> p._2))
      }
    
      val Graphdata = Map("negative" -> negatives, "positive" -> positives, "rating" -> ratings)

      return Graphdata
  }
}
// push_table.filter(p => p.appid === appid).sortBy(_.sendtime.desc).drop(page * limit).take(limit).run