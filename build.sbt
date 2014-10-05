organization := "tv.cntt"

name         := "haru-admin"

version      := "1.0-SNAPSHOT"

scalaVersion := "2.11.2"
//scalaVersion := "2.10.4"

scalacOptions ++= Seq("-deprecation", "-feature", "-unchecked")

// Xitrum requires Java 7
javacOptions ++= Seq("-source", "1.7", "-target", "1.7")

//------------------------------------------------------------------------------

libraryDependencies += "tv.cntt" %% "xitrum" % "3.18"

// Xitrum uses SLF4J, an implementation of SLF4J is needed
libraryDependencies += "ch.qos.logback" % "logback-classic" % "1.1.2"

// For writing condition in logback.xml
libraryDependencies += "org.codehaus.janino" % "janino" % "2.7.5"

libraryDependencies += "org.webjars" % "bootstrap" % "3.2.0"

// scala redis
libraryDependencies += ("net.debasishg" %% "redisclient" % "2.13")


// Scalate template engine config for Xitrum -----------------------------------

libraryDependencies += "tv.cntt" %% "xitrum-scalate" % "2.2"

// Precompile Scalate templates
seq(scalateSettings:_*)

ScalateKeys.scalateTemplateConfig in Compile := Seq(TemplateConfig(
  file("src") / "main" / "scalate",
  Seq(),
  Seq(Binding("helper", "xitrum.Action", true))
))

// xgettext i18n translation key string extractor is a compiler plugin ---------

autoCompilerPlugins := true

addCompilerPlugin("tv.cntt" %% "xgettext" % "1.1")

scalacOptions += "-P:xgettext:xitrum.I18n"


// Put config directory in classpath for easier development --------------------

// For "sbt console"
unmanagedClasspath in Compile <+= (baseDirectory) map { bd => Attributed.blank(bd / "config") }

// For "sbt run"
unmanagedClasspath in Runtime <+= (baseDirectory) map { bd => Attributed.blank(bd / "config") }

// Copy these to target/xitrum when sbt xitrum-package is run
XitrumPackage.copy("config", "public", "script")


libraryDependencies ++= List(
  "org.slf4j" % "slf4j-nop" % "1.6.4",
  "org.mariadb.jdbc" % "mariadb-java-client" % "1.1.7",
  "com.typesafe.slick" %% "slick" % "2.1.0",
  "c3p0" % "c3p0" % "0.9.1.2",
  "joda-time" % "joda-time" % "2.3",
  "org.joda" % "joda-convert" % "1.5",
  "com.github.tototoshi" %% "slick-joda-mapper" % "1.2.0",
  "org.openid4java" % "openid4java" % "0.9.8",
  "javax.servlet" % "javax.servlet-api" % "3.0.1")
  