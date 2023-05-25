package com.example.pp_3_1_5_rest.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.pp_3_1_5_rest.entities.Role;
import com.example.pp_3_1_5_rest.service.RoleService;
import com.example.pp_3_1_5_rest.service.UserService;

import java.util.ArrayList;
import java.util.List;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    private final SuccessUserHandler successUserHandler;

    private UserService userService;

    private RoleService roleService;

    public WebSecurityConfig(SuccessUserHandler successUserHandler, UserService userService, RoleService roleService) {
        this.successUserHandler = successUserHandler;
        this.userService = userService;
        this.roleService = roleService;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .authorizeRequests()
                .antMatchers("/admin/**").hasRole("ADMIN")
                .antMatchers("/user/**").hasAnyRole("USER", "ADMIN")
                .anyRequest().authenticated()
                .and()
                .formLogin().loginPage("/login").successHandler(successUserHandler)
                .permitAll()
                .and()
                .logout()
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login")
                .permitAll();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
        daoAuthenticationProvider.setUserDetailsService(userService);
        createRolesAndDefaultAdmin();
        return daoAuthenticationProvider;
    }

    // создание стандартных ролей и админа
    private void createRolesAndDefaultAdmin() {
        if (roleService.findByName("ROLE_ADMIN") == null) {
            Role adminRole = new Role();
            adminRole.setName("ROLE_ADMIN");
            roleService.saveRole(adminRole);
        }
        if (roleService.findByName("ROLE_USER") == null) {
            Role userRole = new Role();
            userRole.setName("ROLE_USER");
            roleService.saveRole(userRole);
        }
        if (userService.findByUsername("admin@mail.ru") == null) {
            com.example.pp_3_1_5_rest.entities.User user = new com.example.pp_3_1_5_rest.entities.User();
            user.setUsername("admin@mail.ru");
            user.setPassword("admin");
            user.setFirstName("default");
            user.setLastName("default");
            user.setAge((byte) 1);
            user.setRoles(new ArrayList<Role>(List.of(new Role[]{roleService.findByName("ROLE_ADMIN")})));
            userService.saveUser(user);
        }
    }
}