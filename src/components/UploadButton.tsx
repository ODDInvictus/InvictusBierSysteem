import { Box, Button, Center } from '@chakra-ui/react'
import { useRef } from 'react'

type UploadButtonProps = {
  w?: string
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function UploadButton(props: UploadButtonProps) {

  const ref = useRef<HTMLInputElement>()

  const selectFile = () => {
    ref.current?.click()
  }

  return <Box w={props.w}>
    {/* @ts-ignore */}
    <input type="file" style={{ display: "none" }} ref={ref} onChange={props.onFileSelect}/>
    <Button w="full" onClick={selectFile}>Change Icon</Button>
  </Box>
}