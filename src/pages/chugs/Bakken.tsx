import { Box, Divider, Heading, useColorModeValue, VStack, Flex, TableContainer, Table, Thead, Tr, Tbody, Th, Td, Center, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter, FormControl, FormLabel, Input, Button, useDisclosure, useToast } from "@chakra-ui/react"
import { StyledButton } from '../../components/StyledButton'
import { AddIcon, MinusIcon } from "@chakra-ui/icons"
import { useState, useEffect } from "react"
import { useLocation } from 'wouter'
import { client } from '../../utils/client'
import { bakkenOverview } from '../../types/chugs'
import '../../styles/Chugs.css'

export default function Chugs() {

  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700')
  }

  const [_, setLocation] = useLocation()

  const [ bakken, setBakken ] = useState<bakkenOverview[]>([])
  const [ err, setErr ] = useState<string | undefined>(undefined)

  useEffect( () => {
    client.get('/chugs/bakken/')
    .then(setBakken)
    .catch(setErr)
  },[])

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
        <Heading as="h1" size="2xl">
          Getrokken strafbakken
        </Heading>
        <Divider borderColor={colors.divider} />
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