import { Box, Divider, Heading, useColorModeValue, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { setTitle } from '../../utils/utils'

/**
 * This is not an actual page,
 * just here to copy to quickly create a new file
 */


export default function NewSale() {
  
  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700'),
  }
  useEffect(() => {
    setTitle('Verwerk Streeplijst')  
  }, [])

  return <Box>
    <VStack spacing="20px">
      <Heading as="h1" size="2xl">
        Verwerk Streeplijst
      </Heading>

      <Divider borderColor={colors.divider} />
    </VStack>

  </Box> 
}