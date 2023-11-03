import React from 'react';
import styled from 'styled-components';

function Home() {
    return (
        <Container>
            <div>
                <h1>Home</h1>
                <button><a href="/signin"> Sign in</a></button>
            </div>

        </Container>

    )
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: black;
    button{
        padding: 10px 20px;
        border-radius: 0.4rem;
        background-color: #997af0;
        border: none;
        &:hover{
            background-color: #4e0eff;
        }
        a{
            text-decoration: none;
            color: black;
        }
    }
    h1{
        font-size: 3rem;
        margin-bottom: 2rem;
    }
`

export default Home;
