package haru.dao

import scala.slick.driver.MySQLDriver.simple._
import scala.slick.lifted.ProvenShape
import scala.slick.lifted.Tag
import java.sql.SQLIntegrityConstraintViolationException
import scala.slick.jdbc.{ GetResult, StaticQuery => Q }
import Q.interpolation
import java.sql.Timestamp


case class UserParam(name:String, email:String, password:String, provider:String, provider_id:String, expire:Timestamp)

object UserDao extends DatabasePool {

  val user_table: TableQuery[Users] = TableQuery[Users]

  case class User(id: Option[Int], email: String, password: String, name: String, first_name: String, last_name: String, gender: Option[String], birthday: String, location: Option[String], timezone: Option[String], provider: String, provider_id: Option[String], picture: String)

  class Users(tag: Tag) extends Table[User](tag, "Users") {
    def id = column[Int]("ID", O.PrimaryKey, O.AutoInc) // This is the primary key column
    def email = column[String]("EMAIL")
    def password = column[String]("PASSWORD")
    def name = column[String]("NAME")
    def first_name = column[String]("FIRST_NAME", O.Nullable)
    def last_name = column[String]("LAST_NAME")
    def gender = column[Option[String]]("GENDER")
    def birthday = column[String]("BIRTHDAY")
    def location = column[Option[String]]("LOCATION")
    def timezone = column[Option[String]]("TIMEZONE")
    def provider = column[String]("PROVIDER")
    def provider_id = column[Option[String]]("PROVIDER_ID")
    def picture = column[String]("PICTURE")

    def * = (id.?, email, password, name, first_name, last_name, gender, birthday, location, timezone, provider, provider_id, picture) <> (User.tupled, User.unapply)
  }


  def insertUser(name: String, email: String, password: String, provider:String, token:String) : (Boolean, String) = databasePool withSession {
    implicit session =>
      //user_table += User(None, email, password, name, "", "", "", "", "", "", provider,token, "");
      try {
       if (!user_table.filter(p => p.email === email && p.provider === provider).exists.run) {
    	   user_table.map(c => (c.email, c.password, c.name, c.provider, c.provider_id)) += (email, password, name, provider, Some(token))
    	   return (true, "success");
       } else {
         return (false, "already exists account");
       }     
      } catch {
        case e: SQLIntegrityConstraintViolationException =>
          return (false, e.getMessage());
      }
  }
  def insertSNSUser(name: String, email: String, password: String, provider:String, token:String, timezone : Option[String], locale:Option[String], gender:Option[String]) : (Boolean, String) = databasePool withSession {
    implicit session =>
      //user_table += User(None, email, password, name, "", "", "", "", "", "", provider,token, "");
      try {
       if (!user_table.filter(p => p.email === email && p.provider === provider).exists.run) {
    	   user_table.map(c => (c.email, c.password, c.name, c.provider, c.provider_id, c.timezone, c.location, c.gender)) += (email, password, name, provider, Some(token), timezone, locale, gender)
    	   return (true, "success");
       } else {
           user_table.filter(p => p.email === email && p.provider === provider).map(p=>p.provider_id).update(Some(token))
           return (true, "update token");
       }     
      } catch {
        case e: SQLIntegrityConstraintViolationException =>
          return (false, e.getMessage());
      }
  }


  def insertUserWeb(name: String, email: String, password: String, token: String): Boolean = databasePool withSession {
    implicit session =>
      try {
        if (!user_table.filter(p => p.email === email && p.provider === "WEB").exists.run) {
          user_table.map(c => (c.email, c.password, c.name, c.provider, c.provider_id)) += (email, password, name, "WEB", Some(token))
          return true;
        } else {
          // exists account
          return false;
        }
      } catch {
        case e: SQLIntegrityConstraintViolationException =>
          return false;
      }
  }

  def findUser(email: String, password: String, provider: String) :  (Int, String, String, String, Option[String])= databasePool withSession {
    implicit session =>
       if (user_table.filter(p => p.email === email && p.provider === "WEB" && p.password === password).exists.run) {
    	  return user_table.filter(p => p.email === email && p.provider === provider && p.password === password).map(p => (p.id, p.name, p.email, p.provider, p.provider_id)).first
       } else {
          return (-1, "", "", "", Some(""))
       }
  }

  def selectUserToken(token: String): (Int, String, String, String) = databasePool withSession {
    implicit session =>
	     if (user_table.filter(_.provider_id === token).exists.run) {
	    	 return user_table.filter(_.provider_id === token).map(p => (p.id, p.name, p.email, p.provider)).first
	     } else {
	         return (-1, "", "", "")
	     }
  }
  
  def selectUserProject(email: String, provider:String):List[(String, String, String, Int)]  = databasePool withSession {
    implicit session =>
       val query = sql"""
       select u.email, p.title, p.company, v.permission 
       from  Viewers v, Users u, Projects p 
       where v.userid = u.id and v.projectid = p.id and email = $email and provider = $provider
       """.as[(String, String, String, Int)]
       
       return query.list
  }
   def selectUserProjectForId(userid: Int):List[(String, String, Int, String, String, String, String, String, String)]  = databasePool withSession {
    implicit session =>
       val query = sql"""
       select p.title, p.company, v.permission, p.applicationkey, p.clientkey, p.netkey, p.javascriptkey, p.restkey, p.masterkey
       from  Viewers v, Users u, Projects p 
       where v.userid = u.id and v.projectid = p.id and u.id = $userid
       """.as[(String, String, Int, String, String, String, String, String, String)]
       return query.list
  }
  
  
   def selectUserProjectCount(email: String, provider:String) : Int  = databasePool withSession {
    implicit session =>
       val query = sql"""
       select count(*) cnt
       from  Viewers v, Users u, Projects p 
       where v.userid = u.id and v.projectid = p.id and email = $email and provider = $provider
       """.as[(Int)]
      
       return query.first
  }
}