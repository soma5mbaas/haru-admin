package haru.action

import haru.dao.ReviewDao
import xitrum.annotation.GET
import haru.dao.DashboardDao

@GET("/dashboard")
class dashbaordGraph extends Api2 {
  def execute() {
    val appid = param[String]("appid")
      val dashboarddata = DashboardDao.getDashboardData(appid)
      respondJson(dashboarddata)
  }
}

