package haru.dao

import scala.slick.driver.MySQLDriver.simple._
import scala.slick.lifted.ProvenShape
import scala.slick.lifted.Tag
import java.sql.SQLIntegrityConstraintViolationException

object ViewerDao extends DatabasePool {

  
  val viewer_table: TableQuery[Viewers] = TableQuery[Viewers]

  case class Viewer(id: Option[Int], userid: Int, projectid:Int, permission:Int)
  
  
  class Viewers(tag: Tag) extends Table[Viewer](tag, "Viewers") {
    def id = column[Int]("ID", O.PrimaryKey, O.AutoInc) // This is the primary key column
    def userid = column[Int]("USERID")
    def projectid = column[Int]("PROJECTID")
    def permission = column[Int]("PERMISSION") // This is the primary key column
  
    def * = (id.?, userid, projectid, permission) <> (Viewer.tupled, Viewer.unapply)
    
    
    def project = foreignKey("PROJECT",projectid, ProjectDao.project_table)(_.id)
    def user = foreignKey("USER",userid, UserDao.user_table)(_.id)
  }
  
  def insertViewer(userid: Int, projectid: Int, permission:Int) : (Boolean, String) = databasePool withSession {
    implicit session =>
      try {
    	  viewer_table += Viewer(None, userid, projectid, permission);
    	  return (true, "Success")
      } catch {
        case e: SQLIntegrityConstraintViolationException =>
          return (false, e.getMessage());
      }
  }
  
}