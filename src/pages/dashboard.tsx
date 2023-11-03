import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';


function Dashboard(){
    const navigate = useNavigate();
    const [userData, setUserData] = useState<any>([]);

    useEffect(() => {
        if(!sessionStorage.getItem('token')){
            navigate('/signin');
        }else{
            
        }
    }, [])

    return(
        <Container>
            <div>
                <h1>Dashboard</h1>
            </div>
        </Container>
    )

}

const Container = styled.div``

export default Dashboard;
