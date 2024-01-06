import {atom} from 'recoil'

const PostsAtom = atom ({
    key:'postsAtom',
    default:[],
})

export default PostsAtom;