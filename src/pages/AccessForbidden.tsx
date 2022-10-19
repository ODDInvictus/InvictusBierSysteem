import { Box, Heading, Text, Button, propNames } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { Roles } from '../utils/user'
import { setTitle } from '../utils/utils'

type AccessForbiddenProps = {
  roles: Roles[]
}

export default function AccessForbidden(props: AccessForbiddenProps) {
  const [_, setLocation] = useLocation()

  useEffect(() => {
    setTitle('Toegang verboden')
  }, [])

  return <Box textAlign="center" py={10} px={6}>
    <Heading
      display="inline-block"
      as="h2"
      size="4xl"
      bgGradient="linear(to-r, purple.400, purple.600)"
      backgroundClip="text">
    403
    </Heading>
    <Text fontSize="18px" mt={3} mb={2}>
     😤 Toegang verboden 😤
    </Text>
    <Text color={'gray.500'} mb={6}>
      Helaas! Je bent niet gaaf genoeg voor deze pagina! Je mist (een) van de volgende rollen: {props.roles.join(', ')}
    </Text>

    <Button
      colorScheme="purple"
      bgGradient="linear(to-r, purple.600, purple.500, purple.400)"
      color="white"
      onClick={() => setLocation('/')}
      variant="solid">
      Terug naar de bebouwde kom
    </Button>
  </Box>
}