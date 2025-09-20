import React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import styled from 'styled-components'
import { Button } from '@radix-ui/themes'
export const Route = createFileRoute('/user/add')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
  })

  const handleSubmit = async () => {
    const res = await fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify({
        query: `mutation {
                    createUser(name: "${formData.name}",
                     email: "${formData.email}",
                      password: "${formData.password}") {
                      name
                      email
                      password
                    }
                  }`,
      }),
    })
    const data = await res.json()
    if (data && data.data?.createUser?.name) navigate({ to: '/' })
  }
  return (
    <StyledWrapper>
      <form className="form">
        <div className="input-container">
          <input placeholder="Enter name" onChange={(e) => setFormData({ ...formData, name: e.target.value })} type="text" />
        </div>
        <div className="input-container">
          <input placeholder="Enter email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} type="email" />
        </div>
        <div className="input-container">
          <input placeholder="Enter password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} type="password" />
        </div>
        <Button typeof='submit' className="submit" onClick={(e) => {
          e.preventDefault()
          handleSubmit()
        }} type="submit">
          Submit
        </Button>
      </form>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  .form {
    margin: 0 auto;
    background-color: #fff;
    display: block;
    padding: 1rem;
    max-width: 350px;
    border-radius: 0.5rem;
  }

  .form-title {
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 600;
    text-align: center;
    color: #000;
  }

  .input-container {
    position: relative;
  }

  .input-container input, .form button {
    outline: none;
    border: 1px solid #e5e7eb;
    margin: 8px 0;
  }

  .input-container input {
    background-color: #fff;
    padding: 1rem;
    padding-right: 3rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    width: 300px;
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .input-container span {
    display: grid;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    padding-left: 1rem;
    padding-right: 1rem;
    place-content: center;
  }

  .input-container span svg {
    color: #9CA3AF;
    width: 1rem;
    height: 1rem;
  }
    
  .submit{
      margin:0 auto;
  }`;