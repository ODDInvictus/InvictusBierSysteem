import { Box, Button, Divider, FormControl, FormHelperText, FormLabel, Heading, Input, InputGroup, InputLeftElement, Select, SimpleGrid, Spinner, Text, useColorModeValue, useToast, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { BsFillCalendarDateFill } from 'react-icons/bs'
import { Card } from '../../components/Card'
import { StyledButton } from '../../components/StyledButton'
import { Product, SaleTransaction } from '../../types/financial'
import { Committee, User } from '../../types/users'
import { cache } from '../../utils/cache'
import { client } from '../../utils/client'
import { setTitle } from '../../utils/utils'
import LoadingPage from '../LoadingPage'

type NewSalesMutationProps = {
  committees: Committee[]
}

export default function NewSalesMutationPage(props: NewSalesMutationProps) {
  
  const [showWarning, setShowWarning] = useState<boolean>(!!props.committees.find(c => c.abbreviation === 'senaat'))
  const [loading, setLoading] = useState<boolean>(true)
  const [users, setUsers] = useState<User[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [user,] = useState<User>(cache.get<User>('user')!)
  
  const toast = useToast()

  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700'),
  }

  const load = () => setTimeout(() => setLoading(false), 1000)
  
  useEffect(() => {
    setTitle('Nieuwe mutatie')

    const fun = async () => {
      try {
        const products = await client.get<Product[]>('/financial/products/')
        const users = await client.get<User[]>('/user/all/')

        setProducts(products)
        setUsers(users)
        load()
      } catch (err: any) {
        toast({
          title: 'Er ging iets mis',
          description: err.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }

    fun()
  }, [])

  if (loading) return <LoadingPage />

  return <Box>
    <VStack spacing="20px">
      <Heading as="h1" size="2xl" textAlign="center">
        Nieuwe Mutatie
      </Heading>

      <Divider borderColor={colors.divider} />

      {showWarning ? <Warning setShowWarning={setShowWarning} /> : <NewSalesMutationForm user={user} users={users} products={products}/>}
    </VStack>

  </Box> 
}

type NewSalesMutationFormProps = {
  user: User
  users: User[]
  products: Product[]
}

const NewSalesMutationForm = (props: NewSalesMutationFormProps) => {

  const [type, setType] = useState<string>('Sale')
  const [description, setDescription] = useState<string>('')
  const [date, setDate] = useState<string>()
  const [user, setUser] = useState<number>(props.user.id)

  const [price, setPrice] = useState<string>('0')

  const [product, setProduct] = useState<number>(props.products[0].id)
  const [amount, setAmount] = useState<number>(0)

  const toast = useToast()

  useEffect(() => {
    if (type === 'Contribution') {
      setPrice(6)
    } else if (type === 'Generic') {
      setPrice(0)
    }
  }, [type])

  const submit = () => {
    const d = new Date().toISOString().split('T')[0]

    if (!description || description === '') {
      return toast({
        title: 'Beschrijving ontbreekt',
        description: 'Vul een beschrijving in',
        status: 'error',
        duration: 2000
      })
    }

    if (!user || user === 0) {
      return toast({
        title: 'Gebruiker ontbreekt',
        description: 'Selecteer een gebruiker',
        status: 'error',
        duration: 2000
      })
    }

    const transaction = {
      date: d,
      description,
      added_by: props.user.id,
      user,
    }

    const handleThen = () => {
      toast({
        title: 'Success',
        description: 'De mutatie is gemaakt! De pagina wordt ververst',
        status: 'success',
        duration: 2000
      })
      setTimeout(() => window.location.reload(), 2000)
    }

    const handleErr = (err: Error) => {
      toast({
        title: 'Er ging iets mis',
        description: err.message,
        status: 'error',
        duration: 5000,
      })
    }

    if (type === 'Sale') {
      if (!product || product === 0) {
        return toast({
          title: 'Product ontbreekt',
          description: 'Selecteer een product',
          status: 'error',
          duration: 2000
        })
      }

      if (!amount || amount === 0) {
        return toast({
          title: 'Aantal ontbreekt',
          description: 'Vul een aantal in',
          status: 'error',
          duration: 2000
        })
      }

      const sale = Object.assign(transaction, {
        product,
        amount,
      })

      client.post<SaleTransaction>('/financial/transactions/new/sale/', sale)
        .then(handleThen)
        .catch(handleErr)
    } else if (type === 'Generic') {
      let error = false

      if (!price || price === '0') error = true

      let pStr = price

      if (price.includes(',')) {
        pStr = price.replace(',', '.')
      }

      const p = parseFloat(pStr)

      if (error || isNaN(p)) {
        return toast({
          title: 'Prijs ontbreekt',
          description: 'Vul een prijs in',
          status: 'error',
          duration: 2000
        })
      }

      const generic = Object.assign(transaction, {
        price: p,
      })

      client.post<SaleTransaction>('/financial/transactions/new/generic/', generic)
        .then(handleThen)
        .catch(handleErr)
    }
  }

  return <Box>
    <Card title="Mutatie">
      <SimpleGrid columns={[1, null, 2]} spacing="10px">

        <FormControl>
          <FormLabel>Mutatie type</FormLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}>
            <option value="Sale">Verkoop (streeplijst)</option>
            <option value="Generic">Generiek</option>
          </Select>
          <FormHelperText>Wat is dit? Vraag het niels</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>Beschrijving</FormLabel>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Beschrijving" />
          <FormHelperText>Bv. Streeplijst Frituur</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>Datum</FormLabel>
          <InputGroup>
            <InputLeftElement
              color='gray.500'
              fontSize='1.2em'
              pointerEvents="none">
              <BsFillCalendarDateFill />
            </InputLeftElement>
            <Input 
              onChange={(e) => setDate(e.target.value)}
              type="date" 
              placeholder="Datum" />
          </InputGroup>
          <FormHelperText>De datum waarop de transactie geldig is. Default naar vandaag.</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>Gebruiker</FormLabel>
          <Select
            value={user}
            onChange={(e) => setUser(parseInt(e.target.value))}>
            {props.users.map(user => <option 
              key={user.id} 
              value={user.id}>
              {`${user.first_name} ${user.last_name}`}</option>)}
          </Select>
          <FormHelperText>De gebruiker waarvoor de mutatie is.</FormHelperText>
        </FormControl>

        {type === 'Sale' && <FormControl>
          <FormLabel>Aantal</FormLabel>
          <InputGroup>
            <InputLeftElement
              color='gray.500'
              fontSize='1.2em'
              pointerEvents="none">
              <Text> x </Text> 
            </InputLeftElement>
            <Input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value))}
              placeholder="Aantal" />
          </InputGroup>
          <FormHelperText>Het aantal dat is verkocht.</FormHelperText>
        </FormControl>}

        {type === 'Sale' && <FormControl>
          <FormLabel>Product</FormLabel>
          <Select
            value={product}
            onChange={(e) => setProduct(parseInt(e.target.value))}>
            {props.products.map(product => <option
              key={product.id}
              value={product.id}>
              {product.name} ({product.price})
            </option>)}
          </Select>
          <FormHelperText>Het product dat is verkocht.</FormHelperText>
        </FormControl>}

        {type !== 'Sale' && <FormControl>
          <FormLabel>Bedrag</FormLabel>
          <InputGroup>
            <InputLeftElement
              color='gray.500'
              fontSize='1.2em'
              pointerEvents="none">
              <Text> € </Text>
            </InputLeftElement>
            <Input 
              value={price}
              onChange={e => setPrice(e.target.value)}
              type="number" 
              placeholder="Bedrag" />
          </InputGroup>
          <FormHelperText>Mag ook negatief zijn. Dan krijgt deze persoon nog geld van ons.</FormHelperText>
        </FormControl>}

      </SimpleGrid>

      <StyledButton mt={4} onClick={submit}>
        Opslaan
      </StyledButton>

    </Card>
  </Box>
}

const Warning = ({ setShowWarning }: any) => {
  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700'),
  }

  return <Card title="Waarschuwing" textAlign="center">
    <Text>

      Hoi Senaat! <br/> <br/>
      Leuk dat jullie op deze pagina terecht zijn gekomen. <br/>
      Als je je best doet kan je hiero (en in heel /financieel) best wel veel verkloten, dus ik vraag jullie om voorzichtig te zijn. <br/>
      Weet je iets niet, dan kan je altijd ff mij appen. <br/>


    </Text>

    <Box pt="10px" />

    <Divider borderColor={colors.divider} />

    <Box pt="10px">
      <StyledButton onClick={() => setShowWarning(false)}>
        Ik beloof niks te slopen
      </StyledButton>
    </Box>

  </Card>
}