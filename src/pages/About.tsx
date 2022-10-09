import { Box, Center, Divider, Heading, Link, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import { useEffect } from 'react'
import { getConfig, setTitle } from '../utils/utils';


export default function About() {
  const config = getConfig()
  
  const colors = {
    divider: useColorModeValue('gray.300', 'gray.700'),
  }

  useEffect(() => {
    setTitle('About')
  }, [])

  return <Box>
    <VStack spacing="10px" paddingBottom="20px">
      <Heading as="h1" size="2xl">
        {config.app.name}
      </Heading>
      <Heading as="h2" size="xl">
        {config.cicd.build.details.version}
      </Heading>

    </VStack>

    <Divider borderColor={colors.divider} />

    <VStack p="20px">
      <Center>
        <Text w="85%" textAlign="center">
          {config.app.description}
        </Text>
      </Center>
    </VStack>

    <Divider borderColor={colors.divider} />

    <VStack p="20px">
      <Text>
        Build on {new Date(config.cicd.build.details.buildDate * 1000).toLocaleString()}
      </Text>
      <Text>
        Commit {config.cicd.build.details.commit}
      </Text>
      <Text>
        Questions? <Link href={"mailto://" + config.app.author.email} color="purple.600" isExternal>Contact us</Link>
      </Text>

    </VStack>

    <Divider borderColor={colors.divider} />

    <VStack p="20px">
      <Center>
        <Text>
          Made with ❤️ by <Link color="purple.600" href={config.app.author.url}>{config.app.author.name}</Link>
        </Text>
      </Center>
    </VStack>
  </Box> 
    
}