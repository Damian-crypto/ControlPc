package com.zeusgroup.controlpc;

import com.zeusgroup.controlpc.config.DatabaseConnector;

import static spark.Spark.*;

public class App {
    public static void main( String[] args ) {
        DatabaseConnector connector = DatabaseConnector.getInstance();

        get("/test", (req, res) -> "Hello, World!");
    }
}
