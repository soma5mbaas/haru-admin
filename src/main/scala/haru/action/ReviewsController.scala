package haru.action

import haru.dao.ReviewDao
import xitrum.annotation.GET

@GET("/reviews/list")
class GetReviewsList extends Api2 {
  import ChatRoom._
 
  def execute() {
    val appid = param[String]("appid")
    val market = param[String]("market")
  
    val reviews = ReviewDao.findReviewList(appid, market)
    respondJson(reviews)
  }
}

