package com.example.pp_3_1_5_rest.service;

import com.example.pp_3_1_5_rest.entities.Role;

public interface RoleService {
    Role findByName(String name);

    void saveRole(Role role);
}
