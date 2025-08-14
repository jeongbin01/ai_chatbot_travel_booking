package com.example.TravelProject.repository.Room;

import com.example.TravelProject.dto.Room.AccommodationRoomDTO;
import com.example.TravelProject.entity.room.Accommodation;
import org.hibernate.annotations.processing.SQL;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccommodationRoomRepository extends JpaRepository<Accommodation, Integer> {
    @Query(
            value = """
            SELECT
                acc.accommodation_id,
         acc.address,
         acc.check_in_time,
         acc.check_out_time,
         acc.contact,
         acc.description,
         acc.is_active,
         acc.is_domestic,
         acc.latitude,
         acc.longitude,
         acc.name,
         acc.rating_avg,
         acc.registration_date,
         acc.total_reviews,
         acc.type,
         acc.owner_user_id,
         acc_img.image_url,
         rt.room_type_id,
         rt.bed_type,
         rt.description AS room_description,
         rt.max_occupancy,
         rt.name AS room_name,
         pp.base_price
                FROM accommodation acc
            JOIN accommodation_image acc_img
                ON acc.accommodation_id = acc_img.accommodation_id
            JOIN room_type rt
                ON acc.accommodation_id = rt.accommodation_id
            JOIN price_policy pp
                ON rt.room_type_id = pp.room_type_id
            """, nativeQuery = true
    )
    List<Object[]> findAccommodationRoomData();

    @Query(value = """
        SELECT 
            acc.accommodation_id,
         acc.address,
         acc.check_in_time,
         acc.check_out_time,
         acc.contact,
         acc.description,
         acc.is_active,
         acc.is_domestic,
         acc.latitude,
         acc.longitude,
         acc.name,
         acc.rating_avg,
         acc.registration_date,
         acc.total_reviews,
         acc.type,
         acc.owner_user_id,
         acc_img.image_url,
         rt.room_type_id,
         rt.bed_type,
         rt.description AS room_description,
         rt.max_occupancy,
         rt.name AS room_name,
         pp.base_price
        FROM accommodation acc
        JOIN accommodation_image acc_img
            ON acc.accommodation_id = acc_img.accommodation_id
        JOIN room_type rt
            ON acc.accommodation_id = rt.accommodation_id
        JOIN price_policy pp
            ON rt.room_type_id = pp.room_type_id
        WHERE acc.accommodation_id = :accommodationId
        """, nativeQuery = true
    )
    List<Object[]> findByAccommodationId(@Param("accommodationId") Integer accommodationId);

    @Query(value = """
    SELECT 
         acc.accommodation_id,
         acc.address,
         acc.check_in_time,
         acc.check_out_time,
         acc.contact,
         acc.description,
         acc.is_active,
         acc.is_domestic,
         acc.latitude,
         acc.longitude,
         acc.name,
         acc.rating_avg,
         acc.registration_date,
         acc.total_reviews,
         acc.type,
         acc.owner_user_id,
         acc_img.image_url,
         rt.room_type_id,
         rt.bed_type,
         rt.description AS room_description,
         rt.max_occupancy,
         rt.name AS room_name,
         pp.base_price
    FROM accommodation acc
    JOIN accommodation_image acc_img
        ON acc.accommodation_id = acc_img.accommodation_id
    JOIN room_type rt
        ON acc.accommodation_id = rt.accommodation_id
    JOIN price_policy pp
        ON rt.room_type_id = pp.room_type_id
    WHERE acc.is_domestic = :isDomestic
    """, nativeQuery = true)
    List<Object[]> findByDomesticFlag(@Param("isDomestic") String isDomestic);
}
