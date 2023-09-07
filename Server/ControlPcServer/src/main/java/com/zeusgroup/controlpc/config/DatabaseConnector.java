package com.zeusgroup.controlpc.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseConnector {

    private static DatabaseConnector db = null;

    private Connection conn = null;

    private DatabaseConnector() {
        connect();
    }

    private void connect() {
        try {
            String url = "jdbc:sqlite:database.sqlite";
            conn = DriverManager.getConnection(url);

            System.out.println("Connection to SQLite has been established.");

        } catch (SQLException e) {
            System.out.println(e.getMessage());
        } finally {
            try {
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException ex) {
                System.out.println(ex.getMessage());
            }
        }
    }

    public static DatabaseConnector getInstance() {
        if (db == null) {
            db = new DatabaseConnector();
        }

        return db;
    }
}
