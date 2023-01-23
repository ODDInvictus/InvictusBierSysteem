import { Box, Heading, VStack, TableContainer, Table, Thead, Tr, Tbody, Th, Td, Center, Text, Spinner } from '@chakra-ui/react'
import { useRoute, useLocation } from 'wouter'
import { useEffect, useState } from 'react'
import { bakDetails } from '../../types/chugs'
import { client } from '../../utils/client'
import Title from '../../components/Title'
import { StyledButton } from '../../components/StyledButton'

export default function StrafbakkenDetails() {

  const [ username, setUsername ] = useState<string | undefined>(useRoute('/bakken/:username')[1]?.username)
  if (!username) return <Text>Ja geen idee wat hier gebeurd</Text>

  const [_, setLocation] = useLocation()

  const [ bakkenDetails, setBakkenDetails ] = useState<bakDetails>({bakken: 0, details: []})
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ err, setErr ] = useState()

  useEffect(() => {
    setLoading(true)
    client.get<bakDetails>(`/chugs/bakken/${username}`)
    .then((res) => {
      setBakkenDetails(res)
      setLoading(false)
    })
    .catch(setErr)
  }, [username])

  const formatDate = (str: string) => {
    const d = new Date(str)
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`
  }

  function formatName(name: string | undefined) {
    if (name === undefined) return ''
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  if (err) return (
    <Box>
      <VStack spacing="20px">
        <Title value="Strafbakken" />
        <Center>
          <Heading>
            Is weer stuk...
          </Heading>
        </Center>
      </VStack>
    </Box>
  )

  if (loading) return (
    <Box>
      <VStack spacing="20px">
        <Center>
          <Spinner />
        </Center>
      </VStack>
    </Box>
  )

  return (
    <Box>
      <VStack spacing="20px">
        <Title value={
          `${formatName(username)} zijn ${bakkenDetails.bakken} bak${(bakkenDetails.bakken !== 1) ? 'ken' : ''}`
        }/>
        <StyledButton onClick={() => setLocation(`/strafbakken/${username}/`)}>
          Welke strafbakken moet {formatName(username)} nog trekken?
        </StyledButton>
        <TableContainer>
          <Table variant='striped' colorScheme='purple'>
            <Thead>
              <Tr>
                <Th>Gever</Th>
                <Th>Reden</Th>
                <Th>Datum</Th>
              </Tr>
            </Thead>
            <Tbody>
              {bakkenDetails.details.map( (s, i) => (
                <Tr key={i}>
                  <Td 
                    onClick={() => {
                      setLocation(`/bakken/${s.giver_username}/`)
                      setUsername(s.giver_username)
                    }}
                    _hover={{textDecoration: 'underline'}}
                    cursor='pointer'
                  >
                    {formatName(s.giver)}
                  </Td>
                  <Td>{s.reason}</Td>
                  <Td>{formatDate(s.date)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
    </Box>
  )
}