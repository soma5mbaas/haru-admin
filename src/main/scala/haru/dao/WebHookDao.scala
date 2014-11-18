package haru.dao

import scala.slick.driver.MySQLDriver.simple._
import scala.slick.lifted.ProvenShape
import scala.slick.lifted.Tag
import java.sql.SQLIntegrityConstraintViolationException
import scala.slick.jdbc.{ GetResult, StaticQuery => Q }
import Q.interpolation

object WebHookDao extends DatabasePool {

  val Latestqnrs_table: TableQuery[Latestqnrs] = TableQuery[Latestqnrs]

  case class Latestqnr(id: Option[Int], applicationid:String, messagetype: String, content: String)

  class Latestqnrs(tag: Tag) extends Table[Latestqnr](tag, "Latestqnr") {
    def id = column[Int]("ID", O.PrimaryKey, O.AutoInc) // This is the primary key column
    def applicationid = column[String]("APPLICATIONID")
    def messagetype = column[String]("MESSAGETYPE")
    def content = column[String]("CONTENT")
  
    def * = (id.?, applicationid, messagetype, content) <> (Latestqnr.tupled, Latestqnr.unapply)
  }

  
  def insertLatestQnR(applicationid:String, messagetype : String, content:String): Int = databasePool withSession {
    implicit session =>
      // 동일한 이름의 프로젝트가 있다면 Error처리..
      Latestqnrs_table += Latestqnr(None, applicationid, messagetype, content)
  }

  def getRecentLatestQnR(applicationid: String): List[Map[String, Any]] = databasePool withSession {
    implicit session =>
      val query = sql"""
       select messagetype, content, UNIX_TIMESTAMP(createdat) 
		from Latestqnr 
		where applicationid = $applicationid 
		order by createdat desc limit 0, 5
       """.as[(String, String, Long)]

      val latestqnrlist = query.list
      var latestqnrlists: List[Map[String, Any]] = List();
      latestqnrlist.foreach { p =>
        latestqnrlists ++= List(Map("messagetype" -> p._1, "content" -> p._2, "time" -> p._3))
      }
      return latestqnrlists
  }


}