import { Box, Divider, Heading, Link as LinkElem, useColorModeValue, VStack, Text, Container, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, Center, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Button, HStack, Show, SimpleGrid } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'wouter'
import { Card } from '../../components/Card'
import { StyledButton } from '../../components/StyledButton'
import { Activity } from '../../types/activity'
import { client } from '../../utils/client'
import { setTitle } from '../../utils/utils'

export default function Calendar() {

  const [activities, setActivities] = useState<Activity[]>([])
  const [err, setErr]               = useState<string | undefined>(undefined)

  const [_, setLocation] = useLocation()
  
  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700'),
    text: useColorModeValue('underline', 'none')
  }
  useEffect(() => {
    setTitle('Kalender')
    
    client.get<Activity[]>('/activity/')
      .then(setActivities)
      .catch(setErr)
  }, [])

  const formatDate = (str: string) => {
    const d = new Date(str)
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`
  }

  const formatTime = (str: string) => {
    const d = str.split(':')
    if (d.length < 2) return str
    return `${d[0]}:${d[1]}`
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
                  <Tr key={a.id}>
                    <Td>
                      <LinkElem as={Link} href={`/kalender/${a.id}/`}>
                        {a.name}
                      </LinkElem>
                    </Td>
                    <Td>{a.organisation.name}</Td>
                    <Td>{a.location}</Td>
                    <Td>{formatDate(a.date)}</Td>
                    <Td>{formatTime(a.start_time)}</Td>
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
              <Card title={a.name} key={a.id}>
                <Text>Locatie: {a.location}</Text>
                <Text>Datum: {formatDate(a.date)} om {formatTime(a.start_time)}</Text>
                <LinkElem 
                  color="purple.500" 
                  textDecoration={colors.text}
                  as={Link} 
                  href={`/kalender/${a.id}/`}>
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