import { Box, Divider, Heading, Text, Link as ChakraLink, SimpleGrid, useColorModeValue, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Link } from 'wouter'
import { fetchBackend, setTitle } from '../../utils/utils'
import LoadingPage from '../LoadingPage'
import ErrorPage from '../ErrorPage'

/**
 * This is not an actual page,
 * just here to copy to quickly create a new file
 */


export default function AdminPage() {

  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [roles, setRoles] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  
  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700'),
    box: useColorModeValue('white', 'gray.800'),
  }

  useEffect(() => {
    setTitle('Admin')

    fetchBackend('users', true)
      .then(data => {
        if (data.message) {
          setError(data.message)
          return
        }
        setData(data)
        setRoles(Object.keys(data.roles.perRole))
        load()
      }).catch(err => {
        setError(err.message)
      })
  }, [])


  const load = () => setTimeout(() => setLoading(false), 500)

  if (error) return <ErrorPage error={error} />

  if (loading) return <LoadingPage />

  console.log(data)

  return <Box>
    <VStack spacing="20px">
      <Heading as="h1" size="2xl">
        Admin Paneel
      </Heading>

      <Divider borderColor={colors.divider} />

      <SimpleGrid 
        columns={[1, null, 2]} 
        spacing={10}>
        <Box p={5} shadow="md" borderWidth="1px" bgColor={colors.box}>
          <Heading fontSize="xl" textAlign="center">
            <ChakraLink 
              as={Link} 
              textAlign="center"
              href={'/admin/rollen'}>
              Commissies
            </ChakraLink>
          </Heading>

          <Divider borderColor={colors.divider} pt="10px" mb="10px" />

          <SimpleGrid columns={3} spacing={2}>
            {roles.map(role => (
              <ChakraLink 
                as={Link} 
                textAlign="center"
                href={`/admin/rollen/${role.toLowerCase()}`} 
                key={role}>
                {role}
              </ChakraLink>
            ))}
          </SimpleGrid>
        </Box>
        <Box p={5} shadow="md" borderWidth="1px" bgColor={colors.box}>
          <Heading fontSize="xl" textAlign="center">IBS Gebruikers</Heading>

          <Divider borderColor={colors.divider} pt="10px" mb="10px" />

          <SimpleGrid columns={2} spacing={2}>
            {data.users.map((user: any) => (
              <Text textAlign="center" key={user.$id}>
                {user.name}
              </Text>
            ))}
          </SimpleGrid>
        </Box>

        <Box p={5} shadow="md" borderWidth="1px" bgColor={colors.box}>
          <Heading fontSize="xl" textAlign="center">Bier voorraad</Heading>

          <Divider borderColor={colors.divider} pt="10px" mb="10px" />

          <SimpleGrid columns={2} spacing={2}>
            <Text textAlign="center">Grolsch Premium Pilsner 30cl</Text>
            <Text textAlign="center">102</Text>

            <Text textAlign="center">Grolsch Premium Pilsner 45cl</Text>
            <Text textAlign="center">16</Text>

            <Text textAlign="center">Bavaria 30cl</Text>
            <Text textAlign="center">0</Text>

            <Text textAlign="center">Warsteiner 30cl</Text>
            <Text textAlign="center">56</Text>
          </SimpleGrid>
        </Box>

        <Box p={5} shadow="md" borderWidth="1px" bgColor={colors.box}>
          <Heading fontSize="xl" textAlign="center">Frituur voorraad</Heading>

          <Divider borderColor={colors.divider} pt="10px" mb="10px" />

          <SimpleGrid columns={2} spacing={2}>

            <Text textAlign="center">Frikandel</Text>
            <Text textAlign="center">18</Text>

            <Text textAlign="center">Kipnuggets (portie)</Text>
            <Text textAlign="center">9</Text>

            <Text textAlign="center">Patat (portie)</Text>
            <Text textAlign="center">44</Text>

            <Text textAlign="center">Bamischijf</Text>
            <Text textAlign="center">5</Text>

            <Text textAlign="center">Kroket</Text>
            <Text textAlign="center">12</Text>

          </SimpleGrid>
        </Box>
        
      </SimpleGrid>
    </VStack>

  </Box> 
}