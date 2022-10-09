import { Box, Divider, Heading, HStack, useColorModeValue, VStack, Text, Container, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Center, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Button } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { setTitle } from '../../utils/utils'


export default function Calendar() {
  
  const [_, setLocation] = useLocation()


  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700'),
  }
  useEffect(() => {
    setTitle('Kalender')  
  })

  return <Box>
    <VStack spacing="20px">
      <Heading as="h1" size="2xl">
        Activiteiten Kalender
      </Heading>

      <Divider borderColor={colors.divider} />

      <VStack>
        <Center>
          <Heading as="h2" size="lg" paddingBottom="20px">Opkomende Activiteiten</Heading>
        </Center>

        <TableContainer>
          <Table variant='striped' colorScheme='purple'>
            <Thead>
              <Tr>
                <Th>Activiteit</Th>
                <Th>Organisatie</Th>
                <Th>Locatie</Th>
                <Th>Datum</Th>
                <Th>Tijd</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr cursor="pointer" onClick={() => setLocation('/kalender/0')}>
                <Td>Symposium Invictus</Td>
                <Td>Senaat</Td>
                <Td>Het Colosseum</Td>
                <Td>29-09-2022</Td>
                <Td>22:00</Td>
              </Tr>
              <Tr>
                <Td>Wijncantus</Td>
                <Td>Senaat, Bierco</Td>
                <Td>Het Colosseum</Td>
                <Td>06-10-2022</Td>
                <Td>20:00</Td>
              </Tr>
              <Tr>
                <Td>Chaosborrel</Td>
                <Td>Bierco</Td>
                <Td>Het Colosseum</Td>
                <Td>13-10-2022</Td>
                <Td>21:00</Td>
              </Tr>
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Activiteit</Th>
                <Th>Locatie</Th>
                <Th>Organisatie</Th>
                <Th>Datum</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>

      </VStack>
    </VStack>

  </Box> 
}