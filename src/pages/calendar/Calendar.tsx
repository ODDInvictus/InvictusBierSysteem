import { Box, Divider, Heading, Link as LinkElem, useColorModeValue, VStack, Text, Container, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Center, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Button, HStack, Show, SimpleGrid } from '@chakra-ui/react'
import { Query } from 'appwrite'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'wouter'
import { Card } from '../../components/Card'
import { StyledButton } from '../../components/StyledButton'
import { setTitle } from '../../utils/utils'

// export type Activity = {

// }

export default function Calendar() {

  const [activities, setActivities] = useState<any[]>([])

  const [_, setLocation] = useLocation()
  
  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700'),
  }
  useEffect(() => {
    setTitle('Kalender')
    
    window.db.listDocuments('main', 'activiteiten', [
      Query.greaterThan('datum', new Date().toISOString())
    ]).then(a => setActivities(a.documents))
  }, [])

  const formatDate = (d: Date) => {
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`
  }

  const formatTime = (d: Date) => {
    return `${d.getHours()}:${(d.getMinutes()<10?'0':'') + d.getMinutes() }`
  }

  return <Box>
    <VStack spacing="20px">
      <Heading as="h1" size="2xl" textAlign="center">
        Activiteiten Kalender
      </Heading>

      <Divider borderColor={colors.divider} />

      <VStack>

        <Show above="lg">
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
                {/* @ts-expect-error Je kan gewoon Date - Date doen niet zo piepen */}
                {activities.sort((a, b) => (new Date(a.datum)) - (new Date(b.datum))).map(a => (
                  <Tr key={a.$id}>
                    <Td>
                      <LinkElem as={Link} href={'/kalender/' + a.$id}>
                        {a.naam}
                      </LinkElem>
                    </Td>
                    <Td>{a.organisatie}</Td>
                    <Td>{a.locatie}</Td>
                    <Td>{formatDate(new Date(a.datum))}</Td>
                    <Td>{formatTime(new Date(a.datum))}</Td>
                  </Tr>
                ))}
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
          <HStack pt="30px">
            <StyledButton onClick={() => setLocation('/kalender/nieuw')}>
              Activiteit toevogen
            </StyledButton>
          </HStack>
        </Show>

        <Show below="lg">
          <SimpleGrid columns={1} spacing="20px" width="80vw">
            {/* @ts-expect-error Hier ook niet piepen */}
            {activities.sort((a, b) => (new Date(a.datum)) - (new Date(b.datum))).map(a => (
              <Card title={a.naam} key={a.$id}>
                <Text>Locatie: {a.locatie}</Text>
                <Text>Datum: {formatDate(new Date(a.datum))} om {formatTime(new Date(a.datum))}</Text>
                <LinkElem 
                  color="purple.500" 
                  textDecoration={useColorModeValue('underline', 'none')}
                  as={Link} 
                  href={'/kalender/' + a.$id}>
                  Meer info
                </LinkElem>
              </Card>
            ))}
          </SimpleGrid>
          <HStack pt="30px" pb="30px">
            <StyledButton onClick={() => setLocation('/kalender/nieuw')}>
              Activiteit toevogen
            </StyledButton>
          </HStack>
        </Show>

      </VStack>
    </VStack>

  </Box> 
}