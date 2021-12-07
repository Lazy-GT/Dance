SELECT commu_id as "id", commu_type as "type", 
	sub.category AS "place", genre.category as "genre",  
	commu_title as "title", commu_total as "total", commu_detail as "detail", commu_thumbnailURL AS "thumbnailURL"
	FROM community, genre, (SELECT id, CONCAT(large_category, " ", medium_category, " ", small_category) AS category FROM place) AS sub 
	WHERE community.commu_genre = genre.id and sub.id = community.commu_place;

SELECT * FROM community;
SELECT id, CONCAT(large_category, " ", medium_category, " ", small_category) AS category FROM place;
SELECT * FROM genre;
