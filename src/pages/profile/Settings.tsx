import { Box, Button, Divider, FormControl, FormHelperText, FormLabel, Heading, HStack, Radio, RadioGroup, Stack, useColorMode, useColorModeValue, useRadioGroup, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react'
import { ColorSchemes, getUserPreferences, setUserPreferences, UserPreferences } from '../../utils/user';
import { getConfig, setTitle } from '../../utils/utils';
import LoadingPage from '../LoadingPage';

const pages = {
  'Home': '/',
  'Cleaning Schedule': '/cleaning-schedule',
  'Inventory': '/inventory',
  'Profile': '/profile',
  'Settings': '/settings',
  'About': '/about',
}

function getKeyByValue(object: any, value: any) {
  return Object.keys(object).find(key => object[key] === value);
}

export default function Settings() {
  const [colorScheme, setColorScheme] = useState<string>('light')
  const [defaultPage, setDefaultPage] = useState<string>('Home')

  const [loading, setLoading] = useState<boolean>(true)

  const toast = useToast()

  const bgValue = useColorModeValue('white', 'purple.900')

  useEffect(() => {
    setTitle('Settings')
    getUserPreferences()
      .then(prefs => {
        console.log(prefs)
        setColorScheme(prefs.colorScheme)
        setDefaultPage(getKeyByValue(pages, prefs.defaultLocation)!)
      })
      .then(load)
  }, [])

  useEffect(() => {
    if (colorScheme === 'light') return

    const c = colorScheme === 'dark' ? 'dark' : 'light'
    setUserPreferences({ colorScheme: c })
  }, [colorScheme])

  useEffect(() => {
    if (defaultPage === 'Home') return
    // @ts-ignore
    const p: string = pages[defaultPage] ?? '/'
    setUserPreferences({ defaultLocation: p })
  }, [defaultPage])

  const load = () => setTimeout(() => setLoading(false), getConfig().app.minimalLoadingTime)

  const save = () => {
    toast({
      title: 'Settings saved!',
      isClosable: true,
    })
  }

  const loadingPage = <LoadingPage h="80vh"/>


  if (loading) return loadingPage

  return <Stack spacing="24px">
    <HStack spacing="20px">
      <Heading as="h3" size="4xl" p="10px">
        Settings
      </Heading>

      <Box pt="10px">
        <Button
          colorScheme="purple"
          bgGradient="linear(to-r, purple.600, purple.500, purple.400)"
          _hover={{
            bg: 'purple.500',
          }}
          maxW="100"
          color="white"
          onClick={save}
          variant="solid">
          Save
        </Button>
      </Box>

    </HStack>

    <Divider />

    <Box bg={bgValue} maxW="min-content" px="25px" py="10px" borderRadius="lg" borderWidth="1px" overflow="auto">
      <FormControl>
        <FormLabel>Default page</FormLabel>
        <RadioGroup onChange={setDefaultPage} value={defaultPage}>
          <HStack spacing='24px'>
            {Object.keys(pages).map(key => <Radio colorScheme='purple' key={key} value={key}>{key}</Radio>)}
          </HStack>
        </RadioGroup>
        <FormHelperText>Select the page you first see when you log in!</FormHelperText>
      </FormControl>
    </Box>

    <Divider />

    <Box bg={bgValue} maxW="min-content" px="25px" py="10px" borderRadius="lg" borderWidth="1px" overflow="auto">
      <FormControl>
        <FormLabel>Dark Mode</FormLabel>
        <RadioGroup onChange={setColorScheme} value={colorScheme}>
          <HStack spacing='24px'>
            <Radio colorScheme='purple' value={'light'}>Light</Radio>
            <Radio colorScheme='purple' value={'dark'}>Dark</Radio>
            <Radio colorScheme='purple' value={'light-default'}>Default</Radio>
          </HStack>
        </RadioGroup>
        <FormHelperText>Default colorscheme</FormHelperText>
      </FormControl>
    </Box>

    <Divider />


  </Stack>

}