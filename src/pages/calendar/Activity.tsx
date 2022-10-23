import { Box, Divider, Heading, SimpleGrid, useColorModeValue, VStack, Text, Button, Modal, HStack, Center, useToast, useDisclosure, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter, FormControl, FormLabel, Input, Textarea, Select } from '@chakra-ui/react'
import { Models } from 'appwrite'
import { useEffect, useRef, useState } from 'react'
import ICalLink from 'react-icalendar-link'
import { useLocation, useRoute } from 'wouter'
import { Card } from '../../components/Card'
import { StyledButton } from '../../components/StyledButton'
import { Activiteit } from '../../types/backend'
import { fetchBackend, setTitle } from '../../utils/utils'
import ErrorPage from '../ErrorPage'
import LoadingPage from '../LoadingPage'

export default function Activity() {
  
  const [activiteit, setActiviteit] = useState<Activiteit>()
  const [users, setUsers]           = useState<Models.Membership[]>()
  const [user, setUser]             = useState<Models.Account<Models.Preferences>>()
  const [event, setEvent]           = useState<any>({})
  const [commissies, setCommissies]           = useState<string[]>()
  
  const [error, setError]           = useState<string>()

  const route = useRoute('/kalender/:id')[1]
  const [_, setLocation] = useLocation()

  const toast = useToast()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700'),
  }
  useEffect(() => {
    if (!route || !route.id) return

    window.db.getDocument('main', 'activiteiten', route.id)
      .then(a => {
        const activiteit = a as unknown as Activiteit
        setTitle(activiteit.naam)
        setActiviteit(activiteit)
        setEvent({
          title: activiteit.naam,
          description: activiteit.omschrijving,
          startTime: new Date(activiteit.datum),
          endTime: new Date(new Date(activiteit.datum).getTime() + 5 * 60 * 60 * 1000),
          location: a.locatie
        })
      }).then(() => {
        window.teams.listMemberships('lid')
          .then(memberships => setUsers(memberships.memberships))
          .catch(e => setUsers([]))
      }).then(() => {
        window.account.get()
          .then(setUser)
      }).then(() => {
        fetchBackend('roles', true)
          .then(d => {
            if (d.message) {
              setError(d.message)
              return
            }
            setCommissies(d)
          })
      }).catch(err => {
        setError(err.message)
      })
  }, [])

  const formatDate = (d: Date) => {
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`
  }

  const formatTime = (d: Date) => {
    return `${d.getHours()}:${(d.getMinutes()<10?'0':'') + d.getMinutes() }`
  }

  const setAanwezig = async (aanwezig: boolean) => {
    if (!activiteit) return

    if (aanwezig && activiteit.aanwezigen.includes(user!.$id)) return
    if (!aanwezig && !activiteit.aanwezigen.includes(user!.$id)) return

    const newAanwezigen = activiteit.aanwezigen.slice(0)

    if (aanwezig) {
      newAanwezigen.push(user!.$id)
    } else {
      const idx = newAanwezigen.indexOf(user!.$id)
      newAanwezigen.splice(idx, 1)
    }

    const a = await window.db.updateDocument('main', 'activiteiten', activiteit.$id, {
      aanwezigen: newAanwezigen
    })

    setActiviteit(a as unknown as Activiteit)
  }

  const deleteActivity = () => {
    if (!activiteit) return

    if (!confirm(`Weet je zeker dat je activiteit: '${activiteit.naam}' wil verwijderen`)) return

    window.db.deleteDocument('main', 'activiteiten', activiteit.$id)
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

  if (!activiteit || !users || !user || !commissies) return <LoadingPage h="80vh" />

  return <Box>
    <EditActivity activiteit={activiteit} isOpen={isOpen} onClose={onClose} onOpen={onOpen} commissies={commissies}/>
    <VStack spacing="20px">
      <Heading as="h1" size="2xl" textAlign="center">
        {activiteit.naam}
      </Heading>

      <Divider borderColor={colors.divider} />

      <SimpleGrid columns={[1, null, 2]} spacing={10} pr="10px" pl="10px">
        <Card title="Omschrijving">
          <Text>
            {activiteit.omschrijving}
          </Text>
        </Card>

        <Card title="Informatie">
          <Text>
            <b>Organisatie:</b> {activiteit.organisatie}
          </Text>
          <Text>
            <b>Locatie:</b> {activiteit.locatie}
          </Text>
          <Text>
            <b>Datum:</b> {formatDate(new Date(activiteit.datum))}
          </Text>
          <Text>
            <b>Tijd:</b> {formatTime(new Date(activiteit.datum))}
          </Text>

          <Box pt="10px">
            {/* @ts-expect-error Types kloppen niet */}
            <ICalLink filename="activiteit.ics" event={event}>
              <StyledButton>
                Download ICS
              </StyledButton>
            </ICalLink>
          </Box>

        </Card>

        <Card title="Aanwezigen" textAlign="center">
          <HStack justifyContent={'center'}>
            <StyledButton onClick={() => setAanwezig(true)}>
              Ik ben bij 🐝
            </StyledButton>      
            <StyledButton onClick={() => setAanwezig(false)}>
              Ik ben niet bij 😔
            </StyledButton>
          </HStack>

  
          <Divider color={colors.divider} pt="10px"/>

          <Aanwezigen activiteit={activiteit} users={users} />

        </Card>

        <Card title="Acties">
          <SimpleGrid columns={2} pt="5px" spacing={3}>
            <StyledButton>
              Biertelling
            </StyledButton>
            <StyledButton>
              Doe declaratie
            </StyledButton>
            <StyledButton onClick={onOpen}>
              Wijzig Activiteit
            </StyledButton>
            <Button
              color="white"
              colorScheme="red"
              bgGradient="linear(to-r, red.500,red.600)"
              onClick={deleteActivity}
              _hover={{
                bgGradient: 'linear(to-r, red.600,red.500)',
              }}>
              Verwijder Activiteit
            </Button>
          </SimpleGrid>
        </Card>
      </SimpleGrid>
    </VStack>

  </Box> 
}

type AanwezigenProps = {
  activiteit: Activiteit
  users: Models.Membership[]
}

function Aanwezigen({ activiteit, users }: AanwezigenProps) {
  
  const [afwezigen, setAfwezigen] = useState<Models.Membership[]>([])
  const [aanwezigen, setAanwezigen] = useState<Models.Membership[]>([])

  useEffect(() => {
    setAfwezigen(users.filter(u => !activiteit.aanwezigen.includes(u.userId)))
    setAanwezigen(users.filter(u => activiteit.aanwezigen.includes(u.userId)))
  }, [activiteit])

  return <Box>
    {users.length === 0 ? 
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
      <SimpleGrid columns={2} spacing={3}>
        <VStack pt="10px">
          <Heading size="sm">Aanwezigen</Heading>
          {aanwezigen.map(u => <Text key={u.$id}>{u.userName}</Text>)}
        </VStack>

        <VStack pt="10px">
          <Heading size="sm">Afwezigen</Heading>
          {afwezigen.map(u => <Text key={u.$id}>{u.userName}</Text>)}
        </VStack>
      </SimpleGrid>
    }
  </Box>
}

type EditActivityProps = {
  activiteit: Activiteit
  commissies: string[]
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
}

function EditActivity (props: EditActivityProps) {

  const [ naam, setNaam ] = useState<string>(props.activiteit.naam)
  const [ omschrijving, setOmschrijving ] = useState<string>(props.activiteit.omschrijving)
  const [ organisatie, setOrganisatie ] = useState<string>(props.activiteit.organisatie)
  const [ locatie, setLocatie ] = useState<string>(props.activiteit.locatie)
  const [ datum, setDatum ] = useState<Date>(new Date(props.activiteit.datum))

  const toast = useToast()

  const save = () => {
    if (naam === '' || omschrijving === '' || organisatie === '' || locatie === '' || !datum) {
      toast({
        title: 'Oeps!',
        description: 'Je bent iets vergeten in te vullen',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    const activiteit = {
      naam,
      omschrijving,
      organisatie,
      locatie,
      datum: datum.toISOString(),
    }

    window.db.updateDocument('main', 'activiteiten', props.activiteit.$id, activiteit)
      .then(() => {
        toast({
          title: 'Gelukt!',
          description: 'Activiteit is aangepast, ik herlaad automatisch de pagina',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        setTimeout(() => location.reload(), 2000)
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
              value={naam}
              onChange={(e) => setNaam(e.target.value)}
              placeholder="Naam"/>
          </FormControl>

          <FormControl>
            <FormLabel>Omschrijving</FormLabel>
            <Textarea
              value={omschrijving}
              onChange={(e) => setOmschrijving(e.target.value)}
              placeholder="Omschrijving"/>
          </FormControl>

          <FormControl>
            <FormLabel>Organisatie</FormLabel>
            <Select
              value={organisatie}
              onChange={(e) => setOrganisatie(e.target.value)}>
              {props.commissies.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </FormControl>
          
          <FormControl>
            <FormLabel>Locatie</FormLabel>
            <Input
              value={locatie}
              onChange={(e) => setLocatie(e.target.value)}
              placeholder="Locatie"/>
          </FormControl>

          <FormControl>
            <FormLabel>Datum</FormLabel>
            <Input
              type="datetime-local"
              onChange={(e) => setDatum(new Date(e.target.value))}
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