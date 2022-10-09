import { Box, Center, Heading, Text, Button } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { setTitle } from '../utils/utils';

export default function NotFound() {
  const [_, setLocation] = useLocation()

  useEffect(() => {
    setTitle('Not Found')
  })

  return <Box textAlign="center" py={10} px={6}>
  <Heading
    display="inline-block"
    as="h2"
    size="4xl"
    bgGradient="linear(to-r, purple.400, purple.600)"
    backgroundClip="text">
    404
  </Heading>
  <Text fontSize="18px" mt={3} mb={2}>
    😔 Page Not Found 😔
  </Text>
  <Text color={'gray.500'} mb={6}>
    The page you're looking for does not seem to exist
  </Text>

  <Button
    colorScheme="purple"
    bgGradient="linear(to-r, purple.600, purple.500, purple.400)"
    color="white"
    onClick={() => setLocation('/')}
    variant="solid">
    Go to Home
  </Button>
</Box>
}