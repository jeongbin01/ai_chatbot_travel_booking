package com.example.TravelProject.repository.Administer;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hibernate.Session;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class AdministerMRepository {
    @PersistenceContext
    private EntityManager em;

    public List<String> getAllTables() {
        return em.createNativeQuery("SHOW TABLES").getResultList();
    }

    public List<Object[]> getTableData(String tableName) {
        return em.createNativeQuery("SELECT * FROM " + tableName).getResultList();
    }

    public List<String> getTableColumns(String tableName) {
        List<String> columnNames = new ArrayList<>();

        em.unwrap(Session.class).doWork(connection -> {
            String sql = "SELECT * FROM " + tableName + " LIMIT 1";
            try (PreparedStatement stmt = connection.prepareStatement(sql);
                 ResultSet rs = stmt.executeQuery()) {

                ResultSetMetaData metaData = rs.getMetaData();
                int columnCount = metaData.getColumnCount();

                for (int i = 1; i <= columnCount; i++) {
                    columnNames.add(metaData.getColumnName(i));
                }

            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        });

        return columnNames;
    }
}
