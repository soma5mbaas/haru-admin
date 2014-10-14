package haru.action

import xitrum.annotation.CacheActionMinute
import xitrum.annotation.POST
import haru.dao.SchemaDao
import xitrum.annotation.GET
import xitrum.hazelcast.Cache

@POST("data/class")
class GetDataBrowserClasses extends Api2 {
  def execute() {
    val appid = param("appid")
    val classes = SchemaDao.getClasses(appid)
    
    respondJson(classes)    
  }
}

@POST("data/schema")
class GetDataBrowserSchema extends Api2 {
  def execute() {
    val appid = param("appid")
    val classes = param("class")
    
    val schemas = SchemaDao.getSchema(appid, classes)
    
    respondJson(schemas) 
  }
}

@GET("cache/test")
class cachetest extends Api2 {
  def execute() {
	val cache = new Cache();
	cache.put("1", "test");
	
	
	val cachevalue = cache.getAs("1")
	
	
    respondJson(cachevalue)
    
  }
}