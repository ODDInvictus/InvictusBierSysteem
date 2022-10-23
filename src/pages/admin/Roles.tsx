import { Box, Button, Divider, Heading, useColorModeValue, VStack, Text, Th, Thead, Table, Tr, Td, Tbody } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useLocation, useRoute } from 'wouter'
import { useLoading } from '../../hooks/useLoading'
import { fetchBackend, setTitle } from '../../utils/utils'
import LoadingPage from '../LoadingPage'
import NotFound from '../NotFound'
import { RiArrowGoBackFill } from 'react-icons/ri'
import ErrorPage from '../ErrorPage'

export default function ExamplePage() {
  
  const [users, setUsers] = useState<any>()

  const [loading, load] = useLoading(500)
  const [error, setError] = useState<string>('')

  const route = useRoute('/admin/rollen/:role')[1]
  const [_, setLocation] = useLocation()

  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700'),
  }
  useEffect(() => {
    if (!route || !route.role) return

    setTitle(`Rolbeheer :: ${route.role}`)

    window.teams.listMemberships(route.role)
      .then(u => setUsers(u.memberships))
      .then(load)
      .catch(e => setError(e.message))
  }, [])

  const deleteFromRole = (userId: string) => {
    if (confirm('Weet je zeker dat je deze gebruiker uit deze rol wil gooien?')) {
      fetchBackend('users/roles', true, 'DELETE', { userId, role: route!.role })
        .then(res => {
          if (res.message) {
            setError(res.message)
            return
          }
        })
        .then(() => setUsers(users.filter((u: any) => u.userId !== userId)))
    }
  }

  if (!route || !route.role) return <NotFound />

  if (error) return <ErrorPage error={error}/>

  if (loading) return <LoadingPage />

  return <Box>
    <VStack spacing="20px">
      <Heading as="h1" size="2xl">
        {`Rolbeheer :: ${route.role}`}
      </Heading>

      <Divider borderColor={colors.divider} />
      
      <Table variant="striped" colorScheme="purple">
        <Thead>
          <Tr> 
            <Th>Naam</Th>
            <Th>Email</Th>
            <Th>Acties</Th>
          </Tr>
        </Thead>

        <Tbody>
          {users.map((u: any) => (
            <Tr key={u.$id}>
              <Td>{u.userName}</Td>
              <Td>{u.userEmail}</Td>
              <Td>
                <Button colorScheme="purple" size="sm" onClick={() => deleteFromRole(u.$id)}>
                  Verwijder
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>

      </Table>

      <Divider pt="10px" borderColor={colors.divider} />

      <Button 
        bgGradient="linear(to-r, purple.600, purple.500)"
        _hover={{
          bgGradient: 'linear(to-r, purple.600, purple.600)',
        }}
        colorScheme="purple"
        onClick={() => setLocation('/admin')}>
        <RiArrowGoBackFill />&nbsp;
        Terug
      </Button>
    </VStack>

  </Box> 
}