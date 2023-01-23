import { Box, Heading, VStack, TableContainer, Table, Thead, Tr, Tbody, Th, Td, Center, Spinner } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { useLocation } from 'wouter'
import { client } from '../../utils/client'
import { bakkenOverview } from '../../types/chugs'
import Title from '../../components/Title'
import '../../styles/Chugs.css'

export default function Chugs() {

  const [_, setLocation] = useLocation()

  const [ bakken, setBakken ] = useState<bakkenOverview[]>([])
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ err, setErr ] = useState<string | undefined>(undefined)

  useEffect( () => {
    setLoading(true)
    client.get<bakkenOverview[]>('/chugs/bakken/')
    .then((res) => {
      setBakken(res)
      setLoading(false)
    })
    .catch(setErr)
  }, [])

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
        <Title value="Strafbakken" />
        <Center>
          <Spinner />
        </Center>
      </VStack>
    </Box>
  )

  return (
    <Box>
      <VStack spacing="20px">
        <Title value="Strafbakken" />
        <TableContainer>
          <Table variant='striped' colorScheme='purple'>
            <Thead>
              <Tr>
                <Th>Naam</Th>
                <Th>Bakken</Th>
              </Tr>
            </Thead>
            <Tbody>
              {bakken.map(s => (
                <Tr key={s.username}>
                  <Td
                    onClick={() => setLocation(`/bakken/${s.username}/`)}
                    cursor="pointer"
                    className="clickable-td">
                    {(s.nickname||s.username).charAt(0).toUpperCase() + (s.nickname||s.username).slice(1)}
                  </Td>
                  <Td 
                    onClick={() => setLocation(`/bakken/${s.username}/`)}
                    cursor="pointer"
                    className="clickable-td">
                    {s.bakken}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
    </Box>
  );
}