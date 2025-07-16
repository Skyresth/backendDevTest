package com.example.yourApp.exception;

import lombok.Data;

@Data
public class ApiError {
    private int status;
    private String error;
    private String message;
    private String path;
    private long timestamp = System.currentTimeMillis();

    public ApiError(int status, String error, String message, String path) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }
}
