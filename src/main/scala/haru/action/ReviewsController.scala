package haru.action

import haru.dao.ReviewDao
import xitrum.annotation.GET

@GET("/reviews/list")
class GetReviewsList extends Api2 {
  import ChatRoom._

  def execute() {
    val limit = param[Int]("limit");
    val page = param[Int]("page");
    val appid = param[String]("appid")
    val lang = param[String]("lang")
    val market = paramo[String]("market")
    val nation = paramo[String]("nation")

    if (market.isDefined) {
      val reviews = ReviewDao.findReviewListWithMarket(appid, lang, market.get, page, limit)
      respondJson(reviews)
    } else {
      val reviews = ReviewDao.findReviewList(appid, lang, page, limit)
      respondJson(reviews)
    }
  }
}

@GET("/reviews/statistics")
class GetReviewsStatistics extends Api2 {
  import ChatRoom._

  def execute() {
    val appid = param[String]("appid")
    val reviews = ReviewDao.findReviewStatistics(appid)
    val reviewsconunt = ReviewDao.findReviewCount(appid)
    val reviewssummery = ReviewDao.findReviewSummery(appid)
    val reviewsgraph = ReviewDao.findReviewGraph(appid)
    
    val reviewdata = Map("reviewscount" -> reviewsconunt, "reviews" -> reviews, "summery" -> reviewssummery, "graph"->reviewsgraph)
    respondJson(reviewdata)
  }
}
