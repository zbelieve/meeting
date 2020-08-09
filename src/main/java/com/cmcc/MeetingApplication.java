package com.cmcc;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;

import org.springframework.context.annotation.ComponentScan;

//@SpringBootApplication
@EnableAutoConfiguration
@ComponentScan("com.cmcc")
@MapperScan("com.cmcc.dao")
public class MeetingApplication {

    public static void main(String[] args) {
        SpringApplication.run(MeetingApplication.class, args);
    }

}
