import { Box, Divider, Heading, useColorModeValue, VStack, Flex, TableContainer, Table, Thead, Tr, Tbody, Th, Td, Center, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter, FormControl, FormLabel, Input, Button, useDisclosure, useToast, Text, textDecoration } from "@chakra-ui/react"
import { useRoute, useLocation } from 'wouter'
import { useEffect, useState } from 'react'
import { bakDetails } from '../../types/chugs'
import { client } from "../../utils/client"

export default function StrafbakkenDetails() {

  const username = useRoute('/strafbakken/:username')[1]?.username
  if (!username) return <Text>Ja geen idee wat hier gebeurd</Text>

  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700')
  }

  const [_, setLocation] = useLocation()

  const [ strafbakkenDetails, setStrafbakkenDetails ] = useState<bakDetails>({bakken: 0, details: []})
  const [ err, setErr ] = useState()

  useEffect(() => {
    client.get<bakDetails>(`/chugs/strafbakken/${username}`)
    .then(setStrafbakkenDetails)
    .catch(setErr)
  }, [])

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
        <Heading as="h1" size="2xl">
          Strafbakken
        </Heading>
        <Divider borderColor={colors.divider} />
        <Center>
          <Heading>
            Is weer stuk...
          </Heading>
        </Center>
      </VStack>
    </Box>
  )

  return (
    <Box>
      <VStack spacing="20px">
        <Heading as="h1" size="2xl" textAlign='center'>
          {`${username.charAt(0).toUpperCase() + username.slice(1)} zijn ${strafbakkenDetails.bakken} strafbak${(strafbakkenDetails.bakken !== 1) ? 'ken' : ''}`}
        </Heading>
        <Divider borderColor={colors.divider} />
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
              {strafbakkenDetails.details.map(s => (
                <Tr>
                  <Td 
                    onClick={() => setLocation(`/strafbakken/${s.giver_username}/`)}
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