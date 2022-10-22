import { Box, Divider, Heading, SimpleGrid, useColorModeValue, VStack, Text, Button, HStack } from '@chakra-ui/react'
import { Models } from 'appwrite'
import { useEffect, useRef, useState } from 'react'
import { useRoute } from 'wouter'
import { Card } from '../../components/Card'
import { StyledButton } from '../../components/StyledButton'
import { Activiteit } from '../../types/backend'
import { setTitle } from '../../utils/utils'
import LoadingPage from '../LoadingPage'

export default function Activity() {
  
  const [activiteit, setActiviteit] = useState<Activiteit>()
  const [users, setUsers] = useState<Models.Membership[]>()
  const [user, setUser] = useState<Models.Account<Models.Preferences>>()

  const route = useRoute('/kalender/:id')[1]

  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700'),
  }
  useEffect(() => {
    if (!route || !route.id) return

    window.db.getDocument('main', 'activiteiten', route.id)
      .then(a => {
        setTitle(a.naam)
        setActiviteit(a as unknown as Activiteit)
      }).then(() => {
        window.teams.listMemberships('lid')
          .then(memberships => setUsers(memberships.memberships))
      }).then(() => {
        window.account.get()
          .then(setUser)
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

  if (!activiteit || !users || !user) return <LoadingPage h="80vh" />

  return <Box>
    <VStack spacing="20px">
      <Heading as="h1" size="2xl">
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
              Biertelling vooraf
            </StyledButton>
            <StyledButton>
              Biertelling achteraf
            </StyledButton>
            <StyledButton>
              Doe een declaratie
            </StyledButton>
            <StyledButton>
              Wijzig Activiteit
            </StyledButton>
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
  </Box>
}