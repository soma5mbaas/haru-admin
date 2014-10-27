package haru.dao

import haru.util.RedisKeyGenerator
import com.redis.RedisClient
import com.redis.RedisClientPool

object SchemaDao {
  val clients = new RedisClientPool("stage.haru.io", 6400)

  def getClasses(appid: String): Option[Set[Option[String]]] = {
    clients.withClient {
      client =>
        {
          val key = RedisKeyGenerator.getClass(appid)

          val classes = client.smembers(key);
          return classes;
        }

    }
  }
  def getSchema(appid: String, classes: String): Option[Map[String,String]] = {
    clients.withClient {
      client =>
        {
          val key = RedisKeyGenerator.getSchema(appid, classes)

          val schema = client.hgetall[String, String](key);
          return schema;
        }

    }
  }

  def addColumn(appid: String, classes: String, columnname:String, columntype:String): Boolean = {
    clients.withClient {
      client =>
        {
          val key = RedisKeyGenerator.getSchema(appid, classes)

          val schema = client.hsetnx(key, columnname, columntype);
          
          return schema;
        }

    }
  }
}