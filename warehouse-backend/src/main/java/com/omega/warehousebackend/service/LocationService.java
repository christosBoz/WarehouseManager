package com.omega.warehousebackend.service;

import com.omega.warehousebackend.model.Location;
import com.omega.warehousebackend.repository.LocationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService {

    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository){
        this.locationRepository = locationRepository;
    }

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    public boolean locationExists(Long id) {
        return locationRepository.doesIdExist(id);
    }
}
