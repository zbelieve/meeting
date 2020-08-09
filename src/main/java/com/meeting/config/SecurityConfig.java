package com.meeting.config;

import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfiguration;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Created by yj on 2020/8/9 13:09
 */
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    protected void configure(HttpSecurity http) throws Exception{
        http.authorizeRequests()
                .antMatchers("/mt/viewindex").hasRole("root")
                .antMatchers("/mt/viewindex2").hasRole("person")
                .antMatchers("/").hasRole("normal")
                ;
        //没有权限默认到登陆页面
        http.formLogin().loginPage("/tologin");
        http.csrf().disable();
        http.headers().frameOptions().disable();

    }
    protected void configure(AuthenticationManagerBuilder auth) throws Exception{
       auth.inMemoryAuthentication().passwordEncoder(new BCryptPasswordEncoder()).
               withUser("root").password(new BCryptPasswordEncoder().encode("root")).roles("root","person","normal").and().
        withUser("yj").password(new BCryptPasswordEncoder().encode("yj")).roles("person","normal");
    }

}
