package com.railway.tatkal.common.exception;

public class SeatNotAvailableException
        extends RuntimeException {

    public SeatNotAvailableException(String message) {
        super(message);
    }
}