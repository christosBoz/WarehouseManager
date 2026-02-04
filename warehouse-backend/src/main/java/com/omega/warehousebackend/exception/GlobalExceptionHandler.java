package com.omega.warehousebackend.exception;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
public class GlobalExceptionHandler {


    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)

    public String handleErrors(IllegalArgumentException ex) {
        return ex.getMessage();
    }
}
