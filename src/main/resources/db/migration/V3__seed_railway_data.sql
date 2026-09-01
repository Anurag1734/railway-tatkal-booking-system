INSERT INTO stations
    (station_code, station_name, city, state, zone)
VALUES
    ('CSMT', 'Chhatrapati Shivaji Maharaj Terminus', 'Mumbai', 'Maharashtra', 'CR'),
    ('ST', 'Surat', 'Surat', 'Gujarat', 'WR'),
    ('BRC', 'Vadodara Junction', 'Vadodara', 'Gujarat', 'WR'),
    ('ADI', 'Ahmedabad Junction', 'Ahmedabad', 'Gujarat', 'WR'),
    ('NDLS', 'New Delhi', 'Delhi', 'Delhi', 'NR');

INSERT INTO trains
    (train_number, train_name, train_type,
     source_station_id, destination_station_id, active)
VALUES
    (
        '12951',
        'Railway Tatkal Express',
        'EXPRESS',
        (SELECT station_id
         FROM stations
         WHERE station_code = 'CSMT'),
        (SELECT station_id
         FROM stations
         WHERE station_code = 'NDLS'),
        TRUE
    );

INSERT INTO train_stops
    (train_id, station_id, stop_order,
     arrival_time, departure_time, distance_from_source)
VALUES
    (
        (SELECT train_id FROM trains
         WHERE train_number = '12951'),
        (SELECT station_id FROM stations
         WHERE station_code = 'CSMT'),
        1,
        NULL,
        '16:00:00',
        0
    ),
    (
        (SELECT train_id FROM trains
         WHERE train_number = '12951'),
        (SELECT station_id FROM stations
         WHERE station_code = 'ST'),
        2,
        '19:30:00',
        '19:35:00',
        263
    ),
    (
        (SELECT train_id FROM trains
         WHERE train_number = '12951'),
        (SELECT station_id FROM stations
         WHERE station_code = 'BRC'),
        3,
        '21:00:00',
        '21:05:00',
        392
    ),
    (
        (SELECT train_id FROM trains
         WHERE train_number = '12951'),
        (SELECT station_id FROM stations
         WHERE station_code = 'ADI'),
        4,
        '22:30:00',
        '22:35:00',
        492
    ),
    (
        (SELECT train_id FROM trains
         WHERE train_number = '12951'),
        (SELECT station_id FROM stations
         WHERE station_code = 'NDLS'),
        5,
        '06:30:00',
        NULL,
        1384
    );

INSERT INTO coaches
    (train_id, coach_code, coach_type, capacity)
VALUES
    (
        (SELECT train_id FROM trains
         WHERE train_number = '12951'),
        'A1',
        'AC_2_TIER',
        4
    ),
    (
        (SELECT train_id FROM trains
         WHERE train_number = '12951'),
        'B1',
        'AC_3_TIER',
        6
    );

INSERT INTO seats
    (coach_id, seat_number, berth_type, class_type)
VALUES
    (
        (SELECT coach_id FROM coaches
         WHERE train_id = (
             SELECT train_id FROM trains
             WHERE train_number = '12951'
         )
         AND coach_code = 'A1'),
        '1',
        'LOWER',
        'AC_2_TIER'
    ),
    (
        (SELECT coach_id FROM coaches
         WHERE train_id = (
             SELECT train_id FROM trains
             WHERE train_number = '12951'
         )
         AND coach_code = 'A1'),
        '2',
        'UPPER',
        'AC_2_TIER'
    ),
    (
        (SELECT coach_id FROM coaches
         WHERE train_id = (
             SELECT train_id FROM trains
             WHERE train_number = '12951'
         )
         AND coach_code = 'A1'),
        '3',
        'LOWER',
        'AC_2_TIER'
    ),
    (
        (SELECT coach_id FROM coaches
         WHERE train_id = (
             SELECT train_id FROM trains
             WHERE train_number = '12951'
         )
         AND coach_code = 'A1'),
        '4',
        'UPPER',
        'AC_2_TIER'
    ),
    (
        (SELECT coach_id FROM coaches
         WHERE train_id = (
             SELECT train_id FROM trains
             WHERE train_number = '12951'
         )
         AND coach_code = 'B1'),
        '1',
        'LOWER',
        'AC_3_TIER'
    ),
    (
        (SELECT coach_id FROM coaches
         WHERE train_id = (
             SELECT train_id FROM trains
             WHERE train_number = '12951'
         )
         AND coach_code = 'B1'),
        '2',
        'MIDDLE',
        'AC_3_TIER'
    ),
    (
        (SELECT coach_id FROM coaches
         WHERE train_id = (
             SELECT train_id FROM trains
             WHERE train_number = '12951'
         )
         AND coach_code = 'B1'),
        '3',
        'UPPER',
        'AC_3_TIER'
    ),
    (
        (SELECT coach_id FROM coaches
         WHERE train_id = (
             SELECT train_id FROM trains
             WHERE train_number = '12951'
         )
         AND coach_code = 'B1'),
        '4',
        'LOWER',
        'AC_3_TIER'
    ),
    (
        (SELECT coach_id FROM coaches
         WHERE train_id = (
             SELECT train_id FROM trains
             WHERE train_number = '12951'
         )
         AND coach_code = 'B1'),
        '5',
        'MIDDLE',
        'AC_3_TIER'
    ),
    (
        (SELECT coach_id FROM coaches
         WHERE train_id = (
             SELECT train_id FROM trains
             WHERE train_number = '12951'
         )
         AND coach_code = 'B1'),
        '6',
        'UPPER',
        'AC_3_TIER'
    );

INSERT INTO train_runs
    (train_id, run_date)
VALUES
    (
        (SELECT train_id FROM trains
         WHERE train_number = '12951'),
        '2026-09-15'
    ),
    (
        (SELECT train_id FROM trains
         WHERE train_number = '12951'),
        '2026-09-16'
    ),
    (
        (SELECT train_id FROM trains
         WHERE train_number = '12951'),
        '2026-09-17'
    );