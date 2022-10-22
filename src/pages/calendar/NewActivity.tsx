import { Box, Divider, FormControl, FormHelperText, FormLabel, Heading, Input, Select, SimpleGrid, Textarea, useColorModeValue, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'
import { Card } from '../../components/Card'
import { StyledButton } from '../../components/StyledButton'
import { Activiteit } from '../../types/backend'
import { setTitle } from '../../utils/utils'
import LoadingPage from '../LoadingPage'

export default function NewActivity() {

  const [name, setName]               = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [date, setDate]               = useState<Date>()
  const [location, setLocation]       = useState<string>('Het Colosseum')
  const [committee, setCommittee]     = useState<string>('')

  const [roles, setRoles] = useState<string[]>([])

  const [_, setHistory] = useLocation()

  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700'),
  }
  useEffect(() => {
    setTitle('Nieuwe activiteit')

    fetch(import.meta.env.VITE_BACKEND_ENDPOINT + 'users')
      .then(res => res.json())
      .then(data => setRoles(Object.keys(data.roles.perRole)))
  }, [])

  const save = async () => {
    if (name === '') return alert('Naam is niet ingevuld!')
    if (committee === '') return alert('Kies een commissie!')
    if (description === '')  return alert('Schrijf eerst even een beschrijving!')
    if (!date) return alert('Geef een datum op!')
    if (location === '') return alert('Kies een locatie!')

    const activity = {
      naam: name,
      omschrijving: description,
      datum: date.toISOString(),
      locatie: location,
      organisatie: committee,
      aanwezigen: [],
    }

    const document = await window.db.createDocument('main', 'activiteiten', 'unique()', activity)

    setHistory('/kalender/' + document.$id)
  }

  if (roles.length === 0) return <LoadingPage h="80vh" />

  return <Box>
    <VStack spacing="20px">
      <Heading as="h1" size="2xl">
        Nieuwe Activiteit
      </Heading>

      <Divider borderColor={colors.divider} />

      <SimpleGrid columns={[1, null, 2]} spacing="40px" width="95%">
        <Card title="Omschrijving">
          <FormControl>
            <FormLabel>Naam</FormLabel>
            <Input
              name="name-input"
              focusBorderColor='purple.600'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Naam"/>
            <FormHelperText>Verzin iets leuks</FormHelperText>
          </FormControl>
          
          <FormControl>
            <FormLabel>Commissie</FormLabel>
            <Select
              value={committee}
              focusBorderColor='purple.600'
              onChange={(e) => setCommittee(e.target.value)}
              placeholder="Selecteer een commissie">
              {roles.map(role => <option key={role} value={role}>{role}</option>)}
            </Select>
            <FormHelperText>Wie verzaakt het deze keer?</FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>Omschrijving</FormLabel>
            <Textarea
              name="description-input"
              focusBorderColor='purple.600'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Omschrijving"/>
          </FormControl>
        </Card>

        <Card title="Details">
          <FormControl>
            <FormLabel>Datum en tijd</FormLabel>

            <Input
              name="date-input"
              focusBorderColor='purple.600'
              onChange={(e) => setDate(new Date(e.target.value))}
              type="datetime-local"/>
            <FormHelperText>Hoeft niet per se op donderdag he</FormHelperText>
          </FormControl>


          <FormControl>
            <FormLabel>Locatie</FormLabel>
            <Input
              name="location-input"
              focusBorderColor='purple.600'
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Locatie"/>
            <FormHelperText>Kies een leuke locatie, zoals Het Colosseum</FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>Alles ingevuld?</FormLabel>
            <StyledButton onClick={save}>
              Maak activiteit aan
            </StyledButton>
          </FormControl>
        </Card>
      </SimpleGrid>








    </VStack>

  </Box> 
}