package com.example.yourApp.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.ServerWebInputException;
import reactor.core.publisher.Mono;

@RestControllerAdvice
public class RestErrorHandler {

    private static final Logger logger = LoggerFactory.getLogger(RestErrorHandler.class);

    @ExceptionHandler(WebClientResponseException.NotFound.class)
    public Mono<ResponseEntity<ApiError>> handleNotFound(
            WebClientResponseException.NotFound ex,
            ServerWebExchange exchange) {

        logger.warn("Downstream resource not found: {}", ex.getMessage());
        ApiError error = new ApiError(
                HttpStatus.NOT_FOUND.value(),
                HttpStatus.NOT_FOUND.getReasonPhrase(),
                "Product not found",
                exchange.getRequest().getPath().value()
        );
        return Mono.just(ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(error));
    }

    @ExceptionHandler(WebClientResponseException.BadRequest.class)
    public Mono<ResponseEntity<ApiError>> handleBadRequest(
            WebClientResponseException.BadRequest ex,
            ServerWebExchange exchange) {

        logger.warn("Bad request to downstream: {}", ex.getMessage());
        ApiError error = new ApiError(
                HttpStatus.BAD_REQUEST.value(),
                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                ex.getResponseBodyAsString(),
                exchange.getRequest().getPath().value()
        );
        return Mono.just(ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(error));
    }

    @ExceptionHandler(WebClientResponseException.ServiceUnavailable.class)
    public Mono<ResponseEntity<ApiError>> handleServiceUnavailable(
            WebClientResponseException.ServiceUnavailable ex,
            ServerWebExchange exchange) {

        logger.error("Downstream service unavailable", ex);
        ApiError error = new ApiError(
                HttpStatus.SERVICE_UNAVAILABLE.value(),
                HttpStatus.SERVICE_UNAVAILABLE.getReasonPhrase(),
                "Upstream service is unavailable, please try again later",
                exchange.getRequest().getPath().value()
        );
        return Mono.just(ResponseEntity
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(error));
    }

    @ExceptionHandler({WebClientRequestException.class, ServerWebInputException.class})
    public Mono<ResponseEntity<ApiError>> handleClientErrors(
            Exception ex,
            ServerWebExchange exchange) {

        logger.error("Client-side or network error", ex);
        ApiError error = new ApiError(
                HttpStatus.BAD_GATEWAY.value(),
                HttpStatus.BAD_GATEWAY.getReasonPhrase(),
                "Error communicating with product service",
                exchange.getRequest().getPath().value()
        );
        return Mono.just(ResponseEntity
                .status(HttpStatus.BAD_GATEWAY)
                .body(error));
    }

    @ExceptionHandler(Exception.class)
    public Mono<ResponseEntity<ApiError>> handleAllUncaught(
            Exception ex,
            ServerWebExchange exchange) {

        logger.error("Unhandled exception", ex);
        ApiError error = new ApiError(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                "An unexpected error occurred",
                exchange.getRequest().getPath().value()
        );
        return Mono.just(ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(error));
    }
}
