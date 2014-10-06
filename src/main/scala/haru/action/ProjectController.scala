package haru.action

import xitrum.SkipCsrfCheck
import haru.dao.ProjectDao
import xitrum.ActorAction
import haru.dao.UserDao
import xitrum.annotation.POST
import haru.dao.ViewerDao

@POST("project/add")
class AddProject extends Api2 {
  def execute() {
    val authtoken = param("authtoken")
    val projectname = param("projectname")
    val company = paramo("company")

    val (id, name, email, provider) = UserDao.selectUserToken(authtoken);

    val projectid = ProjectDao.insertProject(projectname, company, id);

    if (projectid == ERROR.NOTFOUNT) {
      val json = ERROR.generatorErrorJson(404, "Already exsists Project name");
      respondJson(json);
      return ;
    }

    val (success, error) = ViewerDao.insertViewer(id, projectid, 0);
    if (success) {
      //val json = "{\"projectname\":" + projectname + "}"
      var json: Map[String, Any] = Map()
      json += ("pname" -> projectname)
      json += ("company" -> company)
      respondJson(json)
    } else {
      val json = ERROR.generatorErrorJson(404, error);
      respondJson(json);
    }
  }
}
