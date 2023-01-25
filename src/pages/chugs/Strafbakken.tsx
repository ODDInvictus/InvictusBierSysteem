import { Box, Heading, VStack, Flex, TableContainer, Table, Thead, Tr, Tbody, Th, Td, Center, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter, FormControl, FormLabel, Input, Button, useDisclosure, useToast, Spinner, Link as LinkElem, useMediaQuery } from '@chakra-ui/react'
import { StyledButton } from '../../components/StyledButton'
import { AddIcon, MinusIcon } from '@chakra-ui/icons'
import { useState, useEffect } from 'react'
import { useLocation, Link } from 'wouter'
import { client } from '../../utils/client'
import { bakDetails, bakkenOverview } from '../../types/chugs'
import '../../styles/Chugs.css'
import { setTitle } from '../../utils/utils'
import Title from '../../components/Title'

export default function Strafbakken() {

  const [_, setLocation] = useLocation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isMobile] = useMediaQuery("(max-width: 900px)") 

  const [ strafbakken, setStrafbakken ] = useState<bakkenOverview[]>([])
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ err, setErr ] = useState<string | undefined>(undefined)
  const [ selected, setSelected ] = useState<string | undefined>(undefined)

  useEffect( () => {
    setTitle('Strafbakken')
    setLoading(true)
    client.get<bakkenOverview[]>('/chugs/strafbakken/')
    .then( (res) => {
      setStrafbakken(res)
      setLoading(false)
    })
    .catch(setErr)
  },[])

  if (err) return (
    <Box>
      <VStack spacing="20px">
        <Title value="Strafbakken" />
        <Center>
          <Heading>
            Is weer stuk...
          </Heading>
        </Center>
      </VStack>
    </Box>
  )

  if (loading) return (
    <Box>
      <VStack spacing="20px">
        <Center>
          <Spinner marginTop="calc(50vh - 80px)" />
        </Center>
      </VStack>
    </Box>
  )

  return (
    <Box>
      <Reason
        selected={selected}
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        strafbakken={strafbakken}
        setStrafbakken={setStrafbakken}
      />
      <VStack spacing="20px">
        <Title value="Strafbakken" />
        <StyledButton onClick={() => setLocation('/bakken/')}>
          Wie is er meesterbakker?
        </StyledButton>
        <TableContainer display="flex" gap="25px" alignItems="flex-start">
          {
          isMobile ?
          <StrafbakTable 
            setSelected={setSelected}
            strafbakken={strafbakken}
            setStrafbakken={setStrafbakken}
            onOpen={onOpen}
            setErr={setErr}
            display='full'
          />
          : <>
          <StrafbakTable 
            setSelected={setSelected}
            strafbakken={strafbakken}
            setStrafbakken={setStrafbakken}
            onOpen={onOpen}
            setErr={setErr}
            display='fst-half'
          />
          <StrafbakTable 
            setSelected={setSelected}
            strafbakken={strafbakken}
            setStrafbakken={setStrafbakken}
            onOpen={onOpen}
            setErr={setErr}
            display='snd-half'
          />
          </>
          }
        </TableContainer>
      </VStack>
    </Box>
  );
}

type ReasonProps = {
  selected: string | undefined
  isOpen: boolean
  strafbakken: bakkenOverview[]
  setStrafbakken: (x:bakkenOverview[]) => void
  onClose: () => void
  onOpen: () => void
}

function Reason(props: ReasonProps) {

  const toast = useToast()

  const [ reason, setReason ] = useState<string | undefined>(undefined)

  function formatName(name: string | undefined) {
    if (name === undefined) return ''
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  function save() {
    if (reason === '') setReason(undefined)
    client.post('/chugs/strafbakken/', {'receiver': props.selected, 'reason': reason})
    .then(() => {
      let newStrafbakken: bakkenOverview[] = [];
      props.strafbakken.forEach(s => {
        if (s.username === props.selected) {
          s.bakken += 1
        }
        newStrafbakken.push(s)
      })
      props.setStrafbakken(newStrafbakken)
      props.onClose()
      toast({
        title: 'Gelukt!',
        description: `Yes hoppa ${formatName(props.selected)} heeft een bak verdiend`,
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'bottom-right'
      })
    })
    .catch( error => {
      props.onClose()
      toast({
        title: 'Strafbakken is weer stuk!',
        description: error,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'bottom-right'
      })
    })
  }

  return <>
  <Modal isOpen={props.isOpen} onClose={props.onClose}>
    <ModalOverlay />
    <ModalContent> 
      <ModalHeader>
        Geef {formatName(props.selected)} een strafbak
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormControl>
          <FormLabel>Reden</FormLabel>
          <Input onChange={(e) => setReason(e.target.value)}></Input>
        </FormControl>
      </ModalBody>
      <ModalFooter>
          <StyledButton mr={3} onClick={save}>
            Opslaan
          </StyledButton>
          <Button variant='ghost' onClick={props.onClose}>
            Niet opslaan
          </Button>
        </ModalFooter>
    </ModalContent>
  </Modal>
  </>
}

type StrafbakTableProps = {
  strafbakken: bakkenOverview[],
  setStrafbakken: React.Dispatch<React.SetStateAction<bakkenOverview[]>>,
  setErr: React.Dispatch<React.SetStateAction<string | undefined>>,
  setSelected: React.Dispatch<React.SetStateAction<string | undefined>>,
  onOpen: () => void,
  display: 'fst-half' | 'snd-half' | 'full'
}

function StrafbakTable(props: StrafbakTableProps ) {

  function trekbak(name: string) {
    let succes = false;
    let newStrafbakken: bakkenOverview[] = [];
    props.strafbakken.forEach(s => {
      if (s.username === name && s.bakken > 0) {
        s.bakken -= 1
        succes = true
      }
      newStrafbakken.push(s)
    })

    if (succes) {
      props.setStrafbakken(newStrafbakken)
      client.delete(`/chugs/strafbakken/${name}`)
      .catch(props.setErr)
    }
  }

  const half = Math.ceil(props.strafbakken.length / 2)
  let toDisplay = []
  switch (props.display) {
    case 'fst-half':
      toDisplay = props.strafbakken.slice(0, half)
      break
    case 'snd-half':
      toDisplay = props.strafbakken.slice(half)
      break
    case 'full':
      toDisplay = props.strafbakken
      break
  }

  return (
  <Table variant='striped' colorScheme='purple'>
    <Thead>
      <Tr>
        <Th>Naam</Th>
        <Th>Bakken</Th>
        <Th>Acties</Th>
      </Tr>
    </Thead>
    <Tbody>
      {toDisplay.map(s => (
        <Tr key={s.username}>
          <Td
            cursor="pointer"
            className="clickable-td">
            <LinkElem as={Link} href={`/strafbakken/${s.username}/`}>
              {(s.nickname||s.username).charAt(0).toUpperCase() + (s.nickname||s.username).slice(1)}
            </LinkElem>
          </Td>
          <Td 
            cursor="pointer"
            className="clickable-td">
            <LinkElem as={Link} href={`/strafbakken/${s.username}/`}>
                {s.bakken}
            </LinkElem>
          </Td>
          <Td>
            <Flex gap="24px">
              <AddIcon
                onClick={() => {
                  props.setSelected(s.username)
                  props.onOpen()
                }}
                cursor="pointer"
                transition="0.3s ease"
                _hover={{opacity: 0.7}}
              />

              {(s.bakken > 0) ? 
              <MinusIcon 
                onClick={() => trekbak(s.username)}
                cursor="pointer"
                transition="0.3s ease"
                _hover={{opacity: 0.7}}
              />
              : <MinusIcon opacity="0.5" />}
            </Flex>
          </Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
  )
}