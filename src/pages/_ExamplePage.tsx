import { Heading } from '@chakra-ui/react'
import { useEffect } from 'react'
import { setTitle } from '../utils/utils'

/**
 * This is not an actual page,
 * just here to copy to quickly create a new file
 */


export default function ExamplePage() {
  useEffect(() => {
    setTitle('Settings')
  }, [])

  return <Heading as="h1" size="4xl">
    ExamplePage
  </Heading>
}