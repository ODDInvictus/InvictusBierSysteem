import { Box, Divider, Heading, Table, TableCaption, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, useColorModeValue, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { setTitle } from '../utils/utils'

export default function Inventory() {

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
              <Td isNumeric>552</Td>
              <Td isNumeric>260</Td>
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

    </VStack>

  </Box> 
}