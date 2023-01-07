import { Box, Button, Heading, HStack, Input, InputGroup, Select, SimpleGrid, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useColorMode, useColorModeValue } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { StyledButton } from '../../components/StyledButton'
import { Product, ProductCategory } from '../../types/financial'
import { User } from '../../types/users'

type UserProductTableProps = {
  users: User[]
  products: Product[]
}

export const UserProductTable = ({ users, products }: UserProductTableProps) => {

  const [rowsData, setRowsData] = useState<Record<string, number>[]>([
    {
      user: 0,
      product: 0,
      amount: 0,
    },
    {
      user: 0,
      product: 0,
      amount: 0,
    },
    {
      user: 0,
      product: 0,
      amount: 0,
    }
  ])

  const addTableRow = () => {
    const input = {
      user: 0,
      product: 0,
      amount: 0,
    }
    setRowsData([...rowsData, input])
  }

  // Deletes a row from the table
  const deleteTableRow = (index: number) => {
    const newRowsData = [...rowsData]
    newRowsData.splice(index, 1)
    setRowsData(newRowsData)
  }

  const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    const newRowsData = [...rowsData]
    newRowsData[index][name] = Number(value)
    setRowsData(newRowsData)
  }

  return <TableContainer>
    <Table size="sm">
      <Thead>
        <Tr>
          <Th textAlign="center">Naam</Th>
          <Th textAlign="center">Product</Th>
          <Th textAlign="center">Aantal</Th>
          <Th textAlign="center">Bedrag</Th>
          <Th textAlign="center">
            <Button onClick={addTableRow}>+</Button>
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {rowsData.map((row, idx) => 
          <UserRow key={idx} users={users} products={products} deleteRow={() => deleteTableRow(idx)} last={rowsData.length - 1 === idx} />
        )}
      </Tbody>
    </Table>
  </TableContainer>
}

type UserRowProps = {
  users: User[]
  products: Product[]
  deleteRow: () => void
  last: boolean
}

const UserRow = ({ users, products, deleteRow, last }: UserRowProps) => {

  const colors = {
    bg: useColorModeValue('white', 'gray.700'),
    text: useColorModeValue('black', 'white'),
  }

  // TODO
  // const makeName = (user: User) => `${user.first_name} (${user.username}) ${user.last_name}`
  const makeName = (user: User) => `${user.first_name} ${user.last_name}`

  const calculatePrice = () => {
    return '12,44'
  }

  return <Tr>
    <Td>
      <Select bgColor={colors.bg} defaultValue="0">
        <option value="0" disabled hidden>Naam</option>
        {users.map(user => <option key={user.id} value={user.id}>{makeName(user)}</option>)}
      </Select>
    </Td>

    <Td>
      <ProductSelect products={products} />
    </Td>

    <Td isNumeric>
      <Input type="number" placeholder="Aantal" bgColor={colors.bg} _placeholder={{ color: colors.text }}/>
    </Td>
    
    <Td>
      €&nbsp;{calculatePrice()}
    </Td>

    <Td>
      {last ? <Button onClick={() => deleteRow()}>
        x
      </Button> : null}
    </Td>
  </Tr>
}

type ProductSelectProps = {
  products: Product[]
}

const ProductSelect = ({ products }: ProductSelectProps) => {

  const [options, setOptions] = useState<React.ReactNode[]>([])

  useEffect(() => {
    const grouped: Record<string, Product[]> = {}

    products.forEach(product => {
      if (grouped[product.category.name]) {
        grouped[product.category.name].push(product)
      } else {
        grouped[product.category.name] = [product]
      }
    })

    const options = Object.entries(grouped).map(([category, products]) => {
      return <optgroup key={category} label={category} style={{ fontStyle: 'normal' }}>
        {products.map(product => <option key={product.id} value={product.id}>{product.name}</option>)}
      </optgroup>
    })

    setOptions(options)
  }, [])
  
  const colors = {
    bg: useColorModeValue('white', 'gray.700'),
    text: useColorModeValue('black', 'white'),
  }

  return <Select bgColor={colors.bg} placeholder="Product" defaultValue="0">
    <option value="0" disabled hidden>Product</option>
    {options}
  </Select>
}