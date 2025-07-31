import { createFileRoute, } from '@tanstack/react-router'
import { Container, Button, Link, Table } from '@radix-ui/themes'
import { useEffect, useState } from 'react'
export const Route = createFileRoute('/')({
  component: () => (<App />),
})

const App = () => {
  const [users, setusers] = useState([{ name: '', email: '' }])

  const fetchusers = async () => {
    const res = await fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify({
        query: `query {
                    users {
                      name
                      email
                    }
                  }`,
      }),
    })
    const data = await res.json()
    setusers(data.data?.users)
  }
  useEffect(() => { fetchusers() }, [])
  return (
    <Container style={{ marginTop: '2rem' }}>
      <Button style={{ marginBottom: '1rem', float: 'right' }} asChild>
        <Link style={{ textDecoration: 'none' }} href="/user/add">Add User</Link>
      </Button>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {
            users.map((user, index) => (
              <Table.Row key={index}>
                <Table.RowHeaderCell>{user.name}</Table.RowHeaderCell>
                <Table.Cell>{user.email}</Table.Cell>
              </Table.Row>
            ))
          }
          {
            users.length === 0 && (
              <Table.Row>
                <Table.RowHeaderCell colSpan={2}>No users found</Table.RowHeaderCell>
              </Table.Row>
            )
          }
        </Table.Body>
      </Table.Root>
    </Container>
  )
}