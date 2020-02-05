DDL to configure firedata database
to provide functions for pg_featureserv to support this demo
============================================================

---------   NOTE: must be in firedata database!!!!!


CREATE SCHEMA postgisftw;

# DROP FUNCTION postgisftw.parcels_dist(integer,numeric);

CREATE OR REPLACE FUNCTION postgisftw.parcels_dist(
	in_gid integer DEFAULT 69293,
	dist numeric DEFAULT 100)
RETURNS TABLE(geom text, parcelid integer, address text, acres text)
AS $$
BEGIN
	RETURN QUERY
SELECT ST_AsText( ST_Transform(a.geom, 4326)) AS wkt, a.gid,
        (a.sitnumber || ' ' ||  a.sitstreet || ', ' ||  a.sitcity || ' ' || a.sitzip) as address,
        a.acres::text
    FROM groot.assessor_parcels a
    JOIN groot.assessor_parcels b ON ST_DWithin(a.geom, b.geom, dist)
    WHERE b.gid = in_gid;
END;
$$
LANGUAGE 'plpgsql'
STABLE
STRICT;

CREATE OR REPLACE FUNCTION postgisftw.set_parcel_firehazard(
	in_gid integer DEFAULT 0,
	in_hazard text DEFAULT 'N')
RETURNS TABLE(parcelid integer, firehazard text)
AS $$
BEGIN
    UPDATE groot.assessor_parcels SET firehazard =
        CASE in_hazard WHEN 'Y' THEN 'Yes' ELSE 'No' END
        WHERE gid  = in_gid;
	RETURN QUERY
SELECT a.gid AS parcelid, a.firehazard::text
    FROM groot.assessor_parcels a
    WHERE a.gid = in_gid;
END;
$$
LANGUAGE 'plpgsql'
VOLATILE
STRICT;




======================================
Testing
======================================

SELECT * FROM postgisftw.parcels_dist(69292, 100);

SELECT ST_X(g.geomout) AS lon, ST_Y(g.geomout) AS lat, g.geomout AS wkb
FROM tiger.geocode('5 MORGAN, SCOTTS VALLEY') AS g;

SELECT postgisftw.set_parcel_firehazard(69262, 'Y');

===================================
Development
===================================

UPDATE groot.assessor_parcels SET firehazard =
CASE 'N' WHEN 'Y' THEN 'Yes' ELSE 'No' END
WHERE gid  = 69262;



http://pgfeatureserv-spatial.openshift-gis-apps.gce-containers.crunchydata.com/functions/set_parcel_firehazard/items?in_gid=69262&in_hazard=Y
