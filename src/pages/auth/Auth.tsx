import { Flex, Box, FormControl, FormLabel, Input, Checkbox, Stack, Link, Button, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import { useState } from 'react'
import { Link as NavLink } from 'wouter';

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
    ]

    return arr[Math.floor(Math.random() * arr.length)] 
}

export default function Auth() {
    const [email, setEmail]         = useState<string>('')
    const [password, setPassword]   = useState<string>('')
    const [slogan, setSlogan]       = useState<string>(getSlogan())
    
    const mainBg = useColorModeValue('gray.50', 'gray.800')
    const squareBg = useColorModeValue('white', 'gray.700')
    const textColor = useColorModeValue('gray.600', 'white')

    const auth = () => {
        window.account.createEmailSession(email, password)
            .then(acc => {
                window.location.href = '/'
            })
            .catch(err => {
                setSlogan(err.message)
            })
    }

    return <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={mainBg}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Log in</Heading>
            <Text fontSize={'lg'} color={textColor}>
                {slogan}
            </Text>
            </Stack>
            <Box
            rounded={'lg'}
            bg={squareBg}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
                <FormControl id="email">
                    <FormLabel>Email address</FormLabel>
                    <Input type="email" value={email} onChange={c => setEmail(c.target.value)}/>
                </FormControl>
                
                <FormControl id="password" onKeyPress={e => {
                    if (e.key === 'Enter') {
                        auth()
                    }
                }}>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" value={password} onChange={c => setPassword(c.target.value)} />
                </FormControl>
                
                <Stack spacing={10}>
                
                <Stack
                    direction={{ base: 'column', sm: 'row' }}
                    align={'start'}
                    justify={'space-between'}>
                    <Checkbox>Remember me</Checkbox>
                    <Link as={NavLink} to="/forgot-password" color={'blue.400'}>Forgot password?</Link>
                </Stack>
                <Button
                    bg={'purple.400'}
                    color={'white'}
                    onClick={auth}
                    _hover={{
                    bg: 'purple.500',
                    }}>
                    Sign in
                </Button>
                </Stack>
            </Stack>
            </Box>
        </Stack>
    </Flex>
}