import { Flex, Box, FormControl, FormLabel, Input, Checkbox, Stack, Link, Button, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import { Link as NavLink } from 'wouter';

export default function ForgotPassword(): JSX.Element {
  return <Flex
  minH={'100vh'}
  align={'center'}
  justify={'center'}
  bg={useColorModeValue('gray.50', 'gray.800')}>
  <Stack spacing={0} mx={'auto'} maxW={'lg'}>
    <Stack align={'center'}>
      <Heading fontSize={'4xl'}>
        <Link as={NavLink} to="/">Ja das kut</Link>
      </Heading>
    </Stack>
  </Stack>
</Flex>
}