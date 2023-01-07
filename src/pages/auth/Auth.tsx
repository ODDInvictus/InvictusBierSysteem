import { Flex, Box, FormControl, FormLabel, Input, Checkbox, Stack, Button, Heading, Text, useColorModeValue } from '@chakra-ui/react'
import { useState } from 'react'
import { client } from '../../utils/client'
import '../../styles/Auth.css'
import { StyledButton } from '../../components/StyledButton'

function getSlogan(): string {
  const arr: string[] = [
    'om goed te pilsen 🍻',
    'om dit epische systeem te gebruiken 😮',
    'voor een goed gesprek 💬',
    'om met de muziek te kloten 🎶',
    'om te zien hoe veel je nog moet drinken 🍺',
    'zodat je kan zien welke features missen 😎',
    'voor 60 euro 💰',
    'om een ice te vinden 😫',
    'om bugs te vinden 🐛',
    'om een bak te trekken 🍻',
    'voor jesus 🥐',
    'om koekjes te bakken 🍪',
    'om het getalletje omhoog te zien gaan 💯',
    'om nog zo\'n epische slogan te zien 🆒',
    'voor weezer 🍟',
    '[om deze slogan te ontgredelen] 🔒',
    'voor minder onzin! 🤡',
    'om het vuurwerk verbod tegen te gaan! 🎆',
    'om de nederlandse vlag goed te hangen! ⛳',
    'om te gaan golfen 🏌️‍♂️',
    'om uit te zoomen 📷',
    'om feuten te pesten 🤡',
  ]

  return arr[Math.floor(Math.random() * arr.length)]
}

export default function Auth() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [slogan, setSlogan] = useState<string>(getSlogan())

  const mainBg = useColorModeValue('gray.50', 'gray.800')
  const squareBg = useColorModeValue('white', 'gray.700')
  const textColor = useColorModeValue('white', 'white')

  const auth = () => {
    client.login(email, password)
      .then(() => {
        window.location.href = '/'
      }).catch(err => {
        setSlogan(err.message)
      })
  }

  return <Box className='auth-main'>
    <Flex
      minH={'100vh'}
      align={'center'}
      overflow={'hidden'}
      justify={'center'}
      bg={mainBg}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6} zIndex={10}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'} color={textColor}>Invictus Bier Systeem</Heading>
          <Text fontSize={'lg'} color={textColor}>
            Log in {slogan}
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={squareBg}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Gebruikersnaam</FormLabel>
              <Input type="email" value={email} onChange={c => setEmail(c.target.value)} />
            </FormControl>

            <FormControl id="password" onKeyPress={e => {
              if (e.key === 'Enter') {
                auth()
              }
            }}>
              <FormLabel>Wachtwoord</FormLabel>
              <Input type="password" value={password} onChange={c => setPassword(c.target.value)} />
            </FormControl>

            <Stack spacing={10}>

              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}>
                <Checkbox>Onthoud mij</Checkbox>
              </Stack>
              <StyledButton onClick={auth}>
                Log in
              </StyledButton>
            </Stack>
          </Stack>
        </Box>
      </Stack>

      <Box className="background-shape" /> 
    </Flex>
  </Box>
}