import React from 'react';
import axios from 'axios';

// Base path
export const AxiosClient = (controllerPath, token = null) => {
  const pathURL = `http://localhost:8888/app/${controllerPath}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token.trim()}` })
    }
  };

  return {
    // get: (path = "", onfig = {}) =>
    //   axios.get(`${pathURL}${path}`, headers ),

    // 전체 목록 조회
    getAll: () => axios.get(pathURL, config),

    create: (data) => axios.post(pathURL, data, config),

    update: (id, data) => axios.put(`${pathURL}/${id}`, data, config),

    remove: (id) => axios.delete(`${pathURL}/${id}`, config),

    getById: (id) => axios.get(`${pathURL}/${id}`, config)
  };
};


/*


// 다음과 같이 호출
import { AxiosClient } from './api/AxiosController';
const employeeApi = createApiClient('employee');

//함수 안
employeeApi.getAll()

//html 사이
<ul>
  {employees.map(emp => (
    <li key={emp.id}>{emp.name} - {emp.email}</li>
  ))}
</ul>
//해당 키 값을 가지는 name , email

*/