import { Box, Divider, Heading, useColorModeValue, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { Card } from '../../components/Card'
import { StyledButton } from '../../components/StyledButton'
import { setTitle } from '../../utils/utils'

export default function FinancialHome() {

  const [_, setLocation] = useLocation()
  
  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700'),
  }
  useEffect(() => {
    setTitle('Financieel')  
  }, [])

  return <Box>
    <VStack spacing="20px">
      <Heading as="h1" size="2xl" textAlign="center">
        Financieel
      </Heading>

      <Divider borderColor={colors.divider} />

      <Card title="TODO">
        <VStack>
          <StyledButton onClick={() => setLocation('/financieel/streeplijst/verwerk/')}>
            Verwerk streeplijst
          </StyledButton>

          <StyledButton onClick={() => setLocation('/financieel/mutaties/nieuw/')}>
            Nieuwe mutatie
          </StyledButton>
        </VStack>

      </Card>
    </VStack>

  </Box> 
}