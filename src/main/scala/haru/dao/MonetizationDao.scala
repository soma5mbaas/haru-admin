package haru.dao

import scala.slick.driver.MySQLDriver.simple._
import scala.slick.lifted.ProvenShape
import scala.slick.lifted.Tag
import java.sql.SQLIntegrityConstraintViolationException
import scala.slick.jdbc.{ GetResult, StaticQuery => Q }
import Q.interpolation

object MonetizationDao extends DatabasePool {

  def GetMonetization(appid: String, startday: String, endday: String, nation: String, usercount: Int): List[Map[String, Any]] = databasePool withSession {
    implicit session =>
      /// TODO 만약없다면 exception??
      /*
      select buydate, sum(price), sum(price) / count(userid), count(userid), $usercount
      from Monetization 
      where applicationid = $appid and buydate between $startday and $endday
      group by buydate
      */
      val query = sql"""
      select buydate,  sum(sumprice) totalprice,  avg(avgprice) avgprice, count(userid) usercount, $usercount, sum(cnt) count
	  from (
	  select buydate, userid, sum(price) sumprice, avg(price) avgprice, count(userid) cnt
	      from Monetization 
	      where applicationid = $appid and buydate between $startday and $endday
	      group by buydate, userid
	  ) m group by buydate;
       """.as[(String, Int, Double, Int, Int, Int)]

      val list = query.list
      var monetizations: List[Map[String, Any]] = List();
      list.foreach { p =>
        monetizations ++= List(Map("buydate" -> p._1, "totalprice" -> p._2, "avgprice" -> p._3, "countsalesuser" -> p._4, "usercount" -> p._5, "itemcount" -> p._6))
      }
      return monetizations
  }

  def GetItemList(appid: String, startday: String, endday: String, nation: String): Map[String, Any] = databasePool withSession {
    implicit session =>
      /// TODO 만약없다면 exception??
      /*
      기간별 판매 리스트 상위 5개 
      sales item top 5 list 
      */
      val query = sql"""
      select buydate, productname, price, count(productname), sum(price) 
      from Monetization 
      where applicationid = $appid and buydate between $startday and $endday
      and productname in (
      select * from (
     	 select productname from Monetization 
      	where applicationid = $appid and buydate between $startday and $endday
      	group by productname 
      	order by sum(price) desc limit 0, 5) as tmp
      ) 
      group by buydate, productname;
       """.as[(String, String, Int, Int, Int)]

      val list = query.list
      var toplist: List[Map[String, Any]] = List();
      list.foreach { p =>
        toplist ++= List(Map("buydate" -> p._1, "productname" -> p._2, "price" -> p._3, "count" -> p._4, "total" -> p._5))
      }

      
      val totalitem = sql"""
      select sum(price) 
      from Monetization 
      where applicationid = $appid and buydate between $startday and $endday
      """.as[(Int)]
      val totals = totalitem.list
      val totalprice = totals(0)
     
      
      /*
      sales item list
      */
      val itemquery = sql"""
      select productname, price, sum(price), sum(price) / $totalprice * 100, count(price)
      from Monetization 
      where applicationid = $appid and buydate between $startday and $endday
      group by productname order by sum(price) desc
       """.as[(String, Int, Int, Double, Int)]

      val itemlist = itemquery.list
      var itemlists: List[Map[String, Any]] = List();
      itemlist.foreach { p =>
        itemlists ++= List(Map("productname" -> p._1, "price" -> p._2, "total" -> p._3, "avg" -> p._4, "count" -> p._5))
      }
      
      
      /*
      sales item list
      */
      val nationquery = sql"""
      select national, sum(price) from Monetization 
      where applicationid = $appid group by national
       """.as[(String, Int)]

      val nationlist = nationquery.list
      var nationlists : List[Map[String, Any]] = List();
      nationlist.foreach { p =>
        nationlists ++= List(Map("label" -> p._1, "data" -> p._2))
      }
      
      val Itemdata = Map("toplist" -> toplist, "itemlist" -> itemlists, "nation" ->nationlists)
      return Itemdata
  }
}
// push_table.filter(p => p.appid === appid).sortBy(_.sendtime.desc).drop(page * limit).take(limit).run