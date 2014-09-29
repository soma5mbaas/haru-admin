package haru.dao

import scala.slick.driver.MySQLDriver.simple._
import scala.slick.direct.AnnotationMapper.column
import scala.slick.lifted.ProvenShape
import scala.slick.lifted.Tag
import java.sql.Timestamp


object UserDao extends DatabasePool{
       
    val user: TableQuery[Users] = TableQuery[Users]
  
	case class User(id: Option[Int], email:String, password:String, name:String, first_name:String, last_name:String, gender:String, birthday:String, location:String, timezone:String, provider:String, provider_id:Option[Int], picture:String)
	
	//class Users(tag: Tag) extends Table[(Int, String,String,String, String, String, String, String,String,String,String,String)](tag, "Users") {
	class Users(tag: Tag) extends Table[User](tag, "Users") {
	  
	  def id = column[Int]("ID", O.PrimaryKey,  O.AutoInc) // This is the primary key column
	  def email = column[String]("EMAIL")
	  def password = column[String]("PASSWORD")
	  def name = column[String]("NAME")
	  def first_name = column[String]("FIRST_NAME", O.Nullable)
	  def last_name = column[String]("LAST_NAME")
	  def gender = column[String]("GENDER")
	  def birthday = column[String]("BIRTHDAY")
	  def location = column[String]("LOCATION")
	  def timezone = column[String]("TIMEZONE")
	  def provider = column[String]("PROVIDER")
	  def provider_id = column[Option[Int]]("PROVIDER_ID")
	  def picture = column[String]("PICTURE")
		
	  // Every table needs a * projection with the same type as the table's type parameter
	  def * = (id.?, email, password, name, first_name, last_name, gender, birthday, location, timezone, provider, provider_id, picture) <> (User.tupled, User.unapply)
	  
	  
	}
    
	
    def insertUser(email:String, name:String) = databasePool withSession {
      implicit session =>

         user += User(None, email,"A",name,"A","A","A","A","A","A","WEB", Some(123) ,"A");
    }
    
	def insertUserWeb(email:String, name:String) = databasePool withSession {
      implicit session =>
      	// user.web.insert(UserWeb(email, "A", "WEB")
         //Users += UserWeb(email, "A", "WEB")
    }
    
}