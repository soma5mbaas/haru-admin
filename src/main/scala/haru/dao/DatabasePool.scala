package haru.dao

import scala.slick.driver.MySQLDriver.simple._
import com.mchange.v2.c3p0.ComboPooledDataSource
import com.typesafe.config.ConfigFactory


trait DatabasePool {
  private val config = ConfigFactory.load();
  
  val Url = config.getString("db.default.url");
  val Driver = config.getString("db.default.driver");
  val DBUser = config.getString("db.default.user");
  val DBPassword = config.getString("db.default.password");
      
  
  val databasePool = {
    val ds = new ComboPooledDataSource
    ds.setDriverClass(Driver)
    ds.setJdbcUrl(Url)
    ds.setMinPoolSize(10)
    ds.setAcquireIncrement(5)
    ds.setMaxPoolSize(100)
    ds.setUser(DBUser)
    ds.setPassword(DBPassword)
 
    Database.forDataSource(ds)
  }
}