import { Heading } from '@chakra-ui/react';
import { useEffect } from 'react'
import { setTitle } from '../utils/utils';

export default function Index() {
  useEffect(() => {
    setTitle('Index')  
  })

  return <Heading as="h1" size="4xl">
    Index
  </Heading>
}