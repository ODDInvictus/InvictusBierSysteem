import { Box, Divider, Heading, SimpleGrid, useColorModeValue, VStack, Text, Button, Image, Modal, HStack, Center, useToast, useDisclosure, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter, FormControl, FormLabel, Input, Textarea, Select, Stack, List, ListItem, ListIcon, AvatarBadge, Avatar, Flex, Icon, Grid, GridItem } from '@chakra-ui/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ICalLink from 'react-icalendar-link'
import { ICalEvent } from 'react-icalendar-link/dist/utils'
import { useLocation, useRoute } from 'wouter'
import { Card } from '../../components/Card'
import { StyledButton } from '../../components/StyledButton'
import { Activity, Participant } from '../../types/activity'
import { Committee, User } from '../../types/users'
import { cache } from '../../utils/cache'
import { client } from '../../utils/client'
import { BsClockFill, BsFillCalendarDateFill, BsFillGeoAltFill, BsPeopleFill } from 'react-icons/bs'
import { setTitle } from '../../utils/utils'
import ErrorPage from '../ErrorPage'
import LoadingPage from '../LoadingPage'

export default function ActivityDetail() {
  
  const [activity, setActivity]         = useState<Activity>()
  const [participants, setParticipants] = useState<Participant[]>()
  const [event, setEvent]               = useState<ICalEvent>()
  const [committees, setCommittees]     = useState<string[]>()
  const [error, setError]               = useState<string>()

  // Soms werkt react gewoon niet echt mee
  const [, updateState] = useState<unknown>()
  const forceUpdate = useCallback(() => updateState({}), [])

  // As this point we know the user is logged in
  const [user] = useState<User>(cache.get<User>('user')!)
  

  const route = useRoute('/kalender/:id')[1]
  const [_, setLocation] = useLocation()

  const toast = useToast()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700'),
  }
  useEffect(() => {
    if (!route || !route.id) return

    client.get<{ activity: Activity, participants: Participant[] }>(`/activity/${route.id}/`)
      .then(({ activity, participants }) => {
        setTitle(activity.name)
        setActivity(activity)
        const startTime = `${activity.date}T${activity.start_time}`
        const endTime = new Date(new Date(startTime).getTime() + 5 * 60 * 60 * 1000).toISOString()

        setEvent({
          title: activity.name,
          description: activity.description,
          startTime: startTime,
          endTime: endTime,
          location: activity.location,
          attendees: participants.filter(p => p.present).map(p => `${p.user} <${p.email}>`)
        })

        setParticipants(participants)
      })
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

  const setParticipating = async (participating: boolean) => {
    if (!activity || !participants) return

    // If this user is in the participant array
    const p = participants.filter(p => p.user_id === user.id)

    if (p.length === 0) return

    if (p[0].present === participating) return

    setParticipants(participants.map(p => {
      if (p.user_id === user.id) {
        p.present = participating
      }
      return p
    }))

    client.post(`/activity/participation/${activity.id}/`, { present: participating })
      .then(() => {
        if (participating) {
          toast({
            title: 'Successvol ingeschreven!',
            description: 'Gezellig!',
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
        } else {
          toast({
            title: 'Successvol uitgeschreven!',
            description: 'Erg sip',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        }
      }).catch(e => {
        console.error(e)
        toast({
          title: 'Alles is stuk',
          description: e.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      })
  }

  const deleteActivity = () => {
    if (!activity) return

    if (!confirm(`Weet je zeker dat je activiteit: '${activity.name}' wil verwijderen`)) return

    client.delete(`/activity/${activity.id}/`)
      .then(() => {
        toast({
          title: 'Activiteit verwijderd',
          description: 'Je wordt herleid in 3 seconden',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        setTimeout(() => setLocation('/kalender'), 3000)
      }).catch(e => {
        toast({
          title: 'Activiteit niet verwijderd',
          description: e.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      })
  }

  if (error) return <ErrorPage error={error} />

  if (!activity || !participants || !user) return <LoadingPage h="80vh" />

  return <Box>
    <EditActivity activity={activity} isOpen={isOpen} onClose={onClose} onOpen={onOpen} />
    <VStack spacing="20px">
      <Heading as="h1" size="2xl" textAlign="center">
        {activity.name}
      </Heading>

      <Divider borderColor={colors.divider} />

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} pr="10px" pl="10px">
        <Card title="Omschrijving">
          <Text>
            {activity.description}
          </Text>

          <Divider borderColor={colors.divider} pt="10px" />

          <SimpleGrid columns={2}>
            <Center>
              <Box>
                <HStack pt="10px">
                  <Icon boxSize="1em" as={BsPeopleFill} />
                  <Text>{activity.organisation.name}</Text>
                </HStack>
                <HStack>
                  <Icon boxSize="1em" as={BsFillCalendarDateFill} />
                  <Text>{formatDate(activity.date)}</Text>
                </HStack>
                <HStack>
                  <Icon boxSize="1em" as={BsClockFill} />
                  <Text>{formatTime(activity.start_time)}</Text>
                </HStack>

                <HStack>
                  <Icon boxSize="1em" as={BsFillGeoAltFill} />
                  <Text>{activity.location}</Text>
                </HStack>
              </Box>
            </Center>

            <Center pt="10px">
              {/* @ts-expect-error Types kloppen niet */}
              <ICalLink filename="activiteit.ics" event={event}>
                <StyledButton>
                  Download ICS
                </StyledButton>
              </ICalLink>
            </Center>
          </SimpleGrid>


        </Card>

        <GridItem rowSpan={2}>
          <Card title="Aanwezigen" textAlign="center">
            <HStack justifyContent={'center'}>
              <StyledButton onClick={() => setParticipating(true)}>
                Ik ben bij 🐝
              </StyledButton>      
              <StyledButton onClick={() => setParticipating(false)}>
                Ik ben niet bij 😔
              </StyledButton>
            </HStack>
            <Divider color={colors.divider} pt="10px"/>
            <Aanwezigen participants={participants} />
          </Card>
        </GridItem>


        <Card title="Acties" textAlign="center">
          <SimpleGrid columns={2} pt="10px" spacing={3}>
            <StyledButton>
              Biertelling
            </StyledButton>
            <StyledButton>
              Doe declaratie
            </StyledButton>
            

            <StyledButton onClick={onOpen}>
              Wijzig
            </StyledButton>
            <Button
              color="white"
              colorScheme="red"
              bgGradient="linear(to-r, red.500,red.600)"
              onClick={deleteActivity}
              _hover={{
                bgGradient: 'linear(to-r, red.600,red.500)',
              }}>
              Verwijder
            </Button>
          </SimpleGrid>
        </Card>

      </SimpleGrid>
    </VStack>

  </Box> 
}

type AanwezigenProps = {
  participants: Participant[]
}

function Aanwezigen({ participants }: AanwezigenProps) {
  
  const [yes, setYes] = useState<Participant[]>([])
  const [no, setNo] = useState<Participant[]>([])

  useEffect(() => {
    // Create initial state
    setYes(participants.filter(p => p.present))
    setNo(participants.filter(p => !p.present))
  }, [participants])

  return <Box>
    {participants.length === 0 ? 
      <Center width="100%">
        <Box>
          <Heading>
            Helaas!
          </Heading>
          <Text>
            😔 Jij bent niet gaaf genoeg voor deze functie 😔
          </Text>
        </Box>
      </Center> :
      <Center>
        <VStack pt="10px">
          {yes.map(u => <UserCard key={u.user_id} participant={u} />)}
          {no.map(u => <UserCard key={u.user_id} participant={u} />)}
        </VStack>
      </Center>

    }
  </Box>
}

type UserCardProps = {
  participant: Participant
}

function UserCard({ participant }: UserCardProps) {

  const [color, setColor] = useState(participant.present ? 'green.500' : 'red.500')

  useEffect(() => {
    if (participant.present) {
      setColor('green.500')
    } else {
      setColor('red.500')
    }
  }, [participant])

  return <HStack direction='row' width='100%'>
    <Avatar size='sm' src={import.meta.env.VITE_STATIC_ENDPOINT + participant.profile_picture}>
      <AvatarBadge boxSize="1.25em" bg={color} />
    </Avatar>
    <Text>
      {participant.user}
    </Text>
  </HStack>
}

type EditActivityProps = {
  activity: Activity
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
}

function EditActivity (props: EditActivityProps) {

  const [ name, setName ] = useState<string>(props.activity.name)
  const [ description, setDescription ] = useState<string>(props.activity.description)
  const [ committee, setCommittee ] = useState<number>(props.activity.organisation.id)
  const [ location, setLocation ] = useState<string>(props.activity.location)
  const [ date, setDate ] = useState<Date>()

  const toast = useToast()

  useEffect(() => {
    const date = new Date(props.activity.date)
    const split = props.activity.start_time.split(':')
    if (split.length === 3) {
      date.setHours(parseInt(split[0]))
      date.setMinutes(parseInt(split[1]))
      date.setSeconds(parseInt(split[2]))
    }
    setDate(date)
  }, [])

  const save = () => {
    if (name === '' || description === '' || !committee || location === '' || !date) {
      toast({
        title: 'Oeps!',
        description: 'Je bent iets vergeten in te vullen',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    const newActivity = {
      name,
      description,
      committee,
      location,
      date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
      start_time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    }

    // window.db.updateDocument('main', 'activiteiten', props.activiteit.$id, activiteit)
    client.patch<void>(`/activity/update/${props.activity.id}/`, newActivity)
      .then(() => {
        toast({
          title: 'Gelukt!',
          description: 'Activiteit is aangepast, ik herlaad automatisch de pagina',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        setTimeout(() => window.location.reload(), 2000)
      }).catch(err => {
        toast({
          title: 'Oeps!',
          description: 'Er is iets mis gegaan',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      })
  }

  return <>
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        
        <ModalHeader>
          Wijzig activiteit
        </ModalHeader>

        <ModalCloseButton />
        
        <ModalBody>
          <FormControl>
            <FormLabel>Naam</FormLabel>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Naam"/>
          </FormControl>

          <FormControl>
            <FormLabel>Omschrijving</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Omschrijving"/>
          </FormControl>

          <FormControl>
            <FormLabel>Organisatie</FormLabel>
            <Select
              value={committee}
              onChange={(e) => setCommittee(parseInt(e.target.value))}>
              {/* //TODO */}
              {/* {props.commissies.map(c => <option key={c} value={c}>{c}</option>)} */}
            </Select>
          </FormControl>
          
          <FormControl>
            <FormLabel>Locatie</FormLabel>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Locatie"/>
          </FormControl>

          <FormControl>
            <FormLabel>Datum (huidig {date?.toLocaleString('nl')})</FormLabel>
            <Input
              type="datetime-local"
              onChange={(e) => setDate(new Date(e.target.value))}
              placeholder="Datum"/>
          </FormControl>

        </ModalBody>
        
        <ModalFooter>
          <StyledButton mr={3} onClick={save}>
            Opslaan
          </StyledButton>
          <Button variant='ghost' onClick={props.onClose}>
            Niet opslaan
          </Button>
        </ModalFooter>
        
      </ModalContent>
    </Modal>
  </>
}