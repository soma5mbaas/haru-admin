package haru.action

import haru.dao.ReviewDao
import xitrum.annotation.GET

@GET("/reviews/list")
class GetReviewsList extends Api2 {
  import ChatRoom._
 
  def execute() {
    val limit = param[Int]("limit");
    val page  = param[Int]("page");
    val appid = param[String]("appid")
    
    val market = param[String]("market")
    val nation = paramo[String]("nation")
  
    val reviews = ReviewDao.findReviewList(appid, market, page, limit)
    respondJson(reviews)
  }
}
