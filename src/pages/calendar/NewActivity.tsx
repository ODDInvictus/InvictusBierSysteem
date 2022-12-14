import { Box, Divider, FormControl, FormHelperText, FormLabel, Heading, Input, Select, SimpleGrid, Textarea, useColorModeValue, useToast, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'
import { Card } from '../../components/Card'
import { StyledButton } from '../../components/StyledButton'
import { Activity } from '../../types/activity'
import { Activiteit } from '../../types/backend'
import { Committee } from '../../types/users'
import { client } from '../../utils/client'
import { setTitle } from '../../utils/utils'
import LoadingPage from '../LoadingPage'

export default function NewActivity() {

  const [name, setName]               = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [date, setDate]               = useState<Date>()
  const [location, setLocation]       = useState<string>('Het Colosseum')
  const [committee, setCommittee]     = useState<number>(-1)
  const [committees, setCommittees]   = useState<Committee[]>([])

  const toast = useToast()

  const [_, setHistory] = useLocation()

  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700'),
  }
  useEffect(() => {
    setTitle('Nieuwe activiteit')

    client.get<Committee[]>('/user/committee/')
      .then(setCommittees)
      .catch(err => {
        console.error(err)
        toast({
          title: 'Iets ging fout!',
          description: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      })

  }, [])

  const newToast = (desc: string) => {
    toast({
      title: 'Oeps',
      description: desc,
      status: 'error',
      duration: 2000,
      isClosable: true,
    })
  }

  const save = async () => {
    if (name === '') return newToast('Vul een naam in')
    if (committee === -1) return newToast('Kies een commissie!')
    if (description === '')  return newToast('Schrijf eerst even een beschrijving!')
    if (!date) return newToast('Geef een datum op!')
    if (location === '') return newToast('Kies een locatie!')

    const activity = {
      name,
      description,
      organisation: committee,
      date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      start_time: `${date.getHours()}:${date.getMinutes()}:00`,
      location
    }

    client.post<Activity>('/activity/create/', activity)
      .then(d => {
        toast({
          title: 'Activiteit aangemaakt',
          description: 'Je wordt herleid in 5 seconden!',
          status: 'success',
          duration: 5000,
          isClosable: false,
        })
        setTimeout(() => setHistory('/kalender/' + d.id), 5000)
      })
      .catch(err => {
        toast({
          title: 'Oeps!',
          description: 'Iets ging fout of jij bent niet gaaf genoeg om dit te doen! Error: ' + err.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      })
  }

  if (!committees || committees.length === 0) return <LoadingPage h="80vh" />

  return <Box>
    <VStack spacing="20px">
      <Heading as="h1" size="2xl">
        Nieuwe Activiteit
      </Heading>

      <Divider borderColor={colors.divider} />

      <SimpleGrid columns={[1, null, 2]} spacing="20px" width="95%">
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
              onChange={(e) => setCommittee(parseInt(e.target.value))}
              placeholder="Selecteer een commissie">
              {committees.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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