import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,

  useDisclosure,

} from "@chakra-ui/react";
import {BsFillImageFill} from 'react-icons/bs'
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import {useRecoilState, useRecoilValue} from 'recoil';
import userAtom from '../atoms/userAtom'
import useShowToast from "../hooks/useShowToast";
import PostsAtom from "../atoms/PostsAtom";
import { useParams } from "react-router-dom";


function CreatePost() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleImageChange, imgUrl,setImgUrl } = usePreviewImg();
  const imageRef = useRef(null)
  const [postText, setPostText] = useState("");
  const [remianingChar,setRemainnigChar]= useState(500)
  const user = useRecoilValue(userAtom)
  const showToast = useShowToast()
  const [loading,setLoading]=useState(false)
  const [posts,setPosts]=useRecoilState(PostsAtom);
  const {username} = useParams()


  const handleTextChange = (e) => {
    const inputtext=e.target.value
    if (inputtext.length>500){
        const truncatedText=inputtext.slice(0,500)
        console.log(truncatedText)
        setPostText(truncatedText);
        setRemainnigChar(0)
    }else{
        setPostText(inputtext)
        setRemainnigChar(500-inputtext.length)
    }
   
  };


  const handleCreatePost=async ()=>{
    setLoading(true)
   try {
    const res = await fetch ('/api/posts/create',{
      method:'post',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({postedBy:user._id,text:postText,img:imgUrl})
    })
    const data= await res.json()

    if (data.error){
      showToast('error',data.error,'error')
      return
    }
    showToast('success','post created successfully ','success')
    if (username === user.username){
      setPosts([data,...posts])
    }
    onClose()
    setPostText('')
    setImgUrl('')
   } catch (error) {
    showToast('error',error,'error')
   }finally{
    setLoading(false)
   }
  }

  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={10}
        leftIcon={<AddIcon />}
        onClick={onOpen}
      >
        Post
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="Post Content goes here"
                onChange={handleTextChange}
                value={postText}
              />
              <Text
                fontSize={"xs"}
                fontWeight={"bold"}
                textAlign={"right"}
                m={1}
                color={"gray.800"}
              >
                {remianingChar}/500
              </Text>
              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />
              <BsFillImageFill
              style={{marginLeft:'5px',cursor:'pointer'}}
              size={16}
              onClick={()=>{imageRef.current.click()}}
              />
            </FormControl>
            {imgUrl && (
                <Flex mt={5} w={'full'} position={'relative'} >
                    <Image src={imgUrl} alt="Selected Img"/>
                    <CloseButton onClick={()=>{setImgUrl('')}}
                    bg={'gray.800'} position={'absolute'}
                    top={2} right={2}/>
                </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreatePost} isLoading={loading}>
              Post
            </Button>

          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreatePost;
