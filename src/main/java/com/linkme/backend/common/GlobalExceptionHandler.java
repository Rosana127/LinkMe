package com.linkme.backend.common;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public R<?> handleAll(Exception ex) {
        ex.printStackTrace();
        return R.fail("internal error: " + ex.getMessage());
    }
}
