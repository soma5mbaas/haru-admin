package haru.dao

import scala.slick.driver.MySQLDriver.simple._
import scala.slick.lifted.ProvenShape
import scala.slick.lifted.Tag
import java.sql.SQLIntegrityConstraintViolationException
import scala.slick.jdbc.{ GetResult, StaticQuery => Q }
import Q.interpolation

object ProjectDao extends DatabasePool {

  val project_table: TableQuery[Projects] = TableQuery[Projects]

  case class Project(id: Option[Int], title: String, company: Option[String], applicationkey: String, clientkey: String, netkey: String, javascriptkey: String, restkey: String, masterkey: String)

  class Projects(tag: Tag) extends Table[Project](tag, "Projects") {
    def id = column[Int]("ID", O.PrimaryKey, O.AutoInc) // This is the primary key column
    def title = column[String]("TITLE")
    def company = column[String]("COMPANY")
    def applicationkey = column[String]("APPLICATIONKEY")
    def clientkey = column[String]("CLIENTKEY")
    def netkey = column[String]("NETKEY")
    def javascriptkey = column[String]("JAVASCRIPTKEY")
    def restkey = column[String]("RESTKEY")
    def masterkey = column[String]("MASTERKEY")

    def * = (id.?, title, company.?, applicationkey, clientkey, netkey, javascriptkey, restkey, masterkey) <> (Project.tupled, Project.unapply)
  }

  def insertProject(title: String, company: Option[String], id: Int): Int = databasePool withSession {
    implicit session =>
      // 동일한 이름의 프로젝트가 있다면 Error처리..
      val query = sql"""
       select count(*) cnt from Viewers v, Projects p where p.id = v.projectid and v.userid = $id and p.title = $title
       """.as[(Int)]
      val exist = query.first;
      // error

      if (exist == 0) {
        def applicationkey = java.util.UUID.randomUUID.toString
        def clientkey = java.util.UUID.randomUUID.toString
        def netkey = java.util.UUID.randomUUID.toString
        def javascriptkey = java.util.UUID.randomUUID.toString
        def restkey = java.util.UUID.randomUUID.toString
        def masterkey = java.util.UUID.randomUUID.toString

        return (project_table returning project_table.map(_.id)) += Project(None, title, company, applicationkey, clientkey, netkey, javascriptkey, restkey, masterkey);
      } else {
        return -1;
      }
  }

  def findProjectForToken(token: String): List[Map[String, Any]] = databasePool withSession {
    implicit session =>
      val query = sql"""
       select p.title, p.company,  v.permission, p.applicationkey, p.clientkey, p.netkey, p.javascriptkey, p.restkey, p.masterkey
       	from Viewers v, Projects p, Users u
       	where u.id = v.userid and p.id = v.projectid and u.provider_id = $token 
       """.as[(String, String, Int, String, String, String, String, String, String)]

      val projectlist = query.list
      var projects: List[Map[String, Any]] = List();
      projectlist.foreach { p =>
        projects ++= List(Map("title" -> p._1, "company" -> p._2, "permission" -> p._3, "applicationkey" -> p._4, "clientkey" -> p._5, "netkey" -> p._6, "restkey" -> p._7, "masterkey" -> p._8))
      }
      return projects
  }
  def findProjectForUser(email: String, provider: String): List[Map[String, Any]] = databasePool withSession {
    implicit session =>
      val query = sql"""
       select p.title, p.company, v.permission, p.applicationkey, p.clientkey, p.netkey, p.javascriptkey, p.restkey, p.masterkey
       	from Viewers v, Projects p, Users u
       	where u.id = v.userid and p.id = v.projectid and u.email = $email and u.provider = $provider 
       """.as[(String, String, Int, String, String, String, String, String, String)]

      val projectlist = query.list

      var projects: List[Map[String, Any]] = List();
      projectlist.foreach { p =>
        projects ++= List(Map("title" -> p._1, "company" -> p._2, "permission" -> p._3, "applicationkey" -> p._4, "clientkey" -> p._5, "netkey" -> p._6, "restkey" -> p._7, "masterkey" -> p._8))
      }
      println(projects)
      return projects
  }

  def selectUserProject(email: String, provider: String): List[Map[String, Any]] = databasePool withSession {
    implicit session =>
      val query = sql"""
       select p.title, p.company, v.permission, p.applicationkey, p.clientkey, p.netkey, p.javascriptkey, p.restkey, p.masterkey 
       from  Viewers v, Users u, Projects p 
       where v.userid = u.id and v.projectid = p.id and email = $email and provider = $provider
       """.as[(String, String, Int, String, String, String, String, String, String)]

      val projectlist = query.list

      var projects: List[Map[String, Any]] = List();
      projectlist.foreach { p =>
        projects ++= List(Map("title" -> p._1, "company" -> p._2, "permission" -> p._3, "applicationkey" -> p._4, "clientkey" -> p._5, "netkey" -> p._6, "restkey" -> p._7, "masterkey" -> p._8))
      }
      return projects
  }
  
  def selectUserProjectForId(userid: Int):List[Map[String, Any]] = databasePool withSession {
    implicit session =>
      val query = sql"""
       select p.title, p.company, v.permission, p.applicationkey, p.clientkey, p.netkey, p.javascriptkey, p.restkey, p.masterkey
       from  Viewers v, Users u, Projects p 
       where v.userid = u.id and v.projectid = p.id and u.id = $userid
       """.as[(String, String, Int, String, String, String, String, String, String)]
       val projectlist = query.list

      var projects: List[Map[String, Any]] = List();
      projectlist.foreach { p =>
        projects ++= List(Map("title" -> p._1, "company" -> p._2, "permission" -> p._3, "applicationkey" -> p._4, "clientkey" -> p._5, "netkey" -> p._6, "restkey" -> p._7, "masterkey" -> p._8))
      }
      
      return projects
  }

}