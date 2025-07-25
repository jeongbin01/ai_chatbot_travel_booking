import React from 'react';
import axios from 'axios';

// Base path
export const createApiClient = (controllerPath) => {
  const pathURL = `http://localhost:8888/app/${controllerPath}`;

  return {
    // 전체 목록 조회
    getAll: () => axios.get(pathURL),

    // 새 리소스 생성
    create: (data) => axios.post(pathURL, data),

    // 업데이트
    update: (id, data) => axios.put(`${pathURL}/${id}`, data),

    // 삭제
    remove: (id) => axios.delete(`${pathURL}/${id}`),

    // 상세 조회
    getById: (id) => axios.get(`${pathURL}/${id}`)
  };
};


/*


// 다음과 같이 호출
import { createApiClient } from './api/serviceAxios';
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