package haru.action

import xitrum.SkipCsrfCheck
import haru.dao.ProjectDao
import xitrum.ActorAction
import haru.dao.UserDao
import xitrum.annotation.POST
import haru.dao.ViewerDao
import xitrum.annotation.CacheActionMinute

@POST("project/add")
class AddProject extends Api2 {
  def execute() {
    val authtoken = param("authtoken")
    val projectname = param("projectname")
    val company = paramo("company")
    println(authtoken);
    val (userid, name, email, provider) = UserDao.selectUserToken(authtoken);
    
    if (userid != ERROR.NOTFOUNT) {
      val projectid = ProjectDao.insertProject(projectname, company, userid);

      if (projectid != ERROR.NOTFOUNT) {
        val (success, error) = ViewerDao.insertViewer(userid, projectid, 0);
        if (success) {
          val projects = ProjectDao.findProjectForToken(authtoken);
          var json: Map[String, Any] = Map()
          json += ("token" -> authtoken, "projects" -> projects)
          respondJson(json)
        } else {
          val json = ERROR.generatorErrorJson(404, error);
          respondJson(json);
        }
      } else {
        val json = ERROR.generatorErrorJson(404, "Already exsists Project name");
        respondJson(json);
      }
    } else {
        val json = ERROR.generatorErrorJson(404, "Token Error, Try check auth token");
        respondJson(json);
    }
  }
}

@POST("project/list")
class ListProject extends Api {
  def execute() {
    val token = param("token")

    // vaildate token
    val projects = ProjectDao.findProjectForToken(token);

    var json: Map[String, Any] = Map()
    json += ("token" -> token, "projects" -> projects)
    respondJson(json);
  }
}