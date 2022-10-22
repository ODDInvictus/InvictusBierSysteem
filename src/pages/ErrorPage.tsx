import { Heading, Text, Button, Box } from '@chakra-ui/react'
import { useLocation } from 'wouter'

type ErrorPageProps = {
  error: string
}

export default function ErrorPage(props: ErrorPageProps) {
  const [_, setLocation] = useLocation()

  return <Box textAlign="center" py={10} px={6}>
    <Heading
      display="inline-block"
      as="h2"
      size="4xl"
      bgGradient="linear(to-r, purple.400, purple.600)"
      backgroundClip="text">
    500
    </Heading>
    <Text fontSize="18px" mt={3} mb={2}>
      😡 Iets ging fout 😡
    </Text>
    <Text color={'gray.500'} mb={3}>
      Das toch echt wel een bakje voor jou. Als jij een bakje hebt getrokken kan je vast wel iets met de volgende error:
    </Text>

    <Text color={'red.500'} mb={6} mt={3}>
      {props.error}
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