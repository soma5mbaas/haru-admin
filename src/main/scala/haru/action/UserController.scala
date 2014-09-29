package haru.action

import scala.slick.driver.MySQLDriver.simple._
import xitrum.Action
import xitrum.annotation.GET
import scala.slick.driver.MySQLDriver.simple._
import scala.slick.jdbc.StaticQuery.interpolation
import scala.slick.jdbc.GetResult
import haru.dao.UserDao
import com.typesafe.config.ConfigFactory
import xitrum.util.SeriDeseri


@GET("/config")
class config extends Action {
   def execute() {
     
   }
}

case class Person(name: String, age: String)

@GET("/user/add")
class UserInsert extends Action {
  def execute() {
    val email      = param[String]("email")
    val password   = param[String]("password")
    
    UserDao.insertUser(email,password);
    
    val person1 = Person(email, password)
    val json    = SeriDeseri.toJson(person1)
    
    respondJson(json);
    /*
    val user: TableQuery[Users] = TableQuery[Users]

        
    var data = Database.forURL("jdbc:mariadb://stage.haru.io:3306/haru", driver = "org.mariadb.jdbc.Driver", user = "root", password = "siasia")
    data withSession {

      implicit session =>
        // <- write queries here
        //(user.ddl).create
        // val creation = Option(new java.sql.Timestamp(new java.util.Date().getTime()))
        // val last = new java.sql.Timestamp(new java.util.Date().getTime())

        
        // Insert some suppliers
        user += (None, "A","B", "C","D","E", None, None,None, None,None, None)
        //user += ( 49, "Superior Coffee", "1 Party Place", "Mendocino", "CA", "95460")
        //user += (150, "The High Ground", "100 Coffee Lane", "Meadows", "CA", "93966")
        //(Users.id ~ Users.userName ~ Users.email ~ Users.userPassword ~ Users.creationDate ~ Users.lastLoginDate ~ Users.removed).insert(maxId, userName, email, password, creation, last, removed)
   	    //val statement = Users.insertStatement
	 //	println("REACHED 2. \n\nStatement: " + statement)
        
        
        user foreach {
          case (id, email, name, first_name, last_name, gender, birthday, location, timezone, provider, provider_id, picture) =>
            println("  " + name + "\t" + name + "\t" + name + "\t" + birthday + "\t" + timezone)
        }

        val filterQuery: Query[Users, (Int, String, String, String, String, String,String, String, String, String, String,String), Seq] = user.filter(_.id > 49)
        println(filterQuery.list)

        val updateQuery = user.map(_.name)

        
        
        val query = sql"select id, name from Users".as[(Int,String)]
        //query.list
         println(query.list)
         respondJson(query.list);
    }
*/
          // respondJson("{success:1}");
  
  }
}

@GET("/slicktest")
class slicktest extends Action {
  def execute() {
    /*
    val user: TableQuery[User] = TableQuery[User]

        
    var data = Database.forURL("jdbc:mariadb://stage.haru.io:3306/haru", driver = "org.mariadb.jdbc.Driver", user = "root", password = "siasia")
    data withSession {

      implicit session =>
        // <- write queries here
        //(user.ddl).create

        // Insert some suppliers
        //user += (101, "Acme, Inc.", "99 Market Street", "Groundsville", "CA", "95199")
        //user += ( 49, "Superior Coffee", "1 Party Place", "Mendocino", "CA", "95460")
        //user += (150, "The High Ground", "100 Coffee Lane", "Meadows", "CA", "93966")

        user foreach {
          case (id, name, street, city, state, zip) =>
            println("  " + name + "\t" + name + "\t" + name + "\t" + city + "\t" + state)
        }

        val filterQuery: Query[User, (Int, String, String, String, String, String), Seq] = user.filter(_.id > 49)
        println(filterQuery.list)

        val updateQuery = user.map(_.name)

        
        
        val query = sql"select sup_id, sup_name from User".as[(Int,String)]
        //query.list
         println(query.list)
         respondJson(query.list));
    }
*/
     respondJson("{success:1}");
  }
}

