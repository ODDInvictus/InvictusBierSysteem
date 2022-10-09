import { Box, Divider, Heading, useColorModeValue, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { setTitle } from '../../utils/utils'

interface ActivityProps {
  id: number
}

export default function Activity(props: ActivityProps) {
  
  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700'),
  }
  useEffect(() => {
    setTitle('Home')
  }, [])

  return <Box>
    <VStack spacing="20px">
      <Heading as="h1" size="2xl">
        Symposium Invictus
      </Heading>

      <Divider borderColor={colors.divider} />
    </VStack>

  </Box> 
}