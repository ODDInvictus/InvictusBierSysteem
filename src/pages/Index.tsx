import { Box, Divider, Heading, Image, SimpleGrid, Stat, StatHelpText, StatLabel, StatNumber, Text, useColorModeValue, VStack, Spinner } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { setTitle } from '../utils/utils'
import { cache } from '../utils/cache'
import { User } from '../types/users'
import { bakDetails } from '../types/chugs'

export default function Index() {

  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700'),
  }

  const [user] = useState<User>(cache.get<User>('user')!)
  const [ strafbakken, setStrafbakken ] = useState<Number | undefined>(undefined)

  useEffect(() => {
    setTitle('Home')

    cache.getWhenAvaliable<bakDetails>(`strafbakken_${user.username}`)
    .then( (res) => {
      setStrafbakken(res.bakken)
    })
  }, [])

  function OpinionOnStrafbakken(strafbakken: Number | undefined) {
    if (strafbakken === undefined) return ''
    if (strafbakken < 6) return 'Laf'
    if (strafbakken < 11) return 'Lekker vouwen'
    if (strafbakken < 21) return 'Aan de bak'
    return 'Oei'
  }

  return <Box>
    <VStack spacing="20px">
      <Heading as="h1" size="2xl" textAlign="center">
        Invictus Bier Systeem
      </Heading>

      <Divider borderColor={colors.divider} />

      <SimpleGrid columns={2} spacing="50px">
        <Stat>
          <StatLabel>Huidig krediet</StatLabel>
          <StatNumber>-€30,44</StatNumber>
          <StatHelpText>per 12 okt</StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Volume gezopen</StatLabel>
          <StatNumber>440 L</StatNumber>
          <StatHelpText>das wel veel</StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Huidig saldo</StatLabel>
          <StatNumber>€244,78</StatNumber>
          <StatHelpText>Veel bier?</StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Strafbakken</StatLabel>
          <StatNumber>
            {(strafbakken === undefined) ? <Spinner /> : String(strafbakken)}
          </StatNumber>
          <StatHelpText>{OpinionOnStrafbakken(strafbakken)}</StatHelpText>
        </Stat>
      </SimpleGrid>

      <Divider borderColor={colors.divider} />

      <Heading as="h2" size="xl" textAlign="center">
        Quote van de dag
      </Heading>
      
      <Box>
        <span style={{ fontStyle: 'italic' }}>
          &quot;Ik heb dit nog niet geimplementeerd&quot;
        </span>
        <span>
          - Niels
        </span>
      </Box>

      <Divider borderColor={colors.divider} />

      <Heading as="h2" size="xl" textAlign="center">
        Plaatje van de dag
      </Heading>

      <Image src="/missing.jpg" alt="stuk" />

    </VStack>

  </Box> 
}