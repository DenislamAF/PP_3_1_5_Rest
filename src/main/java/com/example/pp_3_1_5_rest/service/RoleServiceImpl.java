package com.example.pp_3_1_5_rest.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.pp_3_1_5_rest.entities.Role;
import com.example.pp_3_1_5_rest.repositories.RoleRepository;

@Service
public class RoleServiceImpl implements RoleService{

    private RoleRepository roleRepository;

    @Autowired
    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Transactional
    @Override
    public Role findByName(String name) {
        return roleRepository.findByName(name);
    }

    @Transactional
    @Override
    public void saveRole(Role role) {
        roleRepository.save(role);
    }
}
