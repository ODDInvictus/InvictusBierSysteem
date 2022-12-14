import { Box, Divider, Heading, Image, SimpleGrid, Stat, StatHelpText, StatLabel, StatNumber, Text, useColorModeValue, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { setTitle } from '../utils/utils'

export default function Index() {

  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700'),
  }
  useEffect(() => {
    setTitle('Home')  
  })

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
          <StatNumber>21</StatNumber>
          <StatHelpText>oef</StatHelpText>
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