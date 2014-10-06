package haru.action

import scala.reflect.runtime.universe
import haru.dao.ProjectDao
import haru.dao.UserDao
import haru.dao.ViewerDao
import haru.util.BearerTokenGenerator
import xitrum.ActorAction
import xitrum.SkipCsrfCheck
import xitrum.annotation.GET
import xitrum.annotation.POST
import java.security.MessageDigest
import xitrum.Log
import haru.util.Encryption

trait Api extends ActorAction
trait Api2 extends ActorAction with SkipCsrfCheck

object ERROR {
  val NOTFOUNT = -1;
  def generatorErrorJson(errorcode: Int, error: String) : Map[String, Any] = {
    var json: Map[String, Any] = Map()
    json += ("errorcode" -> errorcode)
    json += ("error" -> error)
    return json;
  }
}


@POST("user/login")
class UserLogin extends Api {
  def execute() {
    val pemail = param("email")
    val ppassword = param("password")
    val pprovider = param("provider")
    val crypto_password = Encryption.md5(ppassword);

    val (id, name, email, provider) = UserDao.findUser(pemail, crypto_password, pprovider)
    if (id == ERROR.NOTFOUNT) {
      val json = ERROR.generatorErrorJson(404, "Email or Password not right");
      respondJson(json);
      return ;
    }
    val project = UserDao.selectUserProjectForId(id);
    val data = Map("id" -> id, "name" -> name, "email" -> email, "provider" -> provider, "project" -> project)
    respondJson(data)
  }
}

@POST("user/add")
class AddUser extends Api {
  def execute() {
    val password = param("password")
    val email = param("email")
    val name = param("name")
    val provider = param("provider")

    val crypto_password = Encryption.md5(password);

    var token = "";
    if (provider == "WEB") {
      token = BearerTokenGenerator.generateToken
    } else {
      token = param("token")
    }

    val (success, error) = UserDao.insertUser(name, email, crypto_password, provider, token);

    if (success) {
      //val json = "{\"email\":"+email+",\"name\":"+name+",\"token\":"+token+"}"
      var json: Map[String, Any] = Map()
      json += ("email" -> email)
      json += ("name" -> name)
      json += ("provider" -> provider)
      json += ("token" -> token)
      respondJson(json);
    } else {
      val json = ERROR.generatorErrorJson(404, error);
      respondJson(json);
    }
  }
}



@GET("token")
class Token extends Api2 {
  def execute() {
    val token = BearerTokenGenerator.generateToken
    respondJson(token)
  }
}

@GET("user/vaildate")
class VaildateToken extends Api2 {
  def execute() {
    val token = param("token")
    UserDao.selectUserToken(token)

    // val time = new Timestamp(new java.util.Date().getTime())
    // val current = new java.sql.Timestamp()
    println();

    val day = 60 * 60 * 24 * 1000
    val dayaftercurrent = System.currentTimeMillis() + day;

    println((dayaftercurrent - System.currentTimeMillis()) / 1000);

    println();

    respondJson("");
  }
}
@GET("/slicktest")
class slicktest extends Api {
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
    
    
     //val select = UserDao.selectUser(name, email, "web", password);
     
     

   // val user: TableQuery[Users] = TableQuery[Users]
    
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
          // respondJson("{success:1}");
  
  
*/
    respondJson("{success:1}");
  }
}

