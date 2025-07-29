package com.example.TravelProject.repository;

import com.example.TravelProject.dto.login.MyPageDTO;
import com.example.TravelProject.repository.UserAccount.MyPageRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class MyPageRepositoryTest {


    private final MyPageRepository myPageRepository;

    MyPageRepositoryTest(MyPageRepository myPageRepository) {
        this.myPageRepository = myPageRepository;
    }

    @Test
    void userRepositoryTest() {

        List<MyPageDTO> myPageDto =
                myPageRepository.findAllByUserId(2);


        for (int i=0 ; i < myPageDto.size(); i++){
            MyPageDTO pageDTO = new MyPageDTO();

             pageDTO = myPageDto.get(i);

            System.out.println(pageDTO);
        }


    }


}
