package haru.dao

import java.sql.SQLIntegrityConstraintViolationException
import java.sql.Timestamp

import scala.slick.driver.MySQLDriver.simple._
import scala.slick.jdbc.StaticQuery.interpolation
import scala.slick.lifted.Tag
import com.github.tototoshi.slick.converter._
import org.joda.time._
import com.github.tototoshi.slick._
import scala.slick.driver.JdbcDriver
import scala.slick.jdbc.GetResult
import scala.slick.jdbc.StaticQuery.interpolation
import java.util.{ TimeZone, Locale }



object PushDao extends DatabasePool { 
  
  val push_table: TableQuery[Pushs] = TableQuery[Pushs]

  case class Push(id: Option[Int], appid:String, pushtype: Int, wherevalue:Option[String], message:String, messagetype:Int, totalcount:Int, sendtimzone:String, sendtime:Long, expirationtime:Long, status:Int)
  
  
  class Pushs(tag: Tag) extends Table[Push](tag, "Pushs") {
	

    def id = column[Int]("ID", O.PrimaryKey, O.AutoInc) // This is the primary key column
    def appid = column[String]("APPID")
    def pushtype = column[Int]("PUSHTYPE")
    def wherevalue = column[Option[String]]("WHEREVALUE")
    def message = column[String]("MESSAGE")
    def messagetype = column[Int]("MESSAGETYPE")
    def totalcount = column[Int]("TOTALCOUNT")
    def sendtimezone = column[String]("SENDTIMEZONE")
    def sendtime = column[Long]("SENDTIME")
    def expirationtime = column[Long]("EXPIRATIONTIME")
    def status = column[Int]("status")
    
    def * = (id.?, appid, pushtype, wherevalue, message, messagetype, totalcount, sendtimezone, sendtime, expirationtime, status) <> (Push.tupled, Push.unapply)
  }
  
  
  
  def insertPush(appid:String, pushtyp :Int, wherevaleue:Option[String], message:String, messagetype : Int, totalcount :Int, sendtimezone:String, sendtime:Long, expirationtime:Long, status:Int) : (Int, String) = databasePool withSession {
    implicit session => 
      try {
    	  val id = (push_table returning push_table.map(_.id)) += Push(None, appid, pushtyp, wherevaleue, message, messagetype, totalcount, sendtimezone, sendtime, expirationtime, status);
    	  return (id, "Success")
      } catch {
        case e: SQLIntegrityConstraintViolationException =>
          return (-1, e.getMessage());
      }
  }

  def SelectPush(limit : Int, page:Int, appid:String) :Seq[haru.dao.PushDao.Pushs#TableElementType] = databasePool withSession {
    implicit session => 
      push_table.filter(p => p.appid === appid).sortBy(_.sendtime.desc).drop(page * limit).take(limit).run
  }
  
   def updateStatus(id : Int, status:Int, total : Int) = databasePool withSession {
    implicit session => 
      push_table.filter(_.id === id).map(p => (p.status, p.totalcount)).update((status, total))
  }
}