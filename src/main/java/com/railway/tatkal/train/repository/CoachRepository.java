package com.railway.tatkal.train.repository;

import com.railway.tatkal.train.entity.Coach;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CoachRepository extends JpaRepository<Coach, Long> {

    List<Coach> findByTrainId(Long trainId);

    Optional<Coach> findByTrainIdAndCoachCode(
            Long trainId,
            String coachCode
    );

    boolean existsByTrainIdAndCoachCode(
            Long trainId,
            String coachCode
    );
}