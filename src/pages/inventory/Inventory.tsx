import { Box, Button, Divider, Heading, HStack, SimpleGrid, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, useColorModeValue, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { StyledButton } from '../../components/StyledButton'
import { setTitle } from '../../utils/utils'

export default function Inventory() {

  const [_, setLocation] = useLocation()

  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700'),
  }

  useEffect(() => {
    setTitle('Voorraad')
  }, [])

  return <Box>
    <VStack spacing="20px">
      <Heading as="h1" size="2xl">
        Voorraad
      </Heading>

      <Divider borderColor={colors.divider} />

      <SimpleGrid columns={[2, null, 5]} spacing="30px">

        <StyledButton
          color="white"
          onClick={() => setLocation('/voorraad/inkopen')}
          _hover={{
            bgGradient: 'linear(to-r, purple.600, purple.600)'
          }}
          bgGradient="linear(to-r, purple.600, purple.500)">
          Inkopen
        </StyledButton>

        <StyledButton
          color="white"
          onClick={() => setLocation('/voorraad/inkopen/nieuw')}
          _hover={{
            bgGradient: 'linear(to-r, purple.600, purple.600)'
          }}
          bgGradient="linear(to-r, purple.600, purple.500)">
          Nieuwe inkoop
        </StyledButton>

        <StyledButton
          color="white"
          onClick={() => setLocation('/voorraad/streeplijsten')}
          _hover={{
            bgGradient: 'linear(to-r, purple.600, purple.600)'
          }}
          bgGradient="linear(to-r, purple.600, purple.500)">
          Streeplijsten
        </StyledButton>

        <StyledButton
          color="white"
          onClick={() => setLocation('/voorraad/streeplijsten/nieuw')}
          _hover={{
            bgGradient: 'linear(to-r, purple.600, purple.600)'
          }}
          bgGradient="linear(to-r, purple.600, purple.500)">
          Verwerk streeplijst
        </StyledButton>

        <StyledButton
          color="white"
          onClick={() => setLocation('/voorraad/statistieken')}
          _hover={{
            bgGradient: 'linear(to-r, purple.600, purple.600)'
          }}
          bgGradient="linear(to-r, purple.600, purple.500)">
          Huidige statistieken
        </StyledButton>
      </SimpleGrid>

      <Divider borderColor={colors.divider} />

      <SimpleGrid columns={[1, null, 2]} spacing={10}>
        <TableContainer>
          <Table variant="striped" colorScheme="purple">
            <TableCaption>Voorraad van bierflesjes</TableCaption>
            <Thead>
              <Tr>
                <Th>Product</Th>
                <Th>Inkoop</Th>
                <Th>Verkoop</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Grolsch Premium Pilsner 30cl</Td>
                <Td isNumeric>240</Td>
                <Td isNumeric>165</Td>
              </Tr>
              <Tr>
                <Td>Grolsch Premium Pilsner 45cl</Td>
                <Td isNumeric>96</Td>
                <Td isNumeric>60</Td>
              </Tr>
              <Tr>
                <Td>De Klok 50cl</Td>
                <Td isNumeric>72</Td>
                <Td isNumeric>65</Td>
              </Tr>
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Product</Th>
                <Th>Inkoop</Th>
                <Th>Verkoop</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>

        <TableContainer>
          <Table variant="striped" colorScheme="purple">
            <TableCaption>Voorraad van frituur</TableCaption>
            <Thead>
              <Tr>
                <Th>Product</Th>
                <Th>Inkoop</Th>
                <Th>Verkoop</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Frikandel</Td>
                <Td isNumeric>20</Td>
                <Td isNumeric>16</Td>
              </Tr>
              <Tr>
                <Td>Kroket</Td>
                <Td isNumeric>12</Td>
                <Td isNumeric>5</Td>
              </Tr>
              <Tr>
                <Td>Friet (bord)</Td>
                <Td isNumeric>10</Td>
                <Td isNumeric>6</Td>
              </Tr>
              <Tr>
                <Td>Kipnuggets (5 stuks)</Td>
                <Td isNumeric>15</Td>
                <Td isNumeric>9</Td>
              </Tr>
              <Tr>
                <Td>Bitterballen (10 stuks)</Td>
                <Td isNumeric>5</Td>
                <Td isNumeric>3</Td>
              </Tr>
              <Tr>
                <Td>Bamischijf</Td>
                <Td isNumeric>5</Td>
                <Td isNumeric>5</Td>
              </Tr>
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Product</Th>
                <Th>Inkoop</Th>
                <Th>Verkoop</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </SimpleGrid>

    </VStack>

  </Box> 
}