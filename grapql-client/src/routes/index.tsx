import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Container, Button, Link, Table } from '@radix-ui/themes'

export const Route = createFileRoute('/')({
  component: () => (<App />),
})

const App = () => {
  const navigate = useNavigate()
  // Fix 1: Initialize with empty array instead of array with empty object
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState<any>(false)
  const [error, setError] = useState<any>(null)

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `query {
            users {
              _id
              name
              email
            }
          }`,
        }),
      })

      const data = await res.json()

      // Fix 2: Handle GraphQL errors properly
      if (data.errors) {
        console.error('GraphQL errors:', data.errors)
        setError('Failed to fetch users')
        return
      }

      // Fix 3: Handle case when users data might be null/undefined
      if (data.data?.users) {
        setUsers(data.data.users)
      } else {
        setUsers([])
      }
    } catch (error) {
      console.error('Network error:', error)
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (e, id) => {
    e.preventDefault()

    // Fix 4: Add confirmation before delete
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return
    }

    try {
      const res = await fetch('http://localhost:5000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Fix 5: Use variables for security
          query: `mutation DeleteUser($id: ID!) {
            deleteUser(id: $id) {
              _id
              name
              email
            }
          }`,
          variables: { id }
        }),
      })

      const data = await res.json()
      console.log(data)

      if (data.errors) {
        console.error('GraphQL errors:', data.errors)
        setError('Failed to delete user')
        return
      }

      // Fix 6: Handle both GraphQL response and MongoDB response
      if (data.data?.deleteUser?._id || (data.acknowledged && data.deletedCount > 0)) {
        console.log('User deleted successfully')
        // Fix 7: Optimistic update instead of refetching
        setUsers(prevUsers => prevUsers.filter(user => user._id !== id))
      } else {
        setError('Failed to delete user')
      }
    } catch (error) {
      console.error('Network error:', error)
      setError('Network error occurred')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Fix 8: Add loading and error states
  if (loading) {
    return (
      <Container style={{ marginTop: '2rem', textAlign: 'center' }}>
        <div>Loading users...</div>
      </Container>
    )
  }

  return (
    <Container style={{ marginTop: '2rem' }}>
      {/* Fix 9: Display error messages */}
      {error && (
        <div style={{
          color: 'red',
          marginBottom: '1rem',
          padding: '0.5rem',
          border: '1px solid red',
          borderRadius: '0.25rem',
          backgroundColor: '#fee'
        }}>
          {error}
          <button
            onClick={() => setError(null)}
            style={{ marginLeft: '1rem', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>
      )}

      <Button style={{ marginBottom: '1rem', float: 'right' }} asChild>
        {/* Fix 10: Use navigate function instead of href for TanStack Router */}
        <button
          onClick={() => navigate({ to: '/user/add' })}
          style={{ textDecoration: 'none', cursor: 'pointer' }}
        >
          Add User
        </button>
      </Button>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {users.map((user) => (
            <Table.Row key={user._id}>
              <Table.RowHeaderCell>{user.name}</Table.RowHeaderCell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {/* Fix 11: Use navigate for edit as well */}
                  <button
                    onClick={() => navigate({ to: '/user/edit/$userId', params: { userId: user._id } })}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'blue',
                      textDecoration: 'underline',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, user._id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'red',
                      textDecoration: 'underline',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}

          {/* Fix 12: Correct colspan and better empty state */}
          {users.length === 0 && !loading && (
            <Table.Row>
              <Table.RowHeaderCell colSpan={3} style={{ textAlign: 'center', padding: '2rem' }}>
                No users found. <br />
                <Button
                  onClick={() => navigate({ to: '/user/add' })}
                  style={{ marginTop: '1rem' }}
                >
                  Add First User
                </Button>
              </Table.RowHeaderCell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    </Container>
  )
}