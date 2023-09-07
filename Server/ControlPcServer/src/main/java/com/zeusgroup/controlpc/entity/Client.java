package com.zeusgroup.controlpc.entity;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class Client {
    private Long id;
    private String code;

    public Client(String code) {
        this.code = code;
    }
}
